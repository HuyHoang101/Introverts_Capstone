// app/(auth)/_layout.tsx
import { Slot } from 'expo-router';
import React from 'react';
import '@/global.css';

export default function AuthLayout() {
  return <Slot />;
}
