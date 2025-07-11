import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, ScrollView, ActivityIndicator, FlatList} from 'react-native';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

type Report = {
  name: string;
  avatar: string;
  status: string,
  title: string;
  location: string;
  datetime: string;
  problem: string;
  description: string;
  image: string;
};

const initialReports: Report[] = [
  {
    name: "Jack",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2uz88opUkCosnT3sNx3yyBB_GAhOiejbUAg&s",
    status: "Completed",
    title: "electric",
    location: "Building 1 - Floor 2",
    datetime: "2025-06-10T09:30:00Z",
    problem: "Sudden power outage",
    description: "Electricity went out in the entire floor for 10 minutes.",
    image: "https://myslidell.com/wp-content/uploads/2021/04/Power-Outage.png"
  },
  {
    name: "Dorothy",
    avatar: "https://i.pinimg.com/474x/1d/5b/86/1d5b8699a3d044cc4c3b526a5d5ac554.jpg",
    status: "Solving",
    title: "water",
    location: "Building 1 - Restroom",
    datetime: "2025-06-17T14:15:00Z",
    problem: "Leaking faucet",
    description: "The faucet in the restroom is constantly dripping water.",
    image: "https://hips.hearstapps.com/hmg-prod/images/water-leakage-from-the-faucet-royalty-free-image-1628686561.jpg"
  },
  {
    name: "Sun",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsPIf2gKrw35jNu8yec6QBwExm64KwP-grJw&s",
    status: "Completed",
    title: "air",
    location: "Building 2 - Lab Room",
    datetime: "2025-06-04T11:00:00Z",
    problem: "Poor air circulation",
    description: "Room feels stuffy and warm, possibly due to AC malfunction.",
    image: "https://archive.cdc.gov/www_cdc_gov/coronavirus/2019-ncov/prevent-getting-sick/improving-ventilation-in-buildings_html_files/poor-ventilation-2_1.png"
  },
  {
    name: "Colantine",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_dGkhhQBynCqwwJM3fZXIDZc_BHIExDyg7w&s",
    status: "Pending Approval",
    title: "electric",
    location: "Building 8 - Server Room",
    datetime: "2025-05-29T08:45:00Z",
    problem: "Flickering lights",
    description: "Lights flicker every few seconds, may indicate wiring issues.",
    image: "https://www.vst-lighting.com/wp-content/uploads/2024/05/Flickering-Lights.jpg"
  },
  {
    name: "Aliya",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP_fJlLKbsY4bwEnXlGwhFdLwoh_fNMZmGlA&s",
    status: "Pending Approval",
    title: "water",
    location: "Building 1 - Kitchen",
    datetime: "2025-05-14T17:20:00Z",
    problem: "Low water pressure",
    description: "The sink in the kitchen has very low water flow.",
    image: "https://irp.cdn-website.com/46512886/dms3rep/multi/low+water+pressure.jpg"
  },
];


function formatDate(datetime: string) {
    return format(new Date(datetime), 'dd MMM yyyy, HH:mm');
}

