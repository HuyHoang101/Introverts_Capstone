import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { format } from 'date-fns';
import { useFocusEffect, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { getAllUsers } from '@/service/userService';
import { getAllLikes } from '@/service/likeService';
import { getAllPosts, deletePost } from '@/service/postService'; // <-- cần hàm delete

type Report = {
  id: string;
  name: string;
  avatar: string;
  status: string;
  title: string;
  location: string;
  datetime: string; // ISO string
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
  if (!datetime) return '';
  const d = new Date(datetime);
  if (isNaN(d.getTime())) return datetime;
  return format(d, 'dd MMM yyyy, HH:mm');
}

const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

const ReportForm = () => {
  const router = useRouter();
  const goDetail = (report: any) => {
    const payload = encodeURIComponent(JSON.stringify(report));
    // ĐÚNG PATH theo cấu trúc của cậu:
    router.push({ pathname: "/(tabs)/report/ReportDetail", params: { payload } });
  };

  const [filterTitle, setFilterTitle] = useState<{ type: string; status: string }>({
    type: 'all', // mặc định là all
    status: 'all', // mặc định là all
  });

  // dữ liệu gốc + dữ liệu đang hiển thị (sau filter)
  const [allReports, setAllReports] = useState<Report[] | null>(null);
  const [reports, setReports] = useState<Report[] | null>(null);

  // state khác
  const [users, setUsers] = useState<User[] | null>(null);
  const [likes, setLikes] = useState<Like[] | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // delete mode
  const [deleteMode, setDeleteMode] = useState(false);

  const handleFilterByType = useCallback(
    (type: string) => {
      setFilterTitle((prev) => ({ ...prev, type }));
    },
    []
  );

  const handleFilterByStatus = useCallback(
    (status: string) => {
      setFilterTitle((prev) => ({ ...prev, status }));
    },
    []
  );

  const handleFilter = useCallback(() => {
    let filteredReports = allReports ?? [];

    // Lọc theo loại (all, air, water, electric)
    if (filterTitle.type !== 'all') {
      const t = (filterTitle.type || '').toLowerCase();
      filteredReports = filteredReports.filter(
        (r) => (r.title || '').toLowerCase() === t
      );
    }

    // Lọc theo trạng thái (solved, pending)
    if (filterTitle.status !== 'all') {
      const s = (filterTitle.status || '').toLowerCase();
      filteredReports = filteredReports.filter(
        (r) => (r.status || '').toLowerCase() === s
      );
    }

    setReports(filteredReports);
  }, [allReports, filterTitle]);


  useEffect(() => {
    handleFilter();
  }, [filterTitle, allReports]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      setLoading(true);
      setError(null);

      Promise.all([getAllPosts(), getAllUsers(), getAllLikes()])
        .then(([postsData, usersData, likesData]) => {
          if (!mounted) return;

          setUsers(usersData || []);
          setLikes(likesData || []);

          // like count per post
          const likeCountMap: Record<string, number> = {};
          (likesData || []).forEach((lk: Like) => {
            likeCountMap[lk.postId] = (likeCountMap[lk.postId] || 0) + 1;
          });

          // map Post -> Report
          const reportsData: Report[] = (postsData || []).map((post: Post) => {
            const user = (usersData || []).find((u: User) => u.id === post.authorId);
            return {
              id: post.id,
              name: user?.name || 'Unknown User',
              avatar: user?.avatar?.trim() ? user.avatar.trim() : DEFAULT_AVATAR,
              status: post.published ? 'Solved' : 'Pending',
              title: post.title,
              location: post.location,
              datetime: post.createdAt, // giữ ISO, format khi render
              problem: post.problem,
              description: post.description,
              image: post.content,
              createdAt: post.createdAt,
              updatedAt: post.updatedAt,
              likeCount: likeCountMap[post.id] || 0,
            };
          });

          setAllReports(reportsData);
          setReports(reportsData);
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
    }, [])
  );

  const confirmDelete = useCallback((id: string) => {
    Alert.alert('Are you sure?', 'This will permanently delete the report.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePost(id);
            setAllReports((prev) => (prev ?? []).filter((r) => r.id !== id));
            setReports((prev) => (prev ?? []).filter((r) => r.id !== id));
          } catch (e) {
            console.error('Delete report failed:', e);
          }
        },
      },
    ]);
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="bg-white w-full h-full justify-center flex-1 relative">
      {/* Header: Filter + Actions */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-2 border-b border-gray-100 bg-white">
        {/* Filter theo loại báo cáo */}
        <View className='flex-col'>
          <View className="flex-row">
            {['all', 'water', 'electric', 'air'].map((type) => (
              <TouchableOpacity key={type} onPress={() => handleFilterByType(type)} className="mr-4">
                <Text className={filterTitle.type === type ? 'text-blue-600 font-bold' : 'text-gray-500'}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Filter theo trạng thái */}
          <View className="flex-row mt-4">
            {['solved', 'pending'].map((status) => (
              <TouchableOpacity key={status} onPress={() => handleFilterByStatus(status)} className="mr-4">
                <Text className={filterTitle.status === status ? 'text-blue-600 font-bold' : 'text-gray-500'}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add + Delete mode */}
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/report/writeReport' })}
            className="p-2 rounded-full bg-gray-100 mr-2"
          >
            <MaterialIcons name="add" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDeleteMode((v) => !v)}
            className="p-2 rounded-full bg-gray-100"
          >
            <MaterialIcons name={deleteMode ? 'close' : 'delete'} size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* List: chỉ avatar + name + datetime + problem */}
      <View className="flex-1">
        <FlatList
          data={reports ?? []}
          keyExtractor={(item) => item.id}
          className="p-4"
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-10">
              <Text className="text-gray-500">There is no Report set up</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                if (deleteMode) return; // đang delete mode thì không navigate
                goDetail(item);
              }}
            >
              <View className="flex-row bg-white rounded-sm shadow p-4 mb-4 items-center">
                {deleteMode && (
                  <TouchableOpacity
                    onPress={() => confirmDelete(item.id)}
                    className="w-6 h-6 rounded-full bg-red-500 items-center justify-center mr-3"
                  >
                    <Text className="text-white font-bold">-</Text>
                  </TouchableOpacity>
                )}

                <Image source={{ uri: item.avatar || DEFAULT_AVATAR }} className="w-14 h-14 rounded-full mr-4" />

                <View className="flex-1">
                  <Text className="text-lg font-medium text-black">{item.name}</Text>
                  <Text className="italic text-sm text-gray-500">{safeFormatDate(item.datetime)}</Text>
                  <Text className="text-sm mt-1 text-black">{item.problem}</Text>
                </View>

                {/* Trạng thái */}
                <Text
                  className={`text-sm font-bold ${
                    item.status === 'Solved' ? 'text-green-500' : 'text-yellow-500'
                  }`}
                >
                  {item.status}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default ReportForm;
