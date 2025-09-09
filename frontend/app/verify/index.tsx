import React, { useEffect, useRef, useState } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { handleVerification } from "@/service/userService";

type PendingAction = "changePassword" | "register";

export default function VerifyScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const didRun = useRef(false);

  // Lấy token an toàn dù ở dạng string | string[] | undefined
  const rawToken = (params as any)?.token as string | string[] | undefined;
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const verify = async () => {
      try {
        if (!token || typeof token !== "string" || token.trim().length === 0) {
          Alert.alert("Verification", "Thiếu hoặc sai token trong liên kết.");
          setLoading(false);
          router.replace("/(tabs)/home");
          return;
        }

        let pendingAction: PendingAction | null = null;
        let payload: any = null;
        let storageKey: string | null = null;

        // Đọc pending từ SecureStore (có thể không có, ví dụ mở link từ email trên máy khác)
        try {
          const pendingChangePassword = await SecureStore.getItemAsync("pendingChangePassword");
          if (pendingChangePassword) {
            pendingAction = "changePassword";
            payload = JSON.parse(pendingChangePassword);
            storageKey = "pendingChangePassword";
          } else {
            const pendingRegister = await SecureStore.getItemAsync("pendingRegister");
            if (pendingRegister) {
              pendingAction = "register";
              payload = JSON.parse(pendingRegister);
              storageKey = "pendingRegister";
            }
          }
        } catch {
          // ignore JSON parse errors; sẽ fallback verify chỉ bằng token
        }

        // Gọi verify; backend nên cho phép chỉ cần token cũng hợp lệ
        // (truyền undefined khi không có pendingAction/payload)
        const ok = await handleVerification(
          token,
          pendingAction ?? undefined as any,
          payload ?? undefined
        );

        if (ok) {
          if (storageKey) await SecureStore.deleteItemAsync(storageKey);
          Alert.alert(
            "✅ Success",
            pendingAction === "register" ? "Registration successful" :
            pendingAction === "changePassword" ? "Password change successful" :
            "Verification successful"
          );
          router.replace("/(tabs)/home");
        } else {
          throw new Error("Server rejected verification.");
        }
      } catch (e: any) {
        // Dọn dẹp để tránh treo trạng thái
        try {
          await SecureStore.deleteItemAsync("pendingChangePassword");
          await SecureStore.deleteItemAsync("pendingRegister");
        } catch {}

        Alert.alert("❌ Error", e?.message || "Verification failed");

        // Nếu đã có accessToken thì đẩy về tài khoản, nếu chưa thì về register
        try {
          const token = await SecureStore.getItemAsync("accessToken");
          router.replace(token ? "/(tabs)/account" : "/(auth)/register");
        } catch {
          router.replace("/(auth)/register");
        }
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4">Verifying…</Text>
      </View>
    );
  }

  return null;
}
