import { Text, View } from "react-native";

/**
 * Required fallback sibling for `swift-ui.ios.tsx` — expo-router throws if a
 * platform-extension route has no extension-less sibling. Must not import
 * `@expo/ui`: the `ExpoUI` native module does not exist on web. The tab itself
 * is hidden on non-iOS by `Tabs.Protected`, so this rarely renders.
 */
export default function SwiftUiScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>SwiftUI is only available on iOS.</Text>
    </View>
  );
}
