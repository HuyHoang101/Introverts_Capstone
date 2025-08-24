import React, { useState, useCallback } from 'react';
import {
View,
Text,
Image,
TouchableOpacity,
FlatList,
ActivityIndicator,
ImageBackground,
} from 'react-native';
import { format } from 'date-fns';
import { useFocusEffect, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { getAllUsers } from '@/service/userService';
import { getAllLikes } from '@/service/likeService';
import { getAllPosts } from '@/service/postService';

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

type Post = {
    id: string;
    problem: string;
    title: string;
    description: string;
    location: string;
    content: string;
    published: boolean;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    like?: Like[];
};

type Like = {
    id: string;
    authorId: string;
    postId: string;
    createdAt: string;
    updatedAt: string;
};

type User = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    introduction?: string;
    address?: string;
    birthday?: string;
    createdAt?: string;
    updatedAt?: string;
};

function safeFormatDate(datetime?: string) {
    // Guard against invalid date strings
    if (!datetime) return '';
    const d = new Date(datetime);
    if (isNaN(d.getTime())) return datetime; // fallback: return original string if invalid
    return format(d, 'dd MMM yyyy, HH:mm');
    }

    const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

    const ReportForm = () => {
    const router = useRouter();

    const [filterTitle, setFilterTitle] = useState<string>('all');

    // Keep full list and displayed list separate
    const [allReports, setAllReports] = useState<Report[] | null>(null); // original fetched data
    const [reports, setReports] = useState<Report[] | null>(null); // filtered/displayed

    // expandedMap keyed by report id so expand state persists across reloads
    const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

    const [users, setUsers] = useState<User[] | null>(null);
    const [likes, setLikes] = useState<Like[] | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const handleFilter = useCallback((type: string) => {
        setFilterTitle(type);

        // ORIGINAL PROBLEM:
        // You used `initialReports` (empty array) -> filter always returned empty.
        // FIX: filter based on `allReports` (the real fetched dataset).
        const source = allReports ?? [];
        const filtered =
        type === 'all' ? source : source.filter((r) => r.title === type);

        setReports(filtered);
        // reset expand for visible list only (but keep other ids intact)
        const newMap = { ...expandedMap };
        // Set visible items to false (so UX consistent), but keep other entries
        filtered.forEach((r) => {
        if (!(r.id in newMap)) newMap[r.id] = false;
        });
        setExpandedMap(newMap);
    }, [allReports, expandedMap]);

    useFocusEffect(
        useCallback(() => {
        let mounted = true;
        setLoading(true);
        setError(null);

        // We still use Promise.all to run parallel requests (this is fine)
        Promise.all([getAllPosts(), getAllUsers(), getAllLikes()])
            .then(([postsData, usersData, likesData]) => {
            if (!mounted) return;

            setUsers(usersData || []);
            setLikes(likesData || []);

            // Build a map of like counts by postId (optional)
            const likeCountMap: Record<string, number> = {};
            (likesData || []).forEach((lk: Like) => {
                likeCountMap[lk.postId] = (likeCountMap[lk.postId] || 0) + 1;
            });

            // Map posts -> reports
            const reportsData: Report[] = (postsData || []).map(
                (post: Post) => {
                const user = (usersData || []).find((u: User) => u.id === post.authorId);

                // ORIGINAL PROBLEM:
                // You pre-formatted datetime before storing into item.datetime, then later
                // called formatDate AGAIN in render, causing invalid date parsing.
                // FIX: store raw createdAt (ISO) into datetime and format only at render.
                return {
                    id: post.id, // ensure id present
                    name: user?.name || 'Unknown User',
                    // ORIGINAL PROBLEM:
                    // avatar fallback didn't trim -> whitespace-only string considered truthy.
                    // FIX: use .trim() guard.
                    avatar: (user?.avatar && user.avatar.trim()) ? user!.avatar!.trim() : DEFAULT_AVATAR,
                    status: post.published ? 'Solved' : 'Pending',
                    title: post.title,
                    location: post.location,
                    datetime: post.createdAt, // keep ISO
                    problem: post.problem,
                    description: post.description,
                    image: post.content,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                    likeCount: likeCountMap[post.id] || 0,
                };
                }
            );

            setAllReports(reportsData);
            setReports(reportsData);

            // initialize expanded map for these ids (false)
            const initialMap: Record<string, boolean> = { ...expandedMap };
            reportsData.forEach((r) => {
                if (!(r.id in initialMap)) initialMap[r.id] = false;
            });
            setExpandedMap(initialMap);
            })
            .catch((err) => {
            console.error('Error fetching data:', err);
            if (mounted) setError('Failed to load reports');
            })
            .finally(() => {
            if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
        // empty dependency: runs each time screen focuses (useFocusEffect behavior)
        }, [])
    );

    // Toggle expand by id (keeps expand state stable across reloads)
    const toggleItem = useCallback((id: string) => {
        setExpandedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    }, []);

    // Renderers
    if (loading) {
        return (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" />
        </View>
        );
    }

    if (error) {
        return (
        <View className="flex-1 justify-center items-center p-4">
            <Text className="text-red-500 mb-4">{error}</Text>
            <TouchableOpacity onPress={() => {
            // retry: refocus effect will run, but allow manual retry
            setLoading(true);
            setError(null);
            // naive retry by re-running effect: we can call the same fetch logic here or navigate away and back.
            }}>
            <Text className='text-black'>Retry</Text>
            </TouchableOpacity>
        </View>
        );
    }

    if (!reports || reports.length === 0) {
        return (
        <ImageBackground 
        source={require('@/assets/images/bg_main.png')}
        className="flex-1 min-h-screen px-4"
        resizeMode="stretch">
            <View className="flex-row justify-around bg-white py-2 shadow-sm z-10 mt-12">
            {['all', 'water', 'electric', 'air'].map((type) => (
                <TouchableOpacity key={type} onPress={() => handleFilter(type)}>
                <Text className={filterTitle === type ? 'text-blue-600 font-bold' : 'text-gray-500'}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
                </TouchableOpacity>
            ))}
            </View>

            <View className="flex-1 justify-center items-center">
                <Text className='text-white'>No reports found.</Text>
            </View>

            <TouchableOpacity
                className="absolute bottom-2 right-2"
                onPress={() => router.push({ pathname: '/report/WriteReport' })}
            >
                <View className="flex bg-white rounded-full shadow-md border border-gray-50 p-1">
                    <MaterialIcons name="add" size={36} color="black" />
                </View>
            </TouchableOpacity>
        </ImageBackground>
        );
    }

    return (
        <ImageBackground 
        source={require('@/assets/images/bg_main.png')}
        className="flex-1 min-h-screen"
        resizeMode="stretch">
            <FlatList
            data={reports}
            keyExtractor={(item) => item.id}
            className="px-4 mt-12"
            // 👇 thêm filter bar vào header
            ListHeaderComponent={() => (
                <View className="flex-row justify-around bg-white py-2 shadow-sm border border-gray-200 mb-4">
                {['all', 'water', 'electric', 'air'].map((type) => (
                    <TouchableOpacity key={type} onPress={() => handleFilter(type)}>
                    <Text
                        className={
                        filterTitle === type
                            ? 'text-blue-600 font-bold'
                            : 'text-gray-500'
                        }
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                    </TouchableOpacity>
                ))}
                </View>
            )}
            stickyHeaderIndices={[0]} // 👈 giữ header luôn cố định khi scroll
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => {
                const isExpanded = !!expandedMap[item.id];

                return (
                <View className="flex-col bg-white rounded-sm shadow p-4 mb-4 justify-start">
                    <View className="flex flex-row justify-start items-center">
                    <Image
                        source={{ uri: item.avatar }}
                        className="w-14 h-14 rounded-full mr-4"
                    />
                    <View className="flex flex-col justify-start flex-1">
                        <Text className="text-lg font-medium text-black">{item.name}</Text>
                        <Text className="italic text-sm text-gray-500">
                        {safeFormatDate(item.datetime)}
                        </Text>
                    </View>
                    <View className="flex-row justify-end">
                        <Text className="text-sm text-black">{item.status}</Text>
                    </View>
                    </View>

                    <Text className="text-sm mt-2 text-black">{item.problem}</Text>

                    <TouchableOpacity
                    onPress={() => toggleItem(item.id)}
                    className={`${isExpanded ? 'mb-2' : 'mb-2 w-20'}`}
                    >
                    {isExpanded && (
                        <Text className="text-sm text-gray-600">Building {item.location}</Text>
                    )}

                    <Text className={`${isExpanded ? 'text-black' : 'text-blue-500'}`}>
                        {isExpanded ? item.description : 'Readmore'}
                    </Text>

                    {isExpanded && <Text className="text-blue-500">#{item.title}</Text>}
                    </TouchableOpacity>

                    {item.image ? (
                    <Image source={{ uri: item.image }} className="w-full aspect-[16/9]" />
                    ) : null}

                    <View className="flex flex-row justify-around pt-4">
                    <TouchableOpacity className="flex-row items-center space-x-2">
                        <MaterialIcons name="thumb-up" size={24} color="#2196F3" />
                        <Text className="text-blue-500 ml-2">
                        Like {item.likeCount ? `(${item.likeCount})` : ''}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() =>
                        router.push({
                            pathname: '/report/ReportDetail',
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
            }}
            />

            {/* Nút thêm báo cáo */}
            <TouchableOpacity
            className="absolute bottom-12 right-2"
            onPress={() => router.push({ pathname: '/report/WriteReport' })}
            >
            <View className="flex bg-green-600 rounded-full shadow-md border border-green-400 p-1">
                <MaterialIcons name="add" size={36} color="white" />
            </View>
            </TouchableOpacity>
        </ImageBackground>
    );

        
};

export default ReportForm;
