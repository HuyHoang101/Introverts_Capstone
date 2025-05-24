import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';
import { format } from 'date-fns';

function formatDate(datetime: string) {
  return format(new Date(datetime), 'dd MMM yyyy, HH:mm');
}

export default function ReportDetail() {
  const { title, location, datetime, problem, description } = useLocalSearchParams();

  return (
    <ScrollView className="p-4 bg-white flex-1">
      <Text className="text-2xl font-bold mb-2">{title}</Text>

      <Text className="text-gray-500 mb-1">
        Date & Time: {formatDate(datetime as string)}
      </Text>

      <Text className="text-gray-500 mb-4">
        Location: {location}
      </Text>

      <Text className="text-lg font-semibold">Problem</Text>
      <Text className="mb-4 text-base">{problem}</Text>

      <Text className="text-lg font-semibold">Description</Text>
      <Text className="text-base">{description}</Text>
    </ScrollView>
  );
}
