import bcrypt from "bcryptjs";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  uploadUserAvatar,
  deleteUserAvatar,
} from "@/service/userService";

const PAGE_SIZE = 8;
bcrypt.setRandomFallback((len) => {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr[i] = Math.floor(Math.random() * 256);
  }
  return arr;
});

export default function UserListScreen() {
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Modal Add/Edit
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [userForm, setUserForm] = useState({
    email: "",
    name: "",
    password: "",
    phone: "",
    address: "",
    introduction: "",
    birthDate: "",
    role: "USER",
  });
  const [pickedAvatar, setPickedAvatar] = useState<string | null>(null);

  // Fetch user list
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      console.log("Fetching users...");
      const data = await getAllUsers();
      setAllUsers(data);
    } catch (err: any) {
      console.error("Fetch users error:", err?.response || err?.message || err);
    }
  };

  // Mở modal Add
  const openAddUserModal = () => {
    setEditingUser(null);
    setUserForm({
      email: "",
      name: "",
      password: "",
      phone: "",
      address: "",
      introduction: "",
      birthDate: "",
      role: "USER",
    });
    setPickedAvatar(null);
    setIsModalVisible(true);
  };

  // Mở modal Edit
  const openEditUserModal = (user: any) => {
    setEditingUser(user);
    setUserForm({
      email: user.email || "",
      name: user.name || "",
      password: "", // không show password cũ
      phone: user.phone || "",
      address: user.address || "",
      introduction: user.introduction || "",
      birthDate: user.birthDate ? user.birthDate.split("T")[0] : "",
      role: user.role || "USER",
    });
    setPickedAvatar(null);
    setIsModalVisible(true);
  };

  // Pick Image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setPickedAvatar(result.assets[0].uri);
    }
  };

  // Delete user
  const handleDeleteUser = (id: string, avatar?: string) => {
    Alert.alert("Confirm Deletion", "Are you sure you want to delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            if (avatar) {
              try {
                await deleteUserAvatar(id);
              } catch (err) {
                console.warn("Delete avatar failed:", err);
              }
            }
            await deleteUser(id);
            setAllUsers((prev) => prev.filter((u) => u.id !== id));
          } catch (error) {
            console.error("Error deleting user:", error);
            Alert.alert("Delete Failed", "Unable to connect to server.");
          }
        },
      },
    ]);
  };

  // Save Add/Edit
  const handleSaveUser = async () => {
    try {
      if (!userForm.email) {
        Alert.alert("Validation", "Email is required.");
        return;
      }
      if (!editingUser && !userForm.password) {
        Alert.alert("Validation", "Password is required when creating user.");
        return;
      }

      if (editingUser) {
        // Update user
        const updated = await updateUser(editingUser.id, {
          email: userForm.email,
          name: userForm.name,
          phone: userForm.phone,
          address: userForm.address,
          introduction: userForm.introduction,
          birthDate: userForm.birthDate,
          role: userForm.role,
        });

        // Upload avatar nếu có
        if (pickedAvatar) {
          await uploadUserAvatar(editingUser.id, pickedAvatar);
          updated.avatar = pickedAvatar; // local preview
        }

        setAllUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(userForm.password, salt);
        // Add user
        const newUser = await addUser({
          email: userForm.email,
          password: hashedPassword,
          name: userForm.name || "Unnamed",   // ✔ có giá trị thật
          role: userForm.role || "USER"       // ✔ role mặc định
        });
        setAllUsers((prev) => [...prev, newUser]);
      }

      setIsModalVisible(false);
      setPickedAvatar(null);
    } catch (err) {
      console.error("Save user error:", err);
      Alert.alert("Failed", "Could not save user.");
    }
  };

  // Filter + Pagination
  const filteredUsers = allUsers
    .filter((u) => u.role !== "ADMIN") // loại bỏ ADMIN
    .filter(
      (u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.toLowerCase().includes(search.toLowerCase())
    );
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const usersToDisplay = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Pagination buttons
  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          onPress={() => setPage(i)}
          className={`px-3 py-1 rounded-full border mx-1 ${
            page === i ? "bg-blue-500 border-blue-600" : "bg-white border-gray-300"
          }`}
        >
          <Text className={`${page === i ? "text-white" : "text-gray-800"}`}>{i}</Text>
        </TouchableOpacity>
      );
    }
    return <View className="flex-row justify-center mt-2 flex-wrap">{pages}</View>;
  };

  // Swipe Delete
  const renderRightActions = (user: any) => (
    <TouchableOpacity
      onPress={() => handleDeleteUser(user.id, user.avatar)}
      className="bg-red-500 justify-center items-center w-[80px] rounded-xl mb-2 ml-2"
    >
      <Text className="text-white font-bold">Delete</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <ScrollView className="flex-1 bg-white p-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-3xl font-bold text-black">Users</Text>
          <TouchableOpacity onPress={openAddUserModal} className="p-1 bg-blue-500 rounded-full">
            <MaterialIcons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <TextInput
          placeholder="Search by name, email or phone..."
          placeholderTextColor={"#9ca3af"}
          style={{ fontStyle: "italic" }}
          className="border border-gray-300 rounded-lg px-4 py-2 mb-4 text-black"
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            setPage(1);
          }}
        />

        {/* List */}
        {usersToDisplay.map((user) => (
          <Swipeable key={user.id} renderRightActions={() => renderRightActions(user)}>
            <TouchableOpacity
              onPress={() => openEditUserModal(user)}
              className="bg-gray-50 rounded-xl p-4 mb-2"
            >
              <Text className="text-lg font-semibold text-black">{user.name || "No name"}</Text>
              <Text className="text-sm text-gray-700">{user.email}</Text>
              {user.phone && <Text className="text-sm text-gray-700">📞 {user.phone}</Text>}
              {user.role && (
                <Text className="text-xs text-gray-500 italic">Role: {user.role}</Text>
              )}
            </TouchableOpacity>
          </Swipeable>
        ))}

        {renderPagination()}
      </ScrollView>

      {/* Modal Add/Edit */}
      {isModalVisible && (
        <Modal visible={true} transparent animationType="slide">
          <View className="absolute inset-0 bg-black/40 justify-center items-center z-50">
            <ScrollView className="bg-white w-[90%] p-4 rounded-xl shadow-lg max-h-[90%]">
              <Text className="text-xl font-bold mb-4 text-black">
                {editingUser ? "Edit User" : "Add User"}
              </Text>

              {editingUser ? (
                <>
                  {[
                    { key: "email", label: "Email", required: true },
                    { key: "name", label: "Name" },
                    { key: "phone", label: "Phone" },
                    { key: "address", label: "Address" },
                    { key: "introduction", label: "Introduction" },
                    { key: "birthDate", label: "Birth Date (YYYY-MM-DD)" },
                    { key: "role", label: "Role (USER/STAFF/ADMIN)" },
                  ].map((f) => (
                    <TextInput
                      key={f.key}
                      placeholder={f.label}
                      placeholderTextColor={"#9ca3af"}
                      value={(userForm as any)[f.key]}
                      onChangeText={(text) =>
                        setUserForm((prev) => ({ ...prev, [f.key]: text }))
                      }
                      className="border border-gray-300 rounded-lg px-4 py-2 mb-3 text-black"
                    />
                  ))}

                  {/* Avatar Upload */}
                  <TouchableOpacity
                    onPress={pickImage}
                    className="bg-gray-200 rounded-lg p-3 mb-3 items-center"
                  >
                    <Text className="text-black">Pick Avatar</Text>
                  </TouchableOpacity>
                  {pickedAvatar ? (
                    <Image
                      source={{ uri: pickedAvatar }}
                      className="w-24 h-24 rounded-full self-center mb-3"
                    />
                  ) : editingUser?.avatar ? (
                    <Image
                      source={{ uri: editingUser.avatar }}
                      className="w-24 h-24 rounded-full self-center mb-3"
                    />
                  ) : null}
                </>
              ) : (
                // Form ADD
                <>
                  {[
                    { key: "email", label: "Email", required: true },
                    { key: "password", label: "Password", type: "password", required: true },
                  ].map((f) => (
                    <TextInput
                      key={f.key}
                      placeholder={f.label}
                      placeholderTextColor={"#9ca3af"}
                      secureTextEntry={f.type === "password"}
                      value={(userForm as any)[f.key]}
                      onChangeText={(text) =>
                        setUserForm((prev) => ({ ...prev, [f.key]: text }))
                      }
                      className="border border-gray-300 rounded-lg px-4 py-2 mb-3 text-black"
                    />
                  ))}
                </>
              )}

              {/* Buttons */}
              <View className="flex-row justify-end">
                <TouchableOpacity
                  onPress={() => setIsModalVisible(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg mr-2"
                >
                  <Text className="text-black">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveUser}
                  className="px-4 py-2 bg-blue-500 rounded-lg"
                >
                  <Text className="text-white">{editingUser ? "Save" : "Add"}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}
    </>
  );
}
