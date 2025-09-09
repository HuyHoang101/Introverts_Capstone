import { View, Text, Switch } from "react-native";
import { useChat } from "@/component/ChatContext";
import React from "react";

export default function SettingScreen() {
  const { visible, setVisible } = useChat();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-16 py-4">
        <Text className="text-black">AI Chat Bot</Text>
        <Switch value={visible} onValueChange={setVisible} />
      </View>
    </View>
  );
}
