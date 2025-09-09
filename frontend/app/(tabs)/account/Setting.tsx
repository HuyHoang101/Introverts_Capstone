import React, { useState } from "react";
import { View, TextInput, Alert, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { getUserInfo } from "@/service/authService";
import { requestVerification } from "@/service/userService";
import * as SecureStore from "expo-secure-store";

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return Alert.alert("❗ Missing Fields", "Please fill in all fields.");
    }
    if (newPassword !== confirmNewPassword) {
      return Alert.alert("❌ Password Mismatch", "New passwords do not match.");
    }

    try {
      const userInfo = await getUserInfo();
      if (!userInfo) throw new Error("User not logged in");

      const { id, email } = userInfo;

      setLoading(true);
      // 1. Gửi email xác thực
      await requestVerification(email);

      // 2. Lưu thông tin tạm thời (id + newPassword) vào SecureStore
      await SecureStore.setItemAsync(
        "pendingChangePassword",
        JSON.stringify({ id, newPassword })
      );

      Alert.alert(
        "📩 Check Your Email",
        "We’ve sent a verification link to your email. Please click it to confirm password change."
      );
    } catch (error: any) {
      Alert.alert("❌ Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-4">
      <Text className="text-3xl mb-6 text-black">Change Password</Text>

      <TextInput
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Current Password"
        placeholderTextColor={"#888"}
        secureTextEntry
        className="border border-gray-400 p-2 mb-4 rounded text-black"
      />
      <TextInput
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="New Password"
        placeholderTextColor={"#888"}
        secureTextEntry
        className="border border-gray-400 p-2 mb-4 rounded text-black"
      />
      <TextInput
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        placeholder="Confirm New Password"
        placeholderTextColor={"#888"}
        secureTextEntry
        className="border border-gray-400 p-2 mb-4 rounded text-black"
      />

      <TouchableOpacity
        onPress={handleChangePassword}
        className="bg-green-500 py-3 rounded w-full items-center"
        disabled={loading}
      >
        {loading ? (
          <Text className="text-white">Sending...</Text>
        ) : (
          <Text className="text-white">Change Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
