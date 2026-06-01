import { Link, Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function ProfileIndex() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Profile Title",
        }}
      />

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Profile</Text>
        <Pressable onPress={() => router.back()}>
          <Text>Go back to home 1</Text>
        </Pressable>
        <Link dismissTo href="/">
          Go back to home 2
        </Link>
      </View>
    </>
  );
}
