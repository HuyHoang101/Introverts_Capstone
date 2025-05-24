import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

type Report = {
  title: string;
  location: string;
  datetime: string;
  problem: string;
  description: string;
};

function formatDate(datetime: string) {
    return format(new Date(datetime), 'dd MMM yyyy, HH:mm');
}

export default function Home() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/report') // thay đổi nếu dùng Android/device
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error('Lỗi fetch:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-2">Đang tải báo cáo...</Text>
      </View>
    );
  }

  return (
    <View className="p-4 bg-gray-100 flex-1">
      <FlatList
        data={reports}
        keyExtractor={(_, index) => index.toString()} // không có id, dùng index
        renderItem={({ item }) => (
          <Pressable
            className="bg-white rounded-xl p-4 mb-2 shadow"
            onPress={() => router.push({ pathname: '/report/ReportDetail', params: item })}
          >
            <Text className="text-lg font-bold">{item.title}</Text>
            <Text className="text-gray-500">{formatDate(item.datetime)}</Text>
            <Text className="text-sm text-gray-600">{item.location}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
