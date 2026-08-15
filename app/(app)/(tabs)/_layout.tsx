import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, animation: "shift" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" color={color} size={size} />
          ),
          headerShown: true,
          headerTitle: "Settings Title",
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: "Admin",
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              size={28}
              name="admin-panel-settings"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="gestures-animations"
        options={{
          title: "Gest/Anim",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="animation" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
