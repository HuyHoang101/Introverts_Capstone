import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { format, formatDistanceToNow } from 'date-fns';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

type Comment = {
  name: string;
  avatar: string;
  date: string;
  comment: string;
};

const initialComment: Comment[] = [
  {
    name: 'Alice Nguyen',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    date: '2025-06-20T10:30:00Z',
    comment: 'The maintenance team has already been notified. It should be fixed by tomorrow morning.'
  },
  {
    name: 'David Tran',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    date: '2025-06-20T11:45:00Z',
    comment: 'We inspected the issue this afternoon. A replacement part has been ordered.'
  },
  {
    name: 'Linh Pham',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    date: '2025-06-21T08:15:00Z',
    comment: 'Temporary fix applied for now. Please avoid using it until we confirm the final repair.'
  },
  {
    name: 'Khoa Le',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    date: '2025-06-21T09:50:00Z',
    comment: 'Thank you for reporting this. The issue is now resolved and everything is back to normal.'
  }
];

function formatDate(datetime: string) {
  return format(new Date(datetime), 'dd MMM yyyy, HH:mm');
}

export default function ReportDetail() {
  const { name, avatar, status, title, location, datetime, problem, description, image } = useLocalSearchParams();
  const [comments, setComments] = useState<Comment[]>(initialComment);
  const [input, setInput] = useState('');

  return (
    <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
        >
        <View className="flex-1">
            {/* FlatList with enough padding at bottom so input isn't covered */}
            <FlatList
            data={comments}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListHeaderComponent={
                <View className="flex flex-col p-4 shadow-sm bg-white mb-4">
                <View className="flex flex-row justify-between items-start">
                    <View className="flex flex-row">
                    <Image source={{ uri: avatar as string }} className="w-14 h-14 rounded-full mr-4" />
                    <View className="flex flex-col">
                        <Text className="text-3xl font-medium">{name}</Text>
                        <Text className="text-gray-500 italic">{formatDate(datetime as string)}</Text>
                    </View>
                    </View>
                    <Text className="text-sm text-gray-600">{status}</Text>
                </View>
                <Text className="text-sm mt-4">{problem}</Text>
                <Text className="text-sm text-gray-600">{location}</Text>
                <Text>{description}</Text>
                <Text className="text-blue-500">{`#${title}`}</Text>
                <Image source={{ uri: image as string }} className="w-full aspect-[16/9]" />
                <View className="flex flex-row justify-around mt-4">
                    <TouchableOpacity className="flex flex-row items-center space-x-2">
                    <MaterialIcons name="thumb-up" size={24} color={'#2196F3'} />
                    <Text className="text-blue-500">Like</Text>
                    </TouchableOpacity>
                    <View className="flex flex-row items-center space-x-2">
                    <MaterialIcons name="comment" size={24} color={'#2196F3'} />
                    <Text className="text-blue-500">Comment</Text>
                    </View>
                </View>
                </View>
            }
            renderItem={({ item }) => (
                <View className="flex flex-row justify-between mb-9 px-4">
                <View className="flex flex-row flex-1">
                    <Image source={{ uri: item.avatar }} className="w-11 h-11 rounded-full mr-2" />
                    <View className="flex flex-col justify-start space-y-2">
                    <View className="flex flex-row justify-start items-center">
                        <Text className="text-sm font-medium text-gray-600">{`${item.name} •`}</Text>
                        <Text className="text-xs font-light text-gray-600 italic">
                        {` ${formatDistanceToNow(new Date(item.date), { addSuffix: true })}`}
                        </Text>
                    </View>
                    <Text className="text-sm font-normal w-2/3">{item.comment}</Text>
                    <View className="flex flex-row justify-start mt-4 items-center">
                        <TouchableOpacity className="flex flex-row items-center mr-14">
                        <MaterialIcons name="thumb-up-off-alt" size={20} color={'gray'} />
                        </TouchableOpacity>
                        <TouchableOpacity className="flex flex-row items-center mr-14">
                        <MaterialIcons name="thumb-down-off-alt" size={20} color={'gray'} />
                        </TouchableOpacity>
                        <TouchableOpacity className="flex flex-row items-center">
                        <FontAwesome name="comment-o" size={20} color={'gray'} />
                        </TouchableOpacity>
                    </View>
                    </View>
                </View>
                <TouchableOpacity>
                    <MaterialIcons name="more-vert" size={20} color={'gray'} />
                </TouchableOpacity>
                </View>
            )}
            />
            <View className="absolute bottom-0 left-0 right-0 bg-white p-2 border-t border-gray-200">
            <TextInput
                value={input}
                onChangeText={setInput}
                onSubmitEditing={() => {
                if (input.trim()) {
                    setComments([
                    ...comments,
                    {
                        name: 'You',
                        avatar: 'https://i.pravatar.cc/100',
                        date: new Date().toISOString(),
                        comment: input
                    }
                    ]);
                    setInput('');
                }
                }}
                placeholder="Write a comment..."
                className="bg-gray-50 p-2 px-4 border border-gray-300 rounded-full text-gray-700"
                returnKeyType="send"
            />
            </View>
        </View>
    </KeyboardAvoidingView>
  );
}
