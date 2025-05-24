import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack> 
      <Stack.Screen
        name="index"
        options={{ title: "Report" }}
      />
      <Stack.Screen
        name="ReportDetail"
        options={{ title: "Detail" }}
      />
    </Stack>
  );
}
