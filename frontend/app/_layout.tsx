import { Slot } from "expo-router";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { View, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message"; // ← thêm

export default function RootLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      await SecureStore.getItemAsync("accessToken");
      setLoading(false);
    };
    checkToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Slot />
      <Toast /> {/* ← thêm */}
    </>
  );
}
