import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const ReportForm = () => {
  const [title, setTitle] = useState('');
  const [datetime, setDatetime] = useState(new Date().toISOString());
  const [location, setLocation] = useState('');
  const [problem, setProblem] = useState('');
  const [description, setDescription] = useState('');

  const sendReport = async () => {
    const reportData = { title, datetime, location, problem, description };

    try {
      const response = await fetch('http://192.168.0.112:5000/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      const result = await response.json();
      console.log('Server response:', result);
    } catch (error) {
      console.error('Error sending report:', error);
    }
  };

  return (
    <View className='bg-white w-full h-full p-4 justify-center'>
      <View className='p-4 shadow-md rounded-md space-y-4 items-center'>
        <Text className='text-4xl'>Issue Report</Text>
        <TextInput placeholder="Title" placeholderTextColor="rgba(0,0,0,0.5)" className='bg-gray-100 p-4 w-full' value={title} onChangeText={setTitle} />
        <TextInput placeholder="Location" placeholderTextColor="rgba(0,0,0,0.5)" className='bg-gray-100 p-4 w-full' value={location} onChangeText={setLocation} />
        <TextInput placeholder="Problem" placeholderTextColor="rgba(0,0,0,0.5)" className='bg-gray-100 p-4 w-full' value={problem} onChangeText={setProblem} />
        <TextInput
            multiline={true}
            className='bg-gray-100 p-4 w-full'
            numberOfLines={15}
            placeholder="Enter detailed description..."
            placeholderTextColor="rgba(0,0,0,0.5)"
            value={description}
            onChangeText={setDescription}
        />
        <Button title="Submit Report" onPress={sendReport} />
      </View>   
    </View>
  );
};

export default ReportForm;
