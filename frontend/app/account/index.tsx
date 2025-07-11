import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Feather, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useUser } from "../account/contexts/UserContext"; // 👈 Import hook

export default function Index() {
  const router = useRouter();
  const { username, avatar } = useUser(); // 👈 Lấy data từ Context

  return (
    <ScrollView className="flex-col bg-white">
      {/* Header: Avatar + Name + UID */}
      <View className="items-center mt-20">
        {/* Avatar */}
        <Image
          source={{ uri: avatar }}
          className="rounded-full"
          style={{height:136, width: 136}}
        />
        {/* User Info */}
        <View className="mt-4 items-center">
          <Text className="text-lg font-bold">{username}</Text>
          <Text className="text-gray-500">UID: 123456789</Text>
        </View>
      </View>

      {/* Account Options */}
      <View className="mt-10 px-4">
        <AccountItem
          icon={<Feather name="user" size={24} color="#333" />}
          label="Profile"
          onPress={() => router.push("/account/Profile")}
        />
        <AccountItem
          icon={<Feather name="lock" size={24} color="#333" />}
          label="Security Settings"
          onPress={() => router.push("/account/Setting")}
        />
        <AccountItem
          icon={<Feather name="link" size={24} color="#333" />}
          label="Linked Accounts"
          onPress={() => router.push("/account/LinkAccount")}
        />
        <AccountItem
          icon={<Feather name="globe" size={24} color="#333" />}
          label="Language"
          onPress={() => router.push("/account/Language")}
        />
        <AccountItem
          icon={<Feather name="bell" size={24} color="#333" />}
          label="Notifications"
          onPress={() => router.push("/account/Notifications")}
        />
        <AccountItem
          icon={<MaterialIcons name="logout" size={24} color="red" />}
          label="Logout"
          isDestructive
          onPress={() => console.log('Logout pressed')}
        />
      </View>
    </ScrollView>
  );
}

function AccountItem({
  icon,
  label,
  isDestructive = false,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  isDestructive?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between bg-gray-100 px-4 py-6 rounded-xl mb-4"
    >
      <View className="flex-row items-center space-x-4">
        {icon}
        <Text className={`text-base ${isDestructive ? 'text-red-500' : 'text-gray-800'}`}>{label}</Text>
      </View>
      <AntDesign name="right" size={16} color="#ccc" />
    </TouchableOpacity>
  );
}
