import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";
import "@/global.css";
import {
  getAllTables,
  createTable,
  updateTable,
  deleteTable,
} from "@/service/tableService";

interface TableItem {
  id: number | string;
  name: string;
  roomId?: string;
}

export default function RoomDetail() {
  const { roomId, name } = useLocalSearchParams<{ roomId: string; name?: string }>();
  const rid = useMemo(() => String(roomId), [roomId]);

  const [tables, setTables] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<TableItem | null>(null);
  const [editName, setEditName] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const [saving, setSaving] = useState(false);

  const fetchTables = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllTables();
      const list: TableItem[] = Array.isArray(data) ? data : data?.tables || [];
      const filtered = list.filter((t) => String(t.roomId ?? "") === String(rid));
      setTables(filtered);
    } catch (e: any) {
      Alert.alert("Fetch tables failed", e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }, [rid]);

  useFocusEffect(
    useCallback(() => {
      fetchTables();
    }, [fetchTables])
  );

  const onCreate = async () => {
    const name = newName.trim();
    if (!name) return Alert.alert("Room's name missing", "Please, enter room's name");
    try {
      setSaving(true);
      await createTable({ name, roomId: rid });
      setCreateOpen(false);
      setNewName("");
      fetchTables();
    } catch (e: any) {
      Alert.alert("Create table failed", e?.message || String(e));
    } finally {
      setSaving(false);
    }
  };

  const onOpenEdit = (t: TableItem) => {
    setEditItem(t);
    setEditName(t.name ?? "");
    setEditOpen(true);
  };

  const onSaveEdit = async () => {
    if (!editItem) return;
    try {
      setSaving(true);
      await updateTable(String(editItem.id), { name: editName.trim() });
      setEditOpen(false);
      setEditItem(null);
      setEditName("");
      fetchTables();
    } catch (e: any) {
      Alert.alert("Update table failed", e?.message || String(e));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = (t: TableItem) => {
    Alert.alert("Delete table?", `Are you sure to delete “${t.name}”?`, [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTable(String(t.id));
            setTables((prev) => prev.filter((x) => String(x.id) !== String(t.id)));
          } catch (e: any) {
            Alert.alert("Delete failed", e?.message || String(e));
          }
        },
      },
    ]);
  };

  return (
    <ImageBackground
      source={require("@/assets/images/bg_main.png")}
      resizeMode="cover"
      className="flex-1"
    >
      <View className="px-4 pt-8 pb-3 flex-row items-center justify-between">
        <Text className="text-white text-xl font-semibold">
          Room {name ?? rid}
        </Text>
        <TouchableOpacity
          onPress={() => setCreateOpen(true)}
          className="p-2 rounded-2xl bg-white/15"
        >
          <Feather name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          {tables.length === 0 ? (
            <Text className="text-white/80 px-4">There isn't any room.</Text>
          ) : (
            tables.map((t) => (
              <View
                key={String(t.id)}
                className="mx-3 mb-2 rounded-xl bg-white flex-row items-center overflow-hidden"
              >
                <View className="flex-1 p-4">
                  <Text className="font-semibold">{t.name}</Text>
                </View>
                <TouchableOpacity onPress={() => onOpenEdit(t)} className="px-3 py-3 bg-white">
                  <Feather name="edit-2" size={16} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(t)} className="px-3 py-3 bg-red-50">
                  <Feather name="trash-2" size={18} color="#e11d48" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Edit Table */}
      <Modal visible={editOpen} transparent animationType="fade" onRequestClose={() => setEditOpen(false)}>
        <View className="flex-1 bg-black/40 items-center justify-center px-6">
          <View className="w-full rounded-2xl bg-white p-4">
            <Text className="font-semibold text-base mb-2">Edit table</Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Table's name"
              className="border border-gray-300 rounded-xl px-3 py-2"
            />
            <View className="flex-row justify-end gap-3 mt-3">
              <TouchableOpacity onPress={() => setEditOpen(false)} className="px-4 py-2">
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onSaveEdit} disabled={saving} className="px-4 py-2 bg-green-600 rounded-xl">
                <Text className="text-white">{saving ? "Saving..." : "Save"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Table */}
      <Modal visible={createOpen} transparent animationType="fade" onRequestClose={() => setCreateOpen(false)}>
        <View className="flex-1 bg-black/40 items-center justify-center px-6">
          <View className="w-full rounded-2xl bg-white p-4">
            <Text className="font-semibold text-base mb-2">Add table</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Table's name"
              className="border border-gray-300 rounded-xl px-3 py-2"
            />
            <View className="flex-row justify-end gap-3 mt-3">
              <TouchableOpacity onPress={() => setCreateOpen(false)} className="px-4 py-2">
                <Text>Huỷ</Text>
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