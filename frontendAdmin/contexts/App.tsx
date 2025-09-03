import { UserProvider } from "./UserContext";
import { Slot } from "expo-router"; // nếu bạn dùng expo-router
import React from 'react';

export default function App() {
  return (
    <UserProvider>
      <Slot /> {/* Router sẽ render ở đây */}
    </UserProvider>
  );
}
