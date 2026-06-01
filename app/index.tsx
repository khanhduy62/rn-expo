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
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/profile">Go to profile</Link>
      <Link
        href={{
          pathname: "/profile/[id]",
          params: {
            id: getRandomGithubAvatar(),
          },
        }}
      >
        Go to random profile
      </Link>

      <Link
        href={{
          pathname: "/settings",
          params: {
            name: "Expo Router",
          },
        }}
      >
        Go to settings
      </Link>
    </View>
  );
}
