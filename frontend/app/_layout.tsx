// app/_layout.tsx
import { Slot } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { View, ActivityIndicator } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await SecureStore.getItemAsync("accessToken");
      setToken(storedToken);
      setLoading(false);
    };
    checkToken();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (token) {
        router.replace("/(tabs)/home"); // ✅ Đã login → home
      } else {
        router.replace("/(auth)/login"); // ❌ Chưa login → login
      }
    }
  }, [loading, token]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  
  return <Slot />;
}
