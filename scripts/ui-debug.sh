#!/usr/bin/env bash
#
# Put the app on a screen on the iOS simulator and dump everything needed to
# debug it - screenshot, view hierarchy, Metro/JS log, per-step Maestro log.
#
#   ./scripts/ui-debug.sh                              # home screen
#   ./scripts/ui-debug.sh profile/settings             # jump to a route
#   ./scripts/ui-debug.sh deeplinking/2
#   ./scripts/ui-debug.sh --flow .maestro/admin_become_admin.yaml
#   ./scripts/ui-debug.sh profile --restart-metro      # own Metro, capture its log
#   ./scripts/ui-debug.sh profile --hierarchy          # also dump the view tree (slow)
#
# When the route is unknown and the screen is only reachable by tapping, run an
# existing flow and sample the screen throughout - no edits to the flow needed:
#
#   ./scripts/ui-debug.sh --flow .maestro/admin_become_admin.yaml --filmstrip
#
# --filmstrip screenshots the simulator every second during the run, then uses
# the timestamps in Maestro's own commands.json to line each frame up with the
# step it belongs to, in .maestro/artifacts/steps/NN-<command>.png
#
# Artifacts land in .maestro/artifacts/ (gitignored), overwritten every run.
set -uo pipefail

BUNDLE_ID="com.dle-radicle.rn-expo"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ART="$ROOT/.maestro/artifacts"
FLOW="$ROOT/.maestro/debug/screen.yaml"
ROUTE=""
RESTART_METRO=0
DUMP_HIERARCHY=0
FILMSTRIP=0
KEEP_FRAMES=0

while [ $# -gt 0 ]; do
  case "$1" in
    --flow) FLOW="$2"; shift 2 ;;
    --restart-metro) RESTART_METRO=1; shift ;;
    --hierarchy) DUMP_HIERARCHY=1; shift ;;
    --filmstrip) FILMSTRIP=1; shift ;;
    --keep-frames) FILMSTRIP=1; KEEP_FRAMES=1; shift ;;
    -h|--help) sed -n '2,23p' "${BASH_SOURCE[0]}"; exit 0 ;;
    *) ROUTE="$1"; shift ;;
  esac
done

cd "$ROOT"

# yarn/npm run scripts in a non-login shell, so ~/.zshrc is never sourced and
# ~/.maestro/bin drops off PATH. Resolve the binaries by hand instead.
MAESTRO="${MAESTRO:-$(command -v maestro || true)}"
[ -x "$MAESTRO" ] || MAESTRO="$HOME/.maestro/bin/maestro"
if [ ! -x "$MAESTRO" ]; then
  echo "maestro not found on PATH or at ~/.maestro/bin/maestro" >&2
  echo "install: curl -Ls https://get.maestro.mobile.dev | bash" >&2
  exit 127
fi
# The Maestro CLI itself runs on the JVM (same on iOS and Android), and the
# /usr/bin/java stub is not always resolvable from a non-login shell. Maestro
# needs 17+, so skip the older JDKs sitting in the same folder.
if ! command -v java >/dev/null 2>&1 && [ -z "${JAVA_HOME:-}" ]; then
  for jdk in /Library/Java/JavaVirtualMachines/*/Contents/Home; do
    [ -x "$jdk/bin/java" ] || continue
    v=$("$jdk/bin/java" -version 2>&1 | sed -n 's/.*version "\([0-9]*\).*/\1/p' | head -1)
    if [ "${v:-0}" -ge 17 ] 2>/dev/null; then
      export JAVA_HOME="$jdk"
      export PATH="$jdk/bin:$PATH"
      break
    fi
  done
fi

# Xcode 26 takes well over Maestro's default allowance to bring up the XCUITest
# driver on a cold simulator - xcodebuild was still starting up ~60s after
# Maestro had already given up. Everything else here is useless without it.
export MAESTRO_DRIVER_STARTUP_TIMEOUT="${MAESTRO_DRIVER_STARTUP_TIMEOUT:-300000}"

rm -rf "$ART"
mkdir -p "$ART"

# 1. A booted simulator. Whichever one was last open is fine.
if ! xcrun simctl list devices booted | grep -q "(Booted)"; then
  echo "==> booting simulator"
  open -a Simulator
  for _ in $(seq 60); do
    xcrun simctl list devices booted | grep -q "(Booted)" && break
    sleep 1
  done
