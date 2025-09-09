import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';

const languages = ["English", "Vietnamese"];

export default function Language() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang}
            className="flex-row justify-between items-center py-4 border-b border-gray-200"
            onPress={() => console.log(`Selected ${lang}`)}
          >
            <Text className="text-base text-black">{lang}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
