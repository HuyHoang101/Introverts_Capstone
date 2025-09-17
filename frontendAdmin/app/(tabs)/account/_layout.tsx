import { Stack } from 'expo-router';
import React from 'react';

export default function AccountLayout() {
  return <Stack screenOptions={{ headerShown: true }}>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="Profile" options={{ title: 'Profile' }} />
    <Stack.Screen name="MyReportDetail" options={{ title: 'Report Detail' }} />
    <Stack.Screen name="[userId]" options={{ title: 'Conversation' }} />
  </Stack>;
}
