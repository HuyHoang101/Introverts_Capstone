import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Image } from 'react-native';
import { useState } from 'react';
import { useUser } from "../account/contexts/UserContext"; // 👈 Thêm dòng này

const settingsOptions = ["Change Username", "Change Avatar", "Change Password"];

export default function Settings() {
  const { username, setUsername, avatar, setAvatar } = useUser(); // 👈 Dùng context

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<null | string>(null);

  // State tạm để edit
  const [draftUsername, setDraftUsername] = useState(username);
  const [draftAvatar, setDraftAvatar] = useState(avatar);

  // Password fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const TEMP_PASSWORD = "123456"; // Password mặc định

  const openModal = (option: string) => {
    setCurrentModal(option);
    if (option === "Change Username") setDraftUsername(username);
    if (option === "Change Avatar") setDraftAvatar(avatar);
    if (option === "Change Password") {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrorMessage("");
    }
    setIsModalVisible(true);
  };

  const handleSave = () => {
    if (currentModal === "Change Username") {
      setUsername(draftUsername); // 👈 Lưu context
    } else if (currentModal === "Change Avatar") {
      setAvatar(draftAvatar); // 👈 Lưu context
    } else if (currentModal === "Change Password") {
      if (oldPassword !== TEMP_PASSWORD) {
        setErrorMessage("Current password is invalid");
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMessage("New passwords do not match");
        return;
      }
      console.log("Password changed successfully:", newPassword);
      setErrorMessage("");
    }
    setIsModalVisible(false);
  };

  return (
    <>
      <ScrollView className="flex-1 bg-white">
        <View className="p-4">
          {settingsOptions.map((option) => (
            <TouchableOpacity
              key={option}
              className="flex-row justify-between items-center py-4 border-b border-gray-200"
              onPress={() => openModal(option)}
            >
              <Text className="text-base">{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 w-80">
            <Text className="text-lg font-bold mb-4">{currentModal}</Text>

            {/* Change Username */}
            {currentModal === "Change Username" && (
              <TextInput
                value={draftUsername}
                onChangeText={setDraftUsername}
                placeholder="Enter new username"
                className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
              />
            )}

            {/* Change Avatar */}
            {currentModal === "Change Avatar" && (
              <>
                <Image
                  source={{ uri: draftAvatar }}
                  className="w-24 h-24 rounded-full self-center mb-4"
                />
                <TextInput
                  value={draftAvatar}
                  onChangeText={setDraftAvatar}
                  placeholder="Enter image URL"
                  className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
                />
              </>
            )}

            {/* Change Password */}
            {currentModal === "Change Password" && (
              <>
                <TextInput
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  placeholder="Current password"
                  secureTextEntry
                  className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
                />
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="New password"
                  secureTextEntry
                  className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
                />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  secureTextEntry
                  className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
                />
                {errorMessage !== "" && (
                  <Text className="text-red-500 text-sm mb-2">{errorMessage}</Text>
                )}
              </>
            )}

            {/* Buttons */}
            <View className="flex-row justify-end space-x-2">
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
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
