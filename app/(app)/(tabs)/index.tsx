import { useAuth } from "@/context/auth";
import { Link } from "expo-router";
import { Button, Text, View } from "react-native";

const getRandomGithubAvatar = () => {
  const randomId = Math.floor(Math.random() * 1000);
  return `https://avatars.githubusercontent.com/u/${randomId}`;
};

async function fetchHello() {
  const response = await fetch('/api/hello');
  const data = await response.json();
  alert('data: ' + JSON.stringify(data));
}

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
      <Text>Expo ENV: {process.env.EXPO_PUBLIC_API_URL}</Text>
      <Button onPress={() => fetchHello()} title="Fetch hello" />
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

const jsonKeys = {
  "name":"rn-expo",
  "slug":"rn-expo",
  "version":"1.0.0",
  "orientation":"portrait",
  "icon":"./assets/images/icon.png",
  "scheme":"rnexpo",
  "userInterfaceStyle":"automatic",
  "newArchEnabled":true,
  "ios":{"supportsTablet":true,"bundleIdentifier":"com.dle-radicle.rn-expo"},
  "android":{"adaptiveIcon":{"backgroundColor":"#E6F4FE","foregroundImage":"./assets/images/android-icon-foreground.png","backgroundImage":"./assets/images/android-icon-background.png","monochromeImage":"./assets/images/android-icon-monochrome.png"},"predictiveBackGestureEnabled":false,"package":"com.dleradicle.rnexpo"},
  "web":{"output":"static","favicon":"./assets/images/favicon.png"},
  "plugins":["expo-router",["expo-splash-screen",{"image":"./assets/images/splash-icon.png","imageWidth":200,"resizeMode":"contain","backgroundColor":"#ffffff","dark":{"backgroundColor":"#000000"}}],"expo-font","expo-image","expo-status-bar","expo-web-browser"],
  "experiments":{"typedRoutes":true,"reactCompiler":true},
  "extra":{"router":{},"eas":{"projectId":"3b299ab8-e18a-4ecd-9287-9f433c3a2265"}}
}