const ReportForm = () => {
  // const [title, setTitle] = useState('');
  // const [datetime, setDatetime] = useState(new Date().toISOString());
  // const [location, setLocation] = useState('');
  // const [problem, setProblem] = useState('');
  // const [description, setDescription] = useState('');

  // const sendReport = async () => {
  //   const reportData = { title, datetime, location, problem, description };

  //   try {
  //     const response = await fetch('http://localhost:5000/api/report', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(reportData),
  //     });

  //     const result = await response.json();
  //     console.log('Server response:', result);
  //   } catch (error) {
  //     console.error('Error sending report:', error);
  //   }
  // };

  const router = useRouter();
  const [filterTitle, setFilterTitle] = useState<string>('all');
  const [expandedList, setExpandedList] = useState<boolean[]>(
    initialReports.map(() => false)
  );  
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [loading, setLoading] = useState(true);
  const handleFilter = (type: string) => {
    setFilterTitle(type);
  
    const filtered = type === 'all'
      ? initialReports
      : initialReports.filter(report => report.title === type);
  
    setReports(filtered);                         
    setExpandedList(filtered.map(() => false));   
  };
  
  
  // useEffect(() => {
  //   fetch('http://localhost:5000/api/report') // thay đổi nếu dùng Android/device
  //     .then((res) => res.json())
  //     .then((data) => setReports(data))
  //     .catch((err) => console.error('Lỗi fetch:', err))
  //     .finally(() => setLoading(false));
  // }, []);

  // if (loading) {
  //   return (
  //     <View className="flex-1 justify-center items-center bg-white">
  //       <ActivityIndicator size="large" />
  //       <Text className="mt-2">Report loading...</Text>
  //     </View>
  //   );
  // }

  return (
    <View className='bg-white w-full h-full justify-center flex-1'>
      <View className="flex-row justify-around bg-white py-2 shadow-sm z-10">
      {['all', 'water', 'electric', 'air'].map((type) => (
        <TouchableOpacity key={type} onPress={() => handleFilter(type)}>
          <Text className={filterTitle === type ? 'text-blue-600 font-bold' : 'text-gray-500'}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
      </View>
      <View className='flex-1 overflow-auto'>
          <FlatList
            data={reports}
            keyExtractor={(_, index) => index.toString()} // không có id, dùng index
            className='p-4'
            renderItem={({ item, index }) => {
              const isExpanded = expandedList[index];

              const toggleItem = () => {
                const newExpanded = [...expandedList];
                newExpanded[index] = !newExpanded[index];
                setExpandedList(newExpanded);
              };

              return (
                <View className="flex-col bg-white rounded-sm shadow p-4 mb-4 justify-start">
                  <View className='flex flex-row justify-start'>
                    <Image
                      source={{ uri: item.avatar }}
                      className='w-14 h-14 rounded-full mr-4'
                    />
                    <View className='flex flex-col justify-start'>
                      <Text className='text-2xl font-medium'>{item.name}</Text>
                      <Text className="italic text-sm text-gray-500">{formatDate(item.datetime)}</Text>
                    </View>
                    <View className='flex-1 flex-row justify-end'>
                      <Text className='text-sm'>{item.status}</Text>
                    </View>
                  </View>
            
                  <Text className="text-sm mt-2">{item.problem}</Text>
            
                  <TouchableOpacity onPress={toggleItem} className={`${isExpanded ? "mb-2" : "mb-2 w-20"}`}>
                    <Text className={`${!isExpanded ? "hidden" : "text-sm text-gray-600"}`}>
                      {isExpanded ? `${item.location}` : ""}
                    </Text>
                    <Text className={`${isExpanded ? "" : "text-blue-500"}`}>
                      {isExpanded ? `${item.description}` : "Readmore"}
                    </Text>
                    <Text className={`${!isExpanded ? "hidden" : "text-blue-500"}`}>
                      {isExpanded ? `#${item.title}` : ""}
                    </Text>
                  </TouchableOpacity>
                  <Image
                    source={{uri: item.image}}
                    className='w-full aspect-[16/9]'
                  />
                  <View className='flex flex-row justify-around pt-4'>
                    <TouchableOpacity onPress={toggleItem} className='flex-row items-center space-x-2'>
                      <MaterialIcons name='thumb-up' size={24} color={"#2196F3"}/>
                      <Text className='text-blue-500'>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push({ pathname: '/report/ReportDetail', params: item })} className='flex-row items-center space-x-2'>
                      <MaterialIcons name='comment' size={24} color={"gray"}/>
                      <Text className='text-gray-500'>Comment</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
      </View>
      <TouchableOpacity className='absolute bottom-2 right-2' onPress={() => router.push({pathname: '/report/WriteReport'})}> 
        <View className='flex bg-white rounded-full shadow-md border border-gray-50'>
          <MaterialIcons name='add' size={48} color={"black"}/>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ReportForm;
