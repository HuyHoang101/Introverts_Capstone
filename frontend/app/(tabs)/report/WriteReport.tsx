import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { addPost, uploadPostImage } from '@/service/postService';
import { useRouter } from 'expo-router';
import { getUserInfo } from '@/service/authService';

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
        problem: problem,
        location: location,
        description: description,
        title: selected,
        content: null, // backend có thể để default null
        published: false, // tuỳ theo logic backend
        authorId: userId!,
      };

      const createdPost = await addPost(postPayload);

      // kiểm tra backend trả id
      if (!createdPost || !createdPost.id) {
        throw new Error('addPost không trả về id của post mới.');
      }

      // 2) Nếu có ảnh thì upload bằng id vừa tạo
      if (image) {
        // uploadPostImage(id, uri) — theo đúng API bạn mô tả
        await uploadPostImage(createdPost.id, image);
      }

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
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', paddingBottom: 20 }}>
      <View className="flex flex-col bg-white rounded-sm p-4 justify-start w-full">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text className="text-3xl font-semibold mb-6">Report</Text>

        <View className="flex flex-col mb-3 w-full">
          <Text className="mr-2">Problem:</Text>
          <TextInput
            value={problem}
            onChangeText={setProblem}
            placeholder="Type problem..."
            placeholderTextColor={"#9CA3AF"}
            className="border border-gray-300 p-2 rounded-sm text-gray-700 w-full"
          />
        </View>

        <View className="flex flex-col mb-3 w-full">
          <Text className="mr-2">Location:</Text>
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
          <Text className="mr-2 mt-2">Description:</Text>
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
  );
}
