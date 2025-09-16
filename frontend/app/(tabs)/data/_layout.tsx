import { Stack } from 'expo-router';
import React from 'react';

export default function DataLayout() {
  return <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="index" options={{ title: 'Sustainablity Data' }} />
    <Stack.Screen name="AirDetail" options={{ title: 'Polltion Detail' }} />
  </Stack>;
}