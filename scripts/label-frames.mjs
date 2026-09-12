// Match simulator frames sampled during a Maestro run to the step that was
// running when each was taken, so a flow can be traced step by step without
// adding takeScreenshot commands to the flow itself.
//
//   node scripts/label-frames.mjs .maestro/artifacts
//
// Reads  <art>/frames/<epoch-ms>.png  +  <art>/maestro/**/commands.json
// Writes <art>/steps/NN-<command>[-STATUS].png
import { copyFileSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const art = process.argv[2];
if (!art) {
  console.error("usage: node scripts/label-frames.mjs <artifacts-dir>");
  process.exit(2);
}

function findFile(dir, name) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      const hit = findFile(full, name);
      if (hit) return hit;
    } else if (entry.name === name) {
      return full;
    }
  }
  return null;
}

// Internal bookkeeping steps - they never correspond to anything on screen.
const NOISE = new Set(["defineVariables", "applyConfiguration"]);

function describe(command) {
  const [key, value] = Object.entries(command ?? {})[0] ?? [];
  if (!key) return null;
  const type = key.replace(/Command$/, "").replace(/OnElement$/, "On");
  if (NOISE.has(type)) return null;
  // Pull whatever identifies the target: link, text, regex, id.
  const target = JSON.stringify(value ?? {}).match(
    /"(?:link|text|textRegex|idRegex|id|path)"\s*:\s*"([^"]{1,30})"/,
  )?.[1];
  const slug = (target ?? "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return slug ? `${type}-${slug}` : type;
}

let frames = [];
try {
  frames = readdirSync(join(art, "frames"))
    .filter((f) => f.endsWith(".png"))
    .map((f) => ({ at: Number(f.replace(".png", "")), path: join(art, "frames", f) }))
    .filter((f) => Number.isFinite(f.at))
    .sort((a, b) => a.at - b.at);
} catch {
  console.error("no frames/ directory - was the run started with --filmstrip?");
  process.exit(0);
}

const commandsPath = findFile(join(art, "maestro"), "commands.json");
if (!commandsPath) {
  console.error("no commands.json under maestro/ - cannot align frames to steps");
  process.exit(0);
}
const commands = JSON.parse(readFileSync(commandsPath, "utf8"));

mkdirSync(join(art, "steps"), { recursive: true });
let n = 0;
let kept = 0;
for (const { command, metadata } of commands) {
  const label = describe(metadata?.evaluatedCommand ?? command);
  if (!label) continue;
  n += 1;
  const start = metadata.timestamp;
  const end = start + (metadata.duration ?? 0);
  // The last frame inside the step's window shows its result. Steps shorter
  // than the sampling interval get the first frame after they started.
  const during = frames.filter((f) => f.at >= start && f.at <= end);
  const frame = during.at(-1) ?? frames.find((f) => f.at > end) ?? frames.at(-1);
  if (!frame) continue;
  const status = metadata.status === "COMPLETED" ? "" : `-${metadata.status}`;
  const name = `${String(n).padStart(2, "0")}-${label}${status}.png`;
  copyFileSync(frame.path, join(art, "steps", name));
  kept += 1;
  const secs = ((metadata.duration ?? 0) / 1000).toFixed(1);
  console.log(`    ${name}  (${secs}s, ${metadata.status})`);
}

const size = frames.reduce((t, f) => t + statSync(f.path).size, 0);
console.log(
  `    ${kept}/${n} steps matched from ${frames.length} frames (${(size / 1e6).toFixed(1)} MB sampled)`,
);
