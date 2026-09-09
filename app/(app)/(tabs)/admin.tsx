import Button from "@/components/Button";
import { useAuth, User, UserRole } from "@/context/auth";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

async function fetchHello() {
  const response = await fetch("/api/hello");
  const data = await response.json();
  alert("data: " + JSON.stringify(data));
}

export default function AdminScreen() {
  const { user, setUser } = useAuth();
  const [postResponse, setPostResponse] = useState();
  const [getResponse, setGetResponse] = useState();

  async function handlePostReq(userId: string) {
    try {
      const response = await fetch("/api/user", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          userId,
        }),
      });

      if (!response.ok) {
        // Handle HTTP errors explicitly
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPostResponse(data);
      console.log("Client", data);
    } catch (e) {
      alert("Something went wrong");
      console.log(e);
    }
  }

  async function handleGetReq() {
    try {
      const response = await fetch("/api/user", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      });

      if (!response.ok) {
        // Handle HTTP errors explicitly
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setGetResponse(data);
      console.log("Client", data);
    } catch (e) {
      alert("Something went wrong");
      console.log(e);
    }
  }

  if (user?.role !== UserRole.Admin) {
    return (
      <View style={styles.container}>
        <Text>You don't have access</Text>
        <Button
          onPress={() =>
            setUser((prev) => ({ ...prev, role: UserRole.Admin }) as User)
          }
        >
          Become an Admin
        </Button>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text>Hello {user?.name}</Text>
      <Button onPress={fetchHello}>Fetch Hello</Button>
      <Button onPress={() => handlePostReq("123")}>POST User</Button>
      <Button onPress={handleGetReq}>GET Users</Button>
      <Text>POST Response: {JSON.stringify(postResponse)}</Text>
      <Text>GET Response: {JSON.stringify(getResponse, null, 2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 16,
  },
});
