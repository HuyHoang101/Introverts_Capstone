import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { Feather } from "@expo/vector-icons";

const linkedAccounts = ["Google", "Facebook", "Email"];

export default function LinkAccount() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        {linkedAccounts.map((account) => (
          <TouchableOpacity
            key={account}
            className="flex-row justify-between items-center py-4 border-b border-gray-200"
            onPress={() => console.log(`Link ${account}`)}
          >
            <Text className="text-base">{account}</Text>
            <Feather name="link" size={20} color="#555" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
