import { useAuth, User, UserRole } from "@/context/auth";
import { Button, StyleSheet, Text, View } from "react-native";

export default function AdminScreen() {
  const { user, setUser } = useAuth();

  if (user?.role !== UserRole.Admin) {
    return (
      <View style={styles.container}>
        <Text>You don't have access</Text>
        <Button
          title="Become an Admin"
          onPress={() =>
            setUser((prev) => ({ ...prev, role: UserRole.Admin } as User))
          }
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text>Hello {user?.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});