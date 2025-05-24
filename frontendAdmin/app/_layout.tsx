import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs
      initialRouteName="data"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 60 },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen name="data" options={{ title: "Data" }} />
      <Tabs.Screen name="report" options={{ title: "Report" }} />
      <Tabs.Screen name="user" options={{ title: "User" }} />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}