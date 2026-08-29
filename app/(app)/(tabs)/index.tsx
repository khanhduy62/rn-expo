import { useAuth } from "@/context/auth";
import { Link } from "expo-router";
import { Button, Text, View } from "react-native";

const getRandomGithubAvatar = () => {
  const randomId = Math.floor(Math.random() * 1000);
  return `https://avatars.githubusercontent.com/u/${randomId}`;
};

export default function Index() {
  const { setUser } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text testID="home-screen">Home Screen</Text>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/deeplinking/1">Go to deeplinking details</Link>
      <Link href="/profile">Go to profile</Link>
      <Link href="/profile/settings">Go to profile setting</Link>
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

      <Button
        title="Sign out"
        color="#f44336"
        onPress={() => setUser(undefined)}
      />
    </View>
  );
}
