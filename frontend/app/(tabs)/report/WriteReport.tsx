import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { addPost, uploadPostImage } from '@/service/postService';
import { addReport } from '@/service/reportService';
import { useRouter } from 'expo-router';
import { getUserInfo } from '@/service/authService';
import { useChat } from '@/component/ChatContext';
import { add } from 'date-fns';
import { KeyboardAvoidingView, Platform } from 'react-native';

const options = ['electric', 'water', 'air'];

export default function WriteReport() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>('electric');
  const [image, setImage] = useState<string | null>(null);
  const [problem, setProblem] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { addBotMessage } = useChat();

useEffect(() => {
  (async () => {
    const storedId = await getUserInfo().then(user => user?.id || null);
    if (storedId) setUserId(storedId);
  })();
}, []);

  useEffect(() => {
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!problem.trim() || !location.trim() || !description.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đủ các trường bắt buộc');
      return;
    }

    try {
      setLoading(true);

      // 1) Tạo post trước (content = null vì hình sẽ upload sau)
      const postPayload = {
          problem,
          location,
          description,
          title: selected,
          content: null,
          published: false,
          userId: userId!,     // ✅ backend yêu cầu field này
      };

      const { report, suggestion } = await addReport(postPayload);
      if (!report?.id) {
        throw new Error('Server không trả về report.id');
      }
      addBotMessage(suggestion || "Disconnected from AI Chat Bot.");
      if (image) await uploadPostImage(report.id, image);


      Alert.alert('Thành công', 'Report submitted successfully!');
      // reset form
      setProblem('');
      setLocation('');
      setDescription('');
      setImage(null);
      setSelected('electric');
    } catch (err) {
      console.error('Submit report error:', err);
      Alert.alert('Lỗi', (err as Error).message || 'Gửi báo cáo thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Android: height
      keyboardVerticalOffset={Platform.select({ ios: 64, android: 0 })}
    >
      <ScrollView className="flex-1 bg-white" 
      contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', paddingBottom: 20 }}
      keyboardShouldPersistTaps="handled"
      >
        <View className="flex flex-col bg-white rounded-sm p-4 justify-start w-full">
          <View className="flex flex-row items-center justify-between w-full mb-2">
            {/* Nút Close */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2"
            >
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
            {/* Title */}
            <Text className="font-semibold text-black text-lg p-2">Create Report</Text>
            {/* Chỗ trống để giữ cân đối */}
            <View className="w-10" />
          </View>

          <Text className="text-3xl text-black font-semibold mb-6">Report</Text>

          <View className="flex flex-col mb-3 w-full">
            <Text className="mr-2 text-black">Problem:</Text>
            <TextInput
              value={problem}
              onChangeText={setProblem}
              placeholder="Type problem..."
              placeholderTextColor={"#9CA3AF"}
              className="border border-gray-300 p-2 rounded-sm text-gray-700 w-full"
            />
          </View>

          <View className="flex flex-col mb-3 w-full">
            <Text className="mr-2 text-black">Location:</Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Type location place..."
              placeholderTextColor={"#9CA3AF"}
              className="border border-gray-300 p-2 rounded-sm text-gray-700 w-full"
            />
          </View>

          <View className="flex flex-row justify-around mb-3">
            {options.map((option) => (
              <TouchableOpacity key={option} onPress={() => setSelected(option)} className="flex-row items-center mr-14">
                <View className={`
                  w-5 h-5 rounded-full border-2 items-center justify-center mr-1
                  ${selected === option ? 'border-blue-500' : 'border-gray-400'}
                `}>
                  {selected === option && <View className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                </View>
                <Text className="text-gray-800 capitalize">{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex flex-col mb-3 w-full">
            <Text className="mr-2 mt-2 text-black">Description:</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholder="Type description..."
              placeholderTextColor={"#9CA3AF"}
              className="border border-gray-300 p-2 rounded-sm text-gray-700 w-full h-32"
            />
          </View>

          <View className="flex flex-row justify-start mb-3">
            <TouchableOpacity onPress={pickImage} className="mr-2">
              <MaterialIcons name="wallpaper" size={32} color={'gray'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto}>
              <MaterialIcons name="photo-camera" size={32} color={'gray'} />
            </TouchableOpacity>
          </View>

          {image && <Image source={{ uri: image }} className="flex mb-3 w-full h-64" />}

          <TouchableOpacity onPress={handleSubmit} disabled={loading} className="flex justify-center items-center">
            {loading ? (
              <ActivityIndicator color="white" style={{ padding: 16, backgroundColor: '#3B82F6', borderRadius: 8 }} />
            ) : (
              <Text className="bg-blue-500 text-white font-semibold p-4 shadow rounded-md">Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
