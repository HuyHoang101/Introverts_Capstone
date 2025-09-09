import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import FloatingChat from "@/component/FloatingChat";
import { ChatProvider } from "@/component/ChatContext";
import React from "react";

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden'); // ✅ hide bottom bar
      NavigationBar.setBehaviorAsync('overlay-swipe'); // ⛔ prevents it from reappearing on swipe
    }
  }, []);

  return (
    <>
      <ChatProvider>
        <Tabs
          initialRouteName="home"
          screenOptions={{
            headerShown: false,
            tabBarStyle: { height: 60 },
            tabBarLabelStyle: { fontSize: 12 },
            tabBarActiveTintColor: '#228B22', // optional: Tailwind's green-600
            tabBarHideOnKeyboard: true,
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: "Home",
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="home" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="data"
            options={{
              title: "Data",
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="bar-chart" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="report"
            options={{
              title: "Report",
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="report" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="account"
            options={{
              title: "Account",
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="person" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="index"
            options={{
              href: null,
            }}
          />
        </Tabs>
        <FloatingChat /> 
      </ChatProvider>
    </>
  );
}
