import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useCallback, useState } from 'react';
import { Feather, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { getUserInfo } from '@/service/authService'; // 👈 Import hook
import { logout } from '@/service/authService';
import { set } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string; // Optional avatar URL
  phone: string;
  address: string;
  birthday: string;
  createdAt: string;
  updatedAt: string;
}

export default function Index() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getUserInfo().then((data) => {
        if (data?.avatar === "https://example.com/default-avatar.png") {
          const updated = {
            ...data,
            avatar: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
          };
          setUser(updated);
        } else {
          setUser(data);
        }
      });
    }, [])
  );


  return (
    <ScrollView className="flex-col bg-white">
      {/* Header: Avatar + Name + UID */}
      <View className="items-center mt-20">
        {/* Avatar */}
        <Image
          source={{ uri: user?.avatar }}
          className="rounded-full"
          style={{height:136, width: 136}}
        />
        {/* User Info */}
        <View className="mt-4 items-center">
          <Text className="text-lg font-bold">{user?.name || 'Unknown User'}</Text>
          <Text className="text-gray-500">Email: {user?.email || 'example@gmail.com'}</Text>
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
          onPress={async () => {
            if (loggingOut) return; // chặn double tap
            setLoggingOut(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            logout();
            router.replace("/(auth)/login");
          }}
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
