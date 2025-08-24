import React, { useState } from 'react';
import {
View,
TextInput,
Alert,
Text,
TouchableOpacity,
ImageBackground,
Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { register } from '../../service/authService';
import { MaterialIcons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [checked, setChecked] = useState(false);

    const router = useRouter();

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
        return Alert.alert('❗ Missing Fields', 'Please fill in all fields.');
        }

        if (password !== confirmPassword) {
        return Alert.alert('❌ Password Mismatch', 'Passwords do not match.');
        }

        try {
        const { token, user } = await register({ name, email, password });

        await SecureStore.setItemAsync('accessToken', token);
        await SecureStore.setItemAsync('userInfo', JSON.stringify(user));

        Alert.alert('✅ Register Success', `Welcome, ${user.name}`);
        router.replace('/(tabs)/home');
        } catch (err) {
        const errorMessage =
            err && typeof err === 'object' && 'message' in err
            ? (err as { message: string }).message
            : 'An unknown error occurred';
        Alert.alert('❌ Register Failed', errorMessage);
        }
    };

    return (
        <ImageBackground 
        source={require('@/assets/images/bg_main.png')}
        className="flex-1 items-center justify-center"
        resizeMode="stretch"
        >
            <AnimatePresence>
                <MotiView
                    from={{ opacity: 0, translateY: 50 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 800 }}
                    className="flex-col bg-white justify-center items-start p-4 w-11/12 max-w-md rounded-xl"
                >   
                    <MotiView
                    from={{ opacity: 0, translateY: -30 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 125, duration: 800 }} 
                    className='w-full flex-row  justify-center items-center mb-12 my-6'>
                        <Image source={require('@/assets/images/renewable-energy.png')} style={{ width: 108, height: 108 }} />
                    </MotiView>

                    <MotiView
                        from={{ opacity: 0, translateY: -30 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 250, duration: 1000 }}
                    >
                        <Text className='text-3xl font-bold text-black mb-6'>Hello, register now</Text>
                    </MotiView>

                    <MotiView
                        from={{ opacity: 0, translateY: -30 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 375, duration: 1000 }}
                        className='w-full'
                    >
                        <Text className='text-black'>Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Your name"
                            placeholderTextColor="#9ca3af"
                            className='border border-gray-400 p-2 mb-4 w-full rounded text-black'
                        />
                    </MotiView>

                    <MotiView
                        from={{ opacity: 0, translateY: -30 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 500, duration: 1000 }}
                        className='w-full'
                    >
                        <Text className='text-black'>Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email"
                            placeholderTextColor="#9ca3af"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            className='border border-gray-400 p-2 mb-4 w-full rounded text-black'
                        />
                    </MotiView>

                    <MotiView
                        from={{ opacity: 0, translateY: -30 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 625, duration: 1000 }}
                        className='w-full'
                    >
                        <Text className='text-black'>Password</Text>
                        <View className='w-full relative'>
                            <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Password"
                            placeholderTextColor="#9ca3af"
                            secureTextEntry={!showPassword}
                            className='border border-gray-400 p-2 mb-4 w-full rounded text-black'
                            />
                            <TouchableOpacity className="absolute right-2 top-3" onPress={() => setShowPassword(!showPassword)}>
                            <MaterialIcons
                                name={showPassword ? "visibility" : "visibility-off"}
                                size={20}
                                color="gray"
                            />
                            </TouchableOpacity>
                        </View>
                    </MotiView>
                    
                    <MotiView
                        from={{ opacity: 0, translateY: -30 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 750, duration: 1000 }}
                        className='w-full'
                    >
                        <Text className='text-black'>Confirm Password</Text>
                        <View className='w-full relative'>
                            <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm Password"
                            placeholderTextColor="#9ca3af"
                            secureTextEntry={!showConfirmPassword}
                            className='border border-gray-400 p-2 w-full rounded text-black'
                            />
                            <TouchableOpacity className="absolute right-2 top-3" onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <MaterialIcons
                                name={showConfirmPassword ? "visibility" : "visibility-off"}
                                size={20}
                                color="gray"
                            />
                            </TouchableOpacity>
                        </View>
                    </MotiView>

                    <MotiView
                    from={{ opacity: 0, translateY: -30 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 875, duration: 1000 }}
                    className="flex-row items-center mb-4 mt-1">
                        <TouchableOpacity className="relative w-7 h-7 justify-center items-center" onPress={() => setChecked(!checked)}>
                        <View className={`w-5 h-5 border border-gray-400 rounded`}/>
                        {checked && (
                            <MaterialIcons className='absolute top-0 left-0' name="check" size={24} color="gray" />
                        )}
                        </TouchableOpacity>
                        <Text className="text-black">Remeber me</Text>
                    </MotiView>

                    <MotiView 
                    from={{ opacity: 0, translateY: -30 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 1000, duration: 1000 }}
                    className='w-full flex-row justify-center items-center mt-4 mb-2'>
                        <TouchableOpacity
                        onPress={handleRegister}
                        className="bg-green-500 py-3 rounded w-1/3 items-center mt-2"
                        >
                        <Text className="text-white font-bold">REGISTER</Text>
                        </TouchableOpacity>
                    
                    </MotiView>

                    <MotiView
                    from={{ opacity: 0, translateY: -30 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 1125, duration: 1000 }} 
                    className="flex-row justify-center items-center mt-4 w-full">
                        <View className="border-t border-gray-400 flex-1" />
                        <Text className="mx-2 text-gray-500">Or</Text>
                        <View className="border-t border-gray-400 flex-1" />
                    </MotiView>

                    <MotiView
                    from={{ opacity: 0, translateY: -30 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 1250, duration: 1000 }} 
                    className='flex-row items-center justify-center w-full mt-4 text-black'>
                        <Text>Already have an account?  </Text>
                        <TouchableOpacity
                            className='items-center'
                            onPress={() => router.replace('/(auth)/login')}
                        >
                            <Text className='text-blue-500'>Login</Text>
                        </TouchableOpacity>
                    </MotiView>
                </MotiView>
                
            </AnimatePresence>
        </ImageBackground>
    );
}
