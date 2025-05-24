import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

const categories = ['Air', 'Water', 'Population', 'Electric', 'Transportation'] as const;

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-row flex-wrap justify-between p-4 bg-white flex-1">
      {categories.map((item) => (
        <Pressable
          key={item}
          onPress={() => router.push({ pathname: `/home/${item}Detail` })}
          className="w-[47%] aspect-square bg-cyan-300 rounded-2xl shadow-md mb-4 items-center justify-center"
        >
          <Text className="text-lg font-semibold text-white">{item}</Text>
        </Pressable>
      ))}
    </View>
  );
}

