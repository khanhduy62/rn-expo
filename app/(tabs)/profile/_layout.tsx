import { Stack } from "expo-router";

export default function ProfileRootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: true,
          headerTitle: "Settings Title",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
