import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Sustainablity Data" }} />
      <Stack.Screen name="AirDetail" options={{ headerShown: true, title: "Pollution Detail" }} />
    </Stack>
  );
}
