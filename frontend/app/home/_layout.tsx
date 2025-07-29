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
          headerShown: false
        }}
      />
    </Stack>
  );
}
