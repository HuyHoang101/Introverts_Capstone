import { Stack } from "expo-router";
import { Feather, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { Text, View } from "react-native";

function HeaderWithIcon({ icon, label }: { icon: React.ReactNode; label: string })
 {
  return (
    <View className="flex-row items-center space-x-2">
      {icon}
      <Text className="text-base font-semibold">{label}</Text>
    </View>
  );
}

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Dashboard",
          headerTitle: () => (
            <HeaderWithIcon
              icon={<Feather name="home" size={20} color="#333" />}
              label="Dashboard"
            />
          ),
        }}
      />

      <Stack.Screen
        name="AirDetail"
        options={{
          headerTitle: () => (
            <HeaderWithIcon
              icon={<Feather name="wind" size={20} color="#333" />}
              label="Air Quality"
            />
          ),
        }}
      />

      <Stack.Screen
        name="WaterDetail"
        options={{
          headerTitle: () => (
            <HeaderWithIcon
              icon={<Feather name="droplet" size={20} color="#333" />}
              label="Water Quality"
            />
          ),
        }}
      />

      <Stack.Screen
        name="PopulationDetail"
        options={{
          headerTitle: () => (
            <HeaderWithIcon
              icon={<MaterialCommunityIcons name="account-group" size={20} color="#333" />}
              label="Population"
            />
          ),
        }}
      />

      <Stack.Screen
        name="TransportationDetail"
        options={{
          headerTitle: () => (
            <HeaderWithIcon
              icon={<FontAwesome5 name="bus" size={18} color="#333" />}
              label="Transportation"
            />
          ),
        }}
      />

      <Stack.Screen
        name="ElectricDetail"
        options={{
          headerTitle: () => (
            <HeaderWithIcon
              icon={<Feather name="zap" size={20} color="#333" />}
              label="Electric Usage"
            />
          ),
        }}
      />
    </Stack>
  );
}
