import { View, Text, ScrollView } from 'react-native';
import React from 'react';

const notifications = [
  "Welcome to the app!",
  "Your password was changed successfully.",
  "New features are available now.",
];

export default function Notifications() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        {notifications.map((note, idx) => (
          <View
            key={idx}
            className="py-3 border-b border-gray-200"
          >
            <Text className="text-base text-gray-800">{note}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
