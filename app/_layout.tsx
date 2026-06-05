import { AuthContextProvider } from "@/context/auth";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <Slot />
    </AuthContextProvider>
  );
}
