import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function DeepLinkingScreen() {
  const params = useLocalSearchParams();
  console.log("log--params ", params);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>This is a deeplinking screen with ID: {params.id}</Text>
    </View>
  );
}
