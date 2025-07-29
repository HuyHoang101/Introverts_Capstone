import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, 
        }}
      />
      <Stack.Screen
        name="ElectricDetail"
        options={{
          title: "Electric Detail",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WaterDetail"
        options={{
          title: "Air Detail",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WaterList"
        options={{
          title: "Water List",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ElectricList"
        options={{
          title: "Air Detail",
          headerShown: false,
        }}
      />
    </Stack>
  );
}