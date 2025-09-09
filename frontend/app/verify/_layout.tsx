// app/verify/_layout.tsx
import { Stack } from "expo-router";
import React from "react";
export default function VerifyLayout() {
  return (
    <Stack>
      {/* đảm bảo index map tới '/verify' */}
      <Stack.Screen name="index" options={{ headerShown: false,  }} />
    </Stack>
  );
}
