import { useAuth, UserRole } from "@/context/auth";
import { Button, Text, View } from "react-native";

const Index = () => {
  const { setUser } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Auth Index</Text>

      <Button
        title="Sign in"
        onPress={() => setUser({ name: "duy", email: "duy@gmail.com", role: UserRole.User })}
      />
    </View>
  );
};

export default Index;
