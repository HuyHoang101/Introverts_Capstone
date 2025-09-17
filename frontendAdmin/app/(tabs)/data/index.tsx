import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Modal,
  TextInput,
  ActivityIndicator,
  Image
} from "react-native";
import "@/global.css";
import { useRouter, useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";
import {
  getAllRooms,
  updateRoom,
  deleteRoom,
  createRoom,
} from "@/service/roomService";

// Types
interface Room {
  id: number | string;
  name: string;
  status?: string; // Optional based on backend
}

export default function Index() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteMode, setDeleteMode] = useState(false);

  // Edit Modal
  const [editOpen, setEditOpen] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  // Create Modal
  const [createOpen, setCreateOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllRooms();
      const list: Room[] = Array.isArray(data) ? data : data?.rooms || [];
      setRooms(list);
    } catch (e: any) {
      Alert.alert("Fetch rooms failed", e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRooms();
    }, [fetchRooms])
  );

  const onOpenDetail = (room: Room) => {
    if (!room?.id) return;
    router.push({
      pathname: "/(tabs)/data/[roomId]", // giữ nguyên theo code bạn đang dùng
      params: { roomId: String(room.id), name: room.name },
    });
  };

  const onOpenEdit = (room: Room) => {
    setEditRoom(room);
    setEditName(room.name ?? "");
    setEditOpen(true);
  };

  const onSaveEdit = async () => {
    if (!editRoom) return;
    try {
      setSaving(true);
      await updateRoom(String(editRoom.id), { name: editName.trim() });
      setEditOpen(false);
      setEditRoom(null);
      setEditName("");
      fetchRooms();
    } catch (e: any) {
      Alert.alert("Update room failed", e?.message || String(e));
    } finally {
      setSaving(false);
    }
  };

  const onConfirmDelete = (room: Room) => {
    Alert.alert(
      "Delete room?",
      `Are you sure to delete room “${room.name}” ?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRoom(String(room.id));
              setRooms((prev) => prev.filter((r) => String(r.id) !== String(room.id)));
            } catch (e: any) {
              Alert.alert("Delete failed", e?.message || String(e));
            }
          },
        },
      ]
    );
  };

  const onCreate = async () => {
    const name = newRoomName.trim();
    if (!name) {
      Alert.alert("Room's name missing", "Please, enter room's name");
      return;
    }
    try {
      setSaving(true);
      await createRoom({ name });
      setCreateOpen(false);
      setNewRoomName("");
      fetchRooms();
    } catch (e: any) {
      Alert.alert("Create room failed", e?.message || String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/bg_main.png")}
      resizeMode="cover"
      className="flex-1"
    >
      <Text className="text-3xl mt-12 ml-2 mb-2 text-white">Sustainable Database</Text>

      <View className="flex-row justify-between items-center max-w-full ml-2 mr-6">
        <TouchableOpacity
          className="flex-col bg-white rounded-md shadow p-4 w-1/3 items-center"
          onPress={() => router.push("/data/airList")}
        >
          <Text className="font-semibold text-2xl mb-3 text-gray-900">Pollution</Text>
          <Image source={require("@/assets/images/wind.png")} style={{ height: 64, width: 64 }} />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-col bg-white rounded-md shadow p-4 w-1/3 items-center ml-2 mr-2"
          onPress={() => router.push("/data/waterList")}
        >
          <Text className="font-semibold text-2xl mb-3 text-gray-900">Water</Text>
          <Image source={require("@/assets/images/drop.png")} style={{ height: 64, width: 64 }} />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-col bg-white rounded-md shadow p-4 w-1/3 items-center"
          onPress={() => router.push("/data/electricList")}
        >
          <Text className="font-semibold text-2xl mb-3 text-gray-900">Electric</Text>
          <Image source={require("@/assets/images/lightning.png")} style={{ height: 64, width: 64 }} />
        </TouchableOpacity>
      </View>

      {/* Header / Actions */}
      <View className="px-4 pt-8 pb-2 flex-row items-center justify-between">
        <Text className="text-white text-2xl font-bold">Booking</Text>
        <View className="flex-row items-center gap-4">
          {/* Plus (create room) */}
          <TouchableOpacity
            accessibilityLabel="Add room"
            onPress={() => setCreateOpen(true)}
            className="p-2 rounded-2xl bg-white/15"
          >
            <Feather name="plus" size={20} color="#fff" />
          </TouchableOpacity>
          {/* Trash toggler */}
          <TouchableOpacity
            accessibilityLabel="Toggle delete mode"
            onPress={() => setDeleteMode((v) => !v)}
            className={`p-2 rounded-2xl ${deleteMode ? "bg-red-600/80" : "bg-white/15"}`}
          >
            <Feather name="trash-2" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Rooms block */}
      <View className="px-4 mt-2 mb-3">
        <Text className="text-white/90 text-lg font-semibold">Rooms</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
          <Text className="text-white/80 mt-2">Loading...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          {rooms.length === 0 ? (
            <Text className="text-white/80 px-4">There isn't any room.</Text>
          ) : (
            rooms.map((room) => (
              <View
                key={String(room.id)}
                className="flex-row items-center mx-3 mb-2 bg-green-50 rounded-xl shadow overflow-hidden"
              >
                {/* Main row tap => open detail */}
                <TouchableOpacity
                  onPress={() => onOpenDetail(room)}
                  className="flex-1 flex-row items-center justify-between p-4"
                >
                  <Text className="font-semibold text-gray-900">Room {room.name}</Text>
                  <Text
                    className={`text-xs ${room.status === "Available" ? "text-green-700" : "text-red-700"}`}
                  >
                    {room.status ?? ""}
                  </Text>
                </TouchableOpacity>

                {/* Right-side controls */}
                {deleteMode ? (
                  <TouchableOpacity
                    onPress={() => onConfirmDelete(room)}
                    className="px-3 py-3 bg-red-50"
                  >
                    <Feather name="minus-circle" size={18} color="#e11d48" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => onOpenEdit(room)}
                    className="px-3 py-3 bg-white"
                  >
                    <Feather name="edit-2" size={16} color="#111827" />
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Edit Room Modal */}
      <Modal visible={editOpen} transparent animationType="fade" onRequestClose={() => setEditOpen(false)}>
        <View className="flex-1 bg-black/40 items-center justify-center px-6">
          <View className="w-full rounded-2xl bg-white p-4">
            <Text className="font-semibold text-base mb-2 text-gray-900">Edit room</Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Room's name"
              placeholderTextColor="#9CA3AF"    // gray-400
              className="border border-gray-300 rounded-xl px-3 py-2 text-gray-900"
            />
            <View className="flex-row justify-end gap-3 mt-3">
              <TouchableOpacity onPress={() => setEditOpen(false)} className="px-4 py-2">
                <Text className="text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onSaveEdit}
                disabled={saving}
                className="px-4 py-2 bg-green-600 rounded-xl"
              >
                <Text className="text-white">{saving ? "Saving..." : "Save"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Room Modal */}
      <Modal visible={createOpen} transparent animationType="fade" onRequestClose={() => setCreateOpen(false)}>
        <View className="flex-1 bg-black/40 items-center justify-center px-6">
          <View className="w-full rounded-2xl bg-white p-4">
            <Text className="font-semibold text-base mb-2 text-gray-900">Add room</Text>
            <TextInput
              value={newRoomName}
              onChangeText={setNewRoomName}
              placeholder="Room's name"
              placeholderTextColor="#9CA3AF"
              className="border border-gray-300 rounded-xl px-3 py-2 text-gray-900"
            />
            <View className="flex-row justify-end gap-3 mt-3">
              <TouchableOpacity onPress={() => setCreateOpen(false)} className="px-4 py-2">
                <Text className="text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onCreate} disabled={saving} className="px-4 py-2 bg-green-600 rounded-xl">
                <Text className="text-white">{saving ? "Creating..." : "Create"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}
