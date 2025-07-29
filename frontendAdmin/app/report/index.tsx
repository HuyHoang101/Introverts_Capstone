import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity} from 'react-native';
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
        <Text className="mt-2">Loading...</Text>
      </View>
    );
  }

  const goToBuilding = (building: string, title: string) => {
    router.push({
      pathname: '/report/ReportDetail',
      params: {
        type: title,
        name: building
      },
    });
  };

  const customButton = (building: string, title: string, num: number ) => {
    return(
      <>
        <TouchableOpacity className='p-4 py-8 w-0.95 mt-3 mr-3 bg-green-50 rounded-lg shadow items-center justify-center'>
          <Text className='font-medium text-xl'>{building}</Text>
        </TouchableOpacity>
        {num > 0 ? (
          <View className='absolute top-0 right-0 bg-red-600 w-6 aspect-square rounded-full items-center justify-center'>
            <Text className='text-white font-semibold'>{num}</Text>
          </View>
        ) : (<></>)}
      </>
    );
  };

  return (
    <ScrollView 
    className="p-4 bg-white flex-1"
    contentContainerStyle={{paddingBottom: 20}}
    showsVerticalScrollIndicator={false}>
      {/* TODO: WATER REPORT */}
      <View className='flex-row items-center mb-2'>
        <Text className='font-semibold text-3xl mr-2'>Water</Text>
        <Image source={require('../../assets/images/drop.png')} style={{width: 36, height: 36}}/>
      </View>
      <View className='flex-col'>
        <View className='flex-row max-w-full mb-2'>
          <View className='flex w-1/2 mr-3'>
            {customButton('Building 1', 'water', 2)}
          </View>
          <View className='flex w-1/2'>
            {customButton('Building 2', 'water', 3)}
          </View>
        </View>
        <View className='flex-row max-w-full'>
          <View className='flex w-1/2 mr-3'>
            {customButton('Building 8', 'water', 0)}
          </View>
          <View className='flex w-1/2'>
            {customButton('Sports Halls', 'water', 1)}
          </View>
        </View>
      </View>

      {/* TODO: ELECTRIC REPORT */}
      <View className='flex-row items-center mt-6 mb-2'>
        <Text className='font-semibold text-3xl mr-2'>Electric</Text>
        <Image source={require('../../assets/images/lightning.png')} style={{width: 36, height: 36}}/>
      </View>
      <View className='flex-col'>
        <View className='flex-row max-w-full mb-2'>
          <View className='flex w-1/2 mr-3'>
            {customButton('Building 1', 'water', 0)}
          </View>
          <View className='flex w-1/2'>
            {customButton('Building 2', 'water', 1)}
          </View>
        </View>
        <View className='flex-row max-w-full'>
          <View className='flex w-1/2 mr-3'>
            {customButton('Building 8', 'water', 0)}
          </View>
          <View className='flex w-1/2'>
            {customButton('Sports Halls', 'water', 0)}
          </View>
        </View>
      </View>


      <View className='flex-row items-center mt-6 mb-2'>
        <Text className='font-semibold text-3xl mr-2'>Air Quality</Text>
        <Image source={require('../../assets/images/wind.png')} style={{width: 36, height: 36}}/>
      </View>
      <View className='flex-col'>
        <View className='flex-row max-w-full mb-2'>
          <View className='flex w-1/2 mr-3'>
            {customButton('Building 1', 'water', 2)}
          </View>
          <View className='flex w-1/2'>
            {customButton('Building 2', 'water', 1)}
          </View>
        </View>
        <View className='flex-row max-w-full'>
          <View className='flex w-1/2 mr-3'>
            {customButton('Building 8', 'water', 1)}
          </View>
          <View className='flex w-1/2'>
            {customButton('Sports Halls', 'water', 4)}
          </View>
        </View>
      </View>


    </ScrollView>
  );
}
