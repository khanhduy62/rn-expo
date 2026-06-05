import { Link } from "expo-router";
import { Text, View } from "react-native";

const getRandomGithubAvatar = () => {
  const randomId = Math.floor(Math.random() * 1000);
  return `https://avatars.githubusercontent.com/u/${randomId}`;
};

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Day la file index trong modals</Text>
    </View>
  );
}
