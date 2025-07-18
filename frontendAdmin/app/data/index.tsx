import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import '@/global.css';


export default function Index() {
  const [rooms, setRooms] = useState<{ id: number; name: string; status: string }[]>([
    { "id": 1, "name": "2.4.027", "status": "Available" },
    { "id": 2, "name": "2.4.011", "status": "Busy" },
    { "id": 3, "name": "2.4.008", "status": "Busy" }
  ]);

  useEffect(() => {
    fetch('http://192.168.0.112:5000/api/room') // Change to local IP
      .then(res => res.json())
      .then(data => {
        setRooms(data); // data is array of room objects with id + name
      })
      .catch(err => {
        console.error('Failed to fetch rooms:', err);
      });
  }, []);
  

  return (
    <ScrollView 
    className='flex-1 flex-col bg-white'
    contentContainerStyle={{paddingBottom: 32}}
    showsVerticalScrollIndicator={false}
    >
      <Text className='text-3xl mt-2 ml-2 mb-2'>
        Sustainable Database
      </Text>

      <View className='flex-row justify-between items-center max-w-full ml-2 mr-6'>
        <TouchableOpacity className='flex-col bg-white rounded-md shadow p-4 w-1/3 items-center'>
          <Text className='font-semibold text-2xl mb-3'>Air Quality</Text>
          <Image source={require('../../assets/images/wind.png')} style={{height:64, width:64}}/>
        </TouchableOpacity>
        <TouchableOpacity className='flex-col bg-white rounded-md shadow p-4 w-1/3 items-center ml-2 mr-2'>
          <Text className='font-semibold text-2xl mb-3'>Water</Text>
          <Image source={require('../../assets/images/drop.png')} style={{height:64, width:64}}/>
        </TouchableOpacity>
        <TouchableOpacity className='flex-col bg-white rounded-md shadow p-4 w-1/3 items-center'>
          <Text className='font-semibold text-2xl mb-3'>Electric</Text>
          <Image source={require('../../assets/images/lightning.png')} style={{height:64, width:64}}/>
        </TouchableOpacity>
      </View>

      <View className='flex-row justify-between items-center mt-6 mx-2 mb-2'>
        <Text className='text-3xl'>
          Booking room Setting
        </Text>
        <TouchableOpacity className='bg-green-200 p-1 px-3 rounded-full shadow'>
          <Text>
            Add +
          </Text>
        </TouchableOpacity>
      </View>

      {rooms.map((room) =>(
        <TouchableOpacity className='flex-row max-w-full mx-2 p-4 mb-2 justify-between bg-green-50 rounded-lg shadow' key={room.id}>
          <Text className='font-semibold'> Room {room.name}</Text>
          <Text className={`${room.status === "Available" ? 'text-green-700' : 'text-red-700'}`}> {room.status}</Text>
        </TouchableOpacity>
      ))}
      
    </ScrollView>
  );
}
