import { AuthContextProvider } from "@/context/auth";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <GestureHandlerRootView>
        <Slot />
      </GestureHandlerRootView>
    </AuthContextProvider>
  );
}
