import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { useUser } from "../account/contexts/UserContext";

export default function Profile() {
  // State lưu thông tin gốc
  const [email, setEmail] = useState("nguyenvana@example.com");
  const [birthYear, setBirthYear] = useState("2000");
  const [isEditing, setIsEditing] = useState(false); // Popup toggle

  // State tạm cho modal
  const [draftEmail, setDraftEmail] = useState(email);
  const [draftBirthYear, setDraftBirthYear] = useState(birthYear);

  // Hàm mở modal và copy data gốc vào draft
  const openEditModal = () => {
    setDraftEmail(email);
    setDraftBirthYear(birthYear);
    setIsEditing(true);
  };

  // Hàm lưu thông tin
  const handleSave = () => {
    setEmail(draftEmail);
    setBirthYear(draftBirthYear);
    setIsEditing(false); // Đóng popup
  };
  const { username, avatar } = useUser();

  return (
    <>
      <ScrollView className="flex-1 bg-gray-100">
        {/* Cover Photo */}
        <View className="bg-cyan-500 h-40" />

        {/* Avatar & Name */}
        <View className="px-4 -mt-16">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              {/* Avatar */}
              <View className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white items-center justify-center overflow-hidden">
                {avatar ? (
                  <Image
                    source={{ uri: avatar }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Feather name="user" size={48} color="#fff" />
                )}
              </View>

              {/* Name & Self-Intro */}
              <View className="ml-4">
                <Text className="text-2xl font-bold text-gray-900">{username}</Text>
                <Text className="text-gray-600 mt-7">"Hi there, welcome to my profile!"</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View className="flex-row mt-6 px-4 space-x-4">
          {/* Left: About Section */}
          <View className="w-1/3 space-y-4">
            <View className="bg-white rounded-2xl p-4 shadow-sm">
              <Text className="text-lg font-bold mb-2">Introduction</Text>
              <Text className="text-base text-gray-700">📧 {email}</Text>
              <Text className="text-base text-gray-700">🎂 Birth: {birthYear}</Text>
              <TouchableOpacity
                className="mt-3 bg-gray-200 rounded-lg px-3 py-2 items-center"
                onPress={openEditModal} // 👈 Mở popup edit
              >
                <Text className="text-gray-800">Detail Editing</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Right: Post Section */}
          <View className="flex-1 space-y-4">
            {/* Post input */}
            <View className="bg-white rounded-2xl p-4 shadow-sm">
              <Text className="text-base text-gray-500 mb-2">Issue Encounter?</Text>
              <TextInput
                placeholder="Report Issue..."
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <TouchableOpacity className="mt-3 bg-blue-500 rounded-lg px-3 py-2 items-center">
                <Text className="text-white">Post</Text>
              </TouchableOpacity>
            </View>

            {/* History posts */}
            {[1, 2, 3].map((post, index) => (
              <View
                key={index}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <Text className="font-bold text-gray-800 mb-1">Post #{post}</Text>
                <Text className="text-gray-700">
                  History Post Number {post}.
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={isEditing} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 w-80">
            <Text className="text-lg font-bold mb-4">Detail Editing</Text>

            {/* Email Field */}
            <Text className="text-gray-600 mb-1">Email</Text>
            <TextInput
              value={draftEmail}
              onChangeText={setDraftEmail}
              placeholder="Enter email"
              className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
            />

            {/* Birth Year Field */}
            <Text className="text-gray-600 mb-1">Birth</Text>
            <TextInput
              value={draftBirthYear}
              onChangeText={setDraftBirthYear}
              placeholder="Enter birth year"
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
            />

            {/* Buttons */}
            <View className="flex-row justify-end space-x-2">
              <TouchableOpacity
                onPress={() => setIsEditing(false)}
                className="px-3 py-2 rounded-lg bg-gray-200"
              >
                <Text className="text-gray-800">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                className="px-3 py-2 rounded-lg bg-blue-500"
              >
                <Text className="text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
