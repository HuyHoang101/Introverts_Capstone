import React, { useState } from 'react';
import {
  View,
  TextInput,
  Image,
  Alert,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { login } from '../../service/authService';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import IntroductCard from '@/component/IntroductCard'; // 👈 import IntroductCard

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false); // 👈 state About Us

  const handleLogin = async () => {
    try {
      const user = await login(email, password);
      Alert.alert('✅ Login Success', `Welcome, ${user.name}`);
      router.replace('/(tabs)/home');
    } catch (err) {
      const errorMessage =
        err && typeof err === 'object' && 'message' in err
          ? (err as { message: string }).message
          : 'An unknown error occurred';
      Alert.alert('❌ Login Failed', errorMessage);
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/bg_main.png')}
      className="flex-1 items-center justify-center"
      resizeMode="stretch"
    >
      {/* Nút About Us góc trên bên phải */}
      <View className="absolute top-12 right-5 ">
        <TouchableOpacity
          onPress={() => setAboutVisible(true)}
          className="bg-white/20 px-3 py-2 rounded-lg border border-white/40"
        >
          <Text className="text-white font-semibold">About Us</Text>
        </TouchableOpacity>
      </View>

      <AnimatePresence>
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800 }}
          className="flex-col bg-white justify-center items-start p-4 w-11/12 max-w-md rounded-xl mt-6 shadow-lg"
        >
          {/* Logo */}
          <MotiView
            from={{ opacity: 0, translateY: -30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 150, duration: 800 }}
            className="w-full flex-row justify-center items-center mb-12 my-6"
          >
            <Image
              source={require('@/assets/images/renewable-energy.png')}
              style={{ width: 108, height: 108 }}
            />
          </MotiView>

          {/* Welcome */}
          <MotiView
            from={{ opacity: 0, translateY: -30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 300, duration: 1000 }}
          >
            <Text className="text-3xl font-bold text-black mb-6">
              Welcome back
            </Text>
          </MotiView>

          {/* Email */}
          <MotiView
            from={{ opacity: 0, translateY: -30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 450, duration: 1000 }}
            className="w-full"
          >
            <Text className="mb-1 text-black">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              keyboardType="email-address"
              className="border border-gray-400 p-2 mb-4 w-full rounded text-black"
            />
          </MotiView>

          {/* Password */}
          <MotiView
            from={{ opacity: 0, translateY: -30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 600, duration: 1000 }}
            className="w-full"
          >
            <Text className="mb-1 text-black">Password</Text>
            <View className="w-full relative">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                className="border border-gray-400 p-2 mb-1 w-full rounded text-black"
              />
              <TouchableOpacity
                className="absolute right-2 top-3"
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialIcons
                  name={!showPassword ? 'visibility-off' : 'visibility'}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          </MotiView>

          {/* Remember me */}
          <MotiView
            from={{ opacity: 0, translateY: -30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 750, duration: 1000 }}
            className="w-full"
          >
            <View className="flex-row items-center mb-4 mt-2">
              <TouchableOpacity
                className="relative w-7 h-7 justify-center items-center"
                onPress={() => setChecked(!checked)}
              >
                <View className={`w-5 h-5 border border-gray-400 rounded`} />
                {checked && (
                  <MaterialIcons
                    className="absolute top-0 left-0"
                    name="check"
                    size={24}
                    color="gray"
                  />
                )}
              </TouchableOpacity>
              <Text className="text-black ml-2">Remember me</Text>
            </View>
          </MotiView>

          {/* Login button */}
          <MotiView
            from={{ opacity: 0, translateY: -30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 900, duration: 1000 }}
          >
            <View className="w-full flex-row justify-center items-center mt-4 mb-2">
              <TouchableOpacity
                onPress={handleLogin}
                className="bg-green-500 py-3 rounded w-1/3 items-center mt-2"
              >
                <Text className="text-white font-bold">LOGIN</Text>
              </TouchableOpacity>
            </View>
          </MotiView>

          {/* Register */}
          <MotiView
            from={{ opacity: 0, translateY: -30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 1050, duration: 1000 }}
            className="flex-col justify-center items-center mt-4 w-full"
          >
            <View className="flex-row justify-center items-center mt-4 w-full">
              <View className="border-t border-gray-400 flex-1" />
              <Text className="mx-2 text-gray-500">Or</Text>
              <View className="border-t border-gray-400 flex-1" />
            </View>

            <View className="flex-row justify-center mt-4 w-full">
              <Text className="text-black">Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => router.replace('/(auth)/register')}
              >
                <Text className="text-blue-500">Register</Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        </MotiView>
      </AnimatePresence>

      {/* Intro Card */}
      <IntroductCard
        visible={aboutVisible}
        onClose={() => setAboutVisible(false)}
      />
    </ImageBackground>
  );
}
