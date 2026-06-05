import { Stack } from "expo-router";

export default function ModalsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="profile/settings"
        options={{
          headerShown: true,
          headerTitle: "Settings Title",
        }}
      />
    </Stack>
  );
}
