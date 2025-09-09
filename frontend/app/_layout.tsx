// app/_layout.tsx
import { Slot, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Linking from "expo-linking";
import "../global.css";

export default function RootLayout() {
  const router = useRouter();

  // Warm start deep links
  useEffect(() => {
    const sub = Linking.addEventListener("url", ({ url }) => {
      const { path, queryParams } = Linking.parse(url);
      const p = (path || "").replace(/^\//, ""); // normalize
      if (p === "verify") {
        router.replace({ pathname: "/verify", params: queryParams } as any);
      }
    });
    return () => sub.remove();
  }, [router]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
    </GestureHandlerRootView>
  );
}
