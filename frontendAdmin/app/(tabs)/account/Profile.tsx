import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Image, Platform, Alert } from 'react-native';
import React, { useCallback } from 'react';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { getUserInfo } from '@/service/authService';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { updateUser, uploadUserAvatar, deleteUserAvatar, getUserById } from '@/service/userService';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useFocusEffect } from '@react-navigation/native';
import { formatDateYear, formatVietnamTime } from '@/utils/time';
import { getAllPosts } from '@/service/postService';
import { getAllLikes } from '@/service/likeService';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';


interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string; // Optional avatar URL
    introduction?: string; // Optional introduction
    phone: string;
    address: string;
    birthDate: string;
    createdAt: string;
    updatedAt: string;
}

type Report = {
    id: string; // <-- ADD id so we can key and manage expand state
    name: string;
    avatar: string;
    status: string;
    title: string;
    location: string;
    datetime: string; // store as ISO (createdAt) — format only when rendering
    problem: string;
    description: string;
    image: string;
    createdAt: string;
    updatedAt: string;
    likeCount?: number;
};

type Like = {
    id: string;
    authorId: string;
    postId: string;
    createdAt: string;
    updatedAt: string;
};

export default function Profile() {
    // State lưu thông tin gốc
    const router = useRouter();
    const [posts, setPosts] = useState<Report[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [newAvatarUri, setNewAvatarUri] = useState<string | null>(null);
    const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
    const [openEditModal, setOpenEditModal] = useState(false);
    // State để hiển thị DateTimePicker
    const [showPicker, setShowPicker] = useState(false);
    const onChangeDate = (event: any, selectedDate?: Date) => {
        if (event.type === 'dismissed') {
            // Người dùng nhấn "Cancel" → đóng picker
            setShowPicker(false);
            return;
        }

        if (selectedDate) {
            const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
            setEditUser(prev => prev ? { ...prev, birthDate: formattedDate } : prev);
        }
        setShowPicker(false); // Đóng picker sau khi chọn xong
    };
    
    // Hàm chọn ảnh từ thư viện
    const pickImage = async () => {
        // Xin quyền truy cập thư viện
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
        alert('Bạn cần cho phép truy cập ảnh');
        return;
        }

        // Chọn ảnh từ thư viện
        const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        });

        if (!result.canceled) {
        const original = result.assets[0];

        // Lấy kích thước nhỏ hơn giữa width và height → crop hình vuông
        const size = Math.min(original.width, original.height);
        const crop = await ImageManipulator.manipulateAsync(
            original.uri,
            [
            {
                crop: {
                originX: (original.width - size) / 2,
                originY: (original.height - size) / 2,
                width: size,
                height: size,
                },
            },
            ],
            { compress: 1, format: ImageManipulator.SaveFormat.PNG }
        );

        setNewAvatarUri(crop.uri); // Lưu ảnh đã crop vuông
        setEditUser(prev => prev ? { ...prev, avatar: crop.uri } : prev);
        }
    };

    // Hàm lưu thông tin
    const handleSave = async () => {
        try {
            if (!user?.id) return;

            // 1. Update user info trước
            await updateUser(user.id, {
                name: editUser?.name,
                introduction: editUser?.introduction,
                birthDate: editUser?.birthDate ? dayjs(editUser.birthDate).utc().format() : undefined,
                phone: editUser?.phone,
                address: editUser?.address,
            });

            // 2. Nếu có avatar mới
            if (newAvatarUri) {
            // Nếu đã có avatar cũ thì xóa trước
                if (user.avatar && user.avatar !== "https://cdn-icons-png.flaticon.com/512/847/847969.png") {
                    await deleteUserAvatar(user.id);
                }

                // Upload avatar mới
                await uploadUserAvatar(user.id, newAvatarUri);
            }

            // 3. Cập nhật local state nếu cần
            await SecureStore.setItemAsync('userInfo', JSON.stringify(await getUserById(user.id)));
            const updatedUser = await getUserById(user.id);
            if (updatedUser?.avatar === "https://example.com/default-avatar.png") {
                updatedUser.avatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
            }

            setUser(updatedUser);
            setEditUser(updatedUser);
            

            // 4. Đóng modal
            setOpenEditModal(false);
        } catch (error) {
            console.error('❌ Error updating user:', error);
            Alert.alert('Error', 'Failed to save user changes.');
        }
    };

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
            const data = await getUserInfo();

            let updated = data;
            if (data?.avatar === "https://example.com/default-avatar.png") {
                updated = {
                ...data,
                avatar: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                };
            }
            setUser(updated);
            setEditUser(updated);

            if (updated?.id) {
                // 🔥 Lấy tất cả posts
                const allPosts = await getAllPosts();
                // 🔥 Lấy tất cả likes
                const allLikes = await getAllLikes();

                // 🔥 Filter post theo authorId và map về type Report
                const userPosts: Report[] = allPosts
                .filter((p: any) => p.authorId === updated.id)
                .map((p: any) => {
                    const likeCount = allLikes.filter((l: any) => l.postId === p.id).length;
                    return {
                    id: p.id,
                    name: updated.name,
                    avatar: updated.avatar,
                    status: p.published ? "Solved" : "Pending",
                    title: p.title,
                    location: p.location,
                    datetime: p.createdAt,
                    problem: p.problem,
                    description: p.description,
                    image: p.content,
                    createdAt: p.createdAt,
                    updatedAt: p.updatedAt,
                    likeCount,
                    } as Report;
                });

                setPosts(userPosts);

                // initialize expanded map for these ids (false)
                const initialMap: Record<string, boolean> = { ...expandedMap };
                userPosts.forEach((r) => {
                    if (!(r.id in initialMap)) initialMap[r.id] = false;
                });
                setExpandedMap(initialMap);
            }
            };

            fetchData();
        }, [])
    );

    const toggleItem = useCallback((id: string) => {
            setExpandedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    }, []);

    return (
        <>
        <ScrollView className="flex-1 bg-gray-100">
            {/* Cover Photo */}
            <View className="bg-cyan-500 h-40" />

            {/* Avatar & Name */}
            <View className="px-4 -mt-16">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center justify-center">
                    {/* Avatar */}
                    <View className=" w-24 h-24 rounded-full bg-gray-300 border-4 border-white items-center justify-center overflow-hidden">
                        {user?.avatar ? (
                        <Image
                            source={{ uri: user.avatar }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                        ) : (
                        <Feather name="user" size={48} color="#fff" />
                        )}
                    </View>

                    {/* Name & Self-Intro */}
                    <View className="ml-4 justify-center py-2">
                        <Text className="text-2xl font-bold text-gray-900">{user?.name ? user.name : "Unknowned User"}</Text>
                        <Text className="text-gray-600 mt-7">{user?.introduction ? user.introduction : "Hi there, welcome to my profile!"}</Text>
                    </View>
                </View>
            </View>
            </View>

            {/* Main Content */}
            <View className="flex-col mt-6 px-4 w-full max-w-md">
                {/* Left: About Section */}
                <View className="w-full">
                    <View className="bg-white rounded-2xl p-4 shadow-sm">
                    <Text className="text-lg font-bold mb-2 text-black">Introduction</Text>
                    <Text className="text-base text-gray-700">📧 Email: {user?.email ? user.email : "example@gmail.com"}</Text>
                    <Text className="text-base text-gray-700">🎂 Birth: {user?.birthDate ? formatDateYear(user.birthDate) : "01/01/1970"}</Text>
                    <Text className="text-base text-gray-700">📞 Phone: {user?.phone ? user.phone : ""}</Text>
                    <Text className="text-base text-gray-700">🏠 Address: {user?.address ? user.address : ""}</Text>
                    <TouchableOpacity
                        className="mt-3 bg-gray-200 rounded-lg px-3 py-2 items-center"
                        onPress={() => setOpenEditModal(true)} // 👈 Mở popup edit
                    >
                        <Text className="text-gray-800">Detail Editing</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                
                {/* Right: Post Section */}
                <View className="flex-row mt-6 w-full max-w-md">
                    {/* Post input */}
                    <View className="bg-white rounded-2xl p-4 shadow-sm w-full">
                    <Text className="text-base text-gray-500 mb-2">Issue Encounter?</Text>
                    <TouchableOpacity className="mt-3 bg-blue-500 rounded-lg px-3 py-2 items-center">
                        <Text className="text-white">Post</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                {/* 🔥 Post List */}
                <View className="flex-col mt-6 w-full">
                {posts.map((item) => {
                    const isExpanded = !!expandedMap[item.id];

                    return (
                    <View
                        key={item.id}
                        className="flex-col bg-white rounded-sm shadow p-4 mb-4 justify-start"
                    >
                        {/* Header */}
                        <View className="flex flex-row justify-start items-center">
                        <Image
                            source={{ uri: item.avatar }}
                            className="w-14 h-14 rounded-full mr-4"
                        />
                        <View className="flex flex-col justify-start flex-1">
                            <Text className="text-lg font-medium text-black">{item.name}</Text>
                            <Text className="italic text-sm text-gray-500">
                            {formatVietnamTime(item.datetime)}
                            </Text>
                        </View>
                        <View className="flex-row justify-end">
                            <Text className="text-sm text-black">{item.status}</Text>
                        </View>
                        </View>

                        {/* Problem */}
                        <Text className="text-sm mt-2 text-black">{item.problem}</Text>

                        {/* Readmore */}
                        <TouchableOpacity
                        onPress={() => toggleItem(item.id)}
                        className={`${isExpanded ? "mb-2" : "mb-2 w-20"}`}
                        >
                        {isExpanded && (
                            <Text className="text-sm text-gray-600">
                            Building {item.location}
                            </Text>
                        )}
                        <Text className={`${isExpanded ? "text-black" : "text-blue-500"}`}>
                            {isExpanded ? item.description : "Readmore"}
                        </Text>
                        {isExpanded && <Text className="text-blue-500">#{item.title}</Text>}
                        </TouchableOpacity>

                        {/* Image */}
                        {item.image ? (
                        <Image source={{ uri: item.image }} className="w-full aspect-[16/9]" />
                        ) : null}

                        {/* Actions */}
                        <View className="flex flex-row justify-around pt-4">
                        <TouchableOpacity className="flex-row items-center space-x-2">
                            <MaterialIcons name="thumb-up" size={24} color="#2196F3" />
                            <Text className="text-blue-500 ml-2">
                            Like {item.likeCount ? `(${item.likeCount})` : ""}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() =>
                            router.push({
                                pathname: "/account/MyReportDetail",
                                params: { report: JSON.stringify(item) },
                            })
                            }
                            className="flex-row items-center space-x-2"
                        >
                            <MaterialIcons name="comment" size={24} color="gray" />
                            <Text className="text-gray-500 ml-2">Comment</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                    );
                })}
                </View>
            </View>
        </ScrollView>

        {/* Edit Modal */}
        <Modal visible={openEditModal} transparent animationType="slide">
            <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white rounded-2xl p-6 w-11/12 max-w-md">
                <Text className="text-lg font-bold mb-4">Detail Editing</Text>

                {/* Avatar Field */}
                <View className='relative flex items-center my-4'>
                    <Image
                        source={{ uri: editUser?.avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png" }}
                        className="w-32 h-32 rounded-full mb-4"
                    />
                    <TouchableOpacity
                        onPress={pickImage}
                        className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2"
                    >
                        <Feather name="camera" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Name Field */}
                <Text className="text-gray-600 mb-1">Name</Text>
                <TextInput
                value={editUser?.name || ''}
                onChangeText={(text) => {
                    if (!editUser) return;
                    setEditUser({ ...editUser, name: text });
                }}
                placeholder="Enter your name"
                className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
                />

                {/* Introduction Field */}
                <Text className="text-gray-600 mb-1">Introduction</Text>
                <TextInput
                value={editUser?.introduction || ''}
                onChangeText={(text) => {
                    if (!editUser) return;
                    setEditUser({ ...editUser, introduction: text });
                }}
                placeholder="Enter a short introduction"
                className="border border-gray-300 rounded-lg px-3 py-2 mb-4 h-24"
                multiline
                numberOfLines={3}
                style={{ textAlignVertical: 'top' }}
                />

                {/* Birth Year Field */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-1">Birth</Text>

                    <TouchableOpacity
                        onPress={() => setShowPicker(true)}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                    >
                        <Text className={editUser?.birthDate ? 'text-black' : 'text-gray-400'}>
                        {editUser?.birthDate || 'Select your birth date'}
                        </Text>
                    </TouchableOpacity>

                    {showPicker && (
                        <DateTimePicker
                        value={editUser?.birthDate ? new Date(editUser.birthDate) : new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onChangeDate}
                        maximumDate={new Date()} // Không cho chọn ngày trong tương lai
                        />
                    )}
                </View>

                {/* Phone Field */}
                <Text className="text-gray-600 mb-1">Phone</Text>
                <TextInput
                value={editUser?.phone || ''}
                onChangeText={(text) => {
                    if (!editUser) return;
                    setEditUser({ ...editUser, phone: text });
                }}
                placeholder="Enter phone number"
                className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
                />

                {/* Address Field */}
                <Text className="text-gray-600 mb-1">Address</Text>
                <TextInput
                value={editUser?.address || ''}
                onChangeText={(text) => {
                    if (!editUser) return;
                    setEditUser({ ...editUser, address: text });
                }}
                placeholder="Enter address"
                className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
                />

                {/* Buttons */}
                <View className="flex-row justify-end">
                <TouchableOpacity
                    onPress={() => {setOpenEditModal(false); setEditUser(user)}}
                    className="px-3 py-2 rounded-lg bg-gray-200 mr-2"
                >
                    <Text className="text-gray-800">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleSave}
                    className="px-3 py-2 rounded-lg bg-blue-500"
                >
                    <Text className="text-white">Save</Text>
                </TouchableOpacity>
                </View>
            </View>
            </View>
        </Modal>
        </>
    );
}
