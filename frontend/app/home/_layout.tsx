import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Dashboard" }}
      />
      <Stack.Screen
        name="AirDetail"
        options={{ title: "Air Detail" }}
      />
      <Stack.Screen
        name="WaterDetail"
        options={{ title: "Water Detail" }}
      />
      <Stack.Screen
        name="PopulationDetail"
        options={{ title: "Population Detail" }}
      />
      <Stack.Screen
        name="TrasportationDetail"
        options={{ title: "Transportation Detail" }}
      />
      <Stack.Screen
        name="ElectricDetail"
        options={{ title: "Electric Detail" }}
      />
    </Stack>
  );
}
