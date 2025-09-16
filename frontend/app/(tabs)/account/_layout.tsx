import { Stack } from 'expo-router';
import React from 'react';

export default function AccountLayout() {
  return <Stack screenOptions={{ headerShown: true }}>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="Profile" options={{ title: 'Profile' }} />
    <Stack.Screen name="MyReportDetail" options={{ title: 'Report Detail' }} />
    <Stack.Screen name="Setting" options={{ title: 'Change Password' }} />
    <Stack.Screen name="Notifications" options={{ title: 'Notifications' }} />
    <Stack.Screen name="LinkAccount" options={{ title: 'Chat Bot' }} />
    <Stack.Screen name="Conversation" options={{ title: 'Conversations' }} />
    <Stack.Screen name="[userId]" options={{ title: 'Chat' }} />
  </Stack>;
}