fi
xcrun simctl list devices booted | grep "(Booted)" | sed 's/^/    /'

# 2. Metro. If someone else's terminal owns it, its output is unreachable from
#    here - say so rather than leaving an empty metro.log around.
metro_up() { curl -sf --max-time 3 http://localhost:8081/status >/dev/null 2>&1; }
if [ "$RESTART_METRO" = 1 ] && metro_up; then
  echo "==> killing the Metro on :8081 to take over its log"
  lsof -ti :8081 | xargs kill 2>/dev/null
  for _ in $(seq 15); do metro_up || break; sleep 1; done
fi
if metro_up; then
  echo "==> Metro already running: JS logs stay in its terminal, not in artifacts/"
  echo "    re-run with --restart-metro to capture them here"
else
  echo "==> starting Metro, logging to .maestro/artifacts/metro.log"
  npx expo start --dev-client >"$ART/metro.log" 2>&1 &
  for _ in $(seq 60); do metro_up && break; sleep 1; done
fi

# 3. The dev build. Only rebuild when the app is missing entirely; a JS-only
#    change needs no rebuild, Metro serves it.
if ! xcrun simctl get_app_container booted "$BUNDLE_ID" >/dev/null 2>&1; then
  echo "==> $BUNDLE_ID not installed, running expo run:ios (first build is slow)"
  npx expo run:ios || exit 1
fi

# 4. Native console, for crashes and anything the RedBox swallows.
xcrun simctl spawn booted log stream --level debug \
  --predicate "processImagePath CONTAINS \"rnexpo\"" >"$ART/ios.log" 2>&1 &
LOG_PID=$!
trap 'kill $LOG_PID 2>/dev/null' EXIT

# 5. Optional frame sampler. Named by capture time in epoch ms, which is what
#    label-frames.mjs joins against the step timestamps in commands.json.
if [ "$FILMSTRIP" = 1 ]; then
  echo "==> sampling the screen every second"
  mkdir -p "$ART/frames"
  (
    while :; do
      now=$(perl -MTime::HiRes -e 'print int(Time::HiRes::time()*1000)')
      xcrun simctl io booted screenshot "$ART/frames/$now.png" >/dev/null 2>&1
      sleep 1
    done
  ) &
  FRAME_PID=$!
  trap 'kill $LOG_PID $FRAME_PID 2>/dev/null' EXIT
fi

# 6. Drive it.
echo "==> maestro test $(basename "$FLOW") ${ROUTE:+(route: $ROUTE)}"
"$MAESTRO" test "$FLOW" --env ROUTE="$ROUTE" --debug-output "$ART/maestro"
STATUS=$?
[ -n "${FRAME_PID:-}" ] && kill "$FRAME_PID" 2>/dev/null

# 7. Capture the end state regardless of pass/fail. Cheap things first.
xcrun simctl io booted screenshot "$ART/final.png" >/dev/null 2>&1
SHOT=$(find "$ART/maestro" -name "screen.png" -print -quit 2>/dev/null)
[ -n "$SHOT" ] && cp "$SHOT" "$ART/screen.png"

if [ "$FILMSTRIP" = 1 ]; then
  echo "==> matching frames to steps"
  node "$ROOT/scripts/label-frames.mjs" "$ART"
  [ "$KEEP_FRAMES" = 1 ] || rm -rf "$ART/frames"
fi

# `maestro hierarchy` is a separate session, so it tears down and rebuilds the
# XCUITest driver - another minute or two. Only worth it when a selector is the
# thing being debugged, so keep it behind a flag.
if [ "$DUMP_HIERARCHY" = 1 ]; then
  echo "==> dumping view hierarchy (restarts the driver, slow)"
  "$MAESTRO" hierarchy >"$ART/hierarchy.json" 2>"$ART/hierarchy.err"
  [ -s "$ART/hierarchy.err" ] || rm -f "$ART/hierarchy.err"
fi
[ -s "$ART/metro.log" ] || rm -f "$ART/metro.log"

echo
echo "==> flow exited $STATUS. artifacts in .maestro/artifacts/:"
(cd "$ART" && find . -type f -size +0 | sed 's|^\./|    |' | sort)
exit $STATUS
