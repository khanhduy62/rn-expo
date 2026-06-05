import { Link, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function Settings() {
  const { name } = useLocalSearchParams();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Settings</Text>
      <Text>Name: {name}</Text>
      <Link href="/">Go back to home</Link>
    </View>
  );
}
