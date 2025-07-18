import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, Touchable, Modal } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons'; // để hiện icon "+" nếu dùng Expo

const PAGE_SIZE = 5;

export default function UserListScreen() {
  const [allUsers, setAllUsers] = useState<any[]>([
    { "id": 1, "role": "staff", "name": "Alice Nguyen", "email": "alice.nguyen@rmit.edu.vn" },
    { "id": 2, "role": "staff", "name": "Brian Tran", "email": "brian.tran@rmit.edu.vn" },
    { "id": 3, "role": "staff", "name": "Carol Le", "email": "carol.le@rmit.edu.vn" },
    { "id": 4, "role": "staff", "name": "Daniel Pham", "email": "daniel.pham@rmit.edu.vn" },
    { "id": 5, "role": "staff", "name": "Emma Vo", "email": "emma.vo@rmit.edu.vn" },
    { "id": 6, "role": "staff", "name": "Frank Do", "email": "frank.do@rmit.edu.vn" },
    { "id": 7, "role": "staff", "name": "Grace Huynh", "email": "grace.huynh@rmit.edu.vn" },
    { "id": 8, "role": "staff", "name": "Henry Ngo", "email": "henry.ngo@rmit.edu.vn" },
    { "id": 9, "role": "staff", "name": "Ivy Lam", "email": "ivy.lam@rmit.edu.vn" },
    { "id": 10, "role": "staff", "name": "Jacky Nguyen", "email": "jacky.nguyen@rmit.edu.vn" },
    { "id": 11, "role": "staff", "name": "Kelly Mai", "email": "kelly.mai@rmit.edu.vn" },
    { "id": 12, "role": "staff", "name": "Leo Bui", "email": "leo.bui@rmit.edu.vn" },
    { "id": 13, "role": "staff", "name": "Mia Dinh", "email": "mia.dinh@rmit.edu.vn" },
    { "id": 14, "role": "staff", "name": "Nathan Ho", "email": "nathan.ho@rmit.edu.vn" },
    { "id": 15, "role": "staff", "name": "Olivia Chau", "email": "olivia.chau@rmit.edu.vn" },

    { "id": 16, "role": "student", "name": "Peter Nguyen", "sid": "s3874561" },
    { "id": 17, "role": "student", "name": "Quynh Tran", "sid": "s3874562" },
    { "id": 18, "role": "student", "name": "Ryan Le", "sid": "s3874563" },
    { "id": 19, "role": "student", "name": "Sophie Vo", "sid": "s3874564" },
    { "id": 20, "role": "student", "name": "Tommy Do", "sid": "s3874565" },
    { "id": 21, "role": "student", "name": "Uyen Huynh", "sid": "s3874566" },
    { "id": 22, "role": "student", "name": "Victor Ngo", "sid": "s3874567" },
    { "id": 23, "role": "student", "name": "Wendy Lam", "sid": "s3874568" },
    { "id": 24, "role": "student", "name": "Xuan Nguyen", "sid": "s3874569" },
    { "id": 25, "role": "student", "name": "Yen Pham", "sid": "s3874570" },
    { "id": 26, "role": "student", "name": "Zack Le", "sid": "s3874571" },
    { "id": 27, "role": "student", "name": "Anh Bui", "sid": "s3874572" },
    { "id": 28, "role": "student", "name": "Bao Dinh", "sid": "s3874573" },
    { "id": 29, "role": "student", "name": "Chi Ho", "sid": "s3874574" },
    { "id": 30, "role": "student", "name": "Duy Chau", "sid": "s3874575" }
  ]);
  const [staffSearch, setStaffSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [staffPage, setStaffPage] = useState(1);
  const [studentPage, setStudentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', sid: '', role: '' });
  const openAddUserModal = (role: 'staff' | 'student') => {
    setNewUser({ name: '', email: '', sid: '', role }); // reset + set role
    setIsModalVisible(true);
  };
  const [editingUser, setEditingUser] = useState(null); // null | user object
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const openEditUserModal = (user: any) => {
    setEditingUser(user);
    setIsEditModalVisible(true);
  };  
  

  useEffect(() => {
    fetch('http://192.168.0.112:5000/api/user')
      .then(res => res.json())
      .then(data => setAllUsers(data))
      .catch(err => console.error('Lỗi fetch user:', err));
  }, []);

  // Delete user
  const handleDeleteUser = (id: number) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`http://localhost:5000/api/user/${id}`, {
                method: 'DELETE',
              });
  
              if (response.ok) {
                // Successfully deleted: update local user list
                setAllUsers(prev => prev.filter(user => user.id !== id));
              } else {
                const errText = await response.text();
                Alert.alert('Delete Failed', errText || 'Unable to delete the user.');
              }
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert('Delete Failed', 'Unable to connect to the server.');
            }
          }
        }
      ],
      { cancelable: true }
    );
  };
  

  //Add user
  const handleAddUser = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
  
      if (!res.ok) throw new Error('Failed to add user');
  
      const savedUser = await res.json();
  
      setAllUsers(prev => [...prev, savedUser]);
      setIsModalVisible(false);
    } catch (err) {
      console.error('Error adding user:', err);
      alert('Failed to add user.');
    }
  };

  const handleSaveEditUser = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser),
      });
  
      if (response.ok) {
        setAllUsers(prev =>
          prev.map(u => (u.id === editingUser.id ? editingUser : u))
        );
        setIsEditModalVisible(false);
      } else {
        Alert.alert('Update failed', await response.text());
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not connect to server.');
    }
  };
  
  

  // STAFF FILTER
  const filteredStaff = allUsers
    .filter(u => u.role === 'staff')
    .filter(u =>
      u.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(staffSearch.toLowerCase())
  );

  const totalStaffPages = Math.ceil(filteredStaff.length / PAGE_SIZE);
  const staffToDisplay = filteredStaff.slice(
    (staffPage - 1) * PAGE_SIZE,
    staffPage * PAGE_SIZE
  );

  // STUDENT FILTER
  const filteredStudent = allUsers
    .filter(u => u.role === 'student')
    .filter(u =>
      u.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (u.sid && u.sid.toLowerCase().includes(studentSearch.toLowerCase()))
  );

  const totalStudentPages = Math.ceil(filteredStudent.length / PAGE_SIZE);
  const studentToDisplay = filteredStudent.slice(
    (studentPage - 1) * PAGE_SIZE,
    studentPage * PAGE_SIZE
  );

  // Pagination Buttons Renderer
  const renderPagination = (totalPages: number, currentPage: number, setPage: (n: number) => void) => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          onPress={() => setPage(i)}
          className={`px-3 py-1 rounded-full border mx-1 ${currentPage === i ? 'bg-blue-500 border-blue-600' : 'bg-white border-gray-300'}`}
        >
          <Text className={`${currentPage === i ? 'text-white' : 'text-gray-800'}`}>{i}</Text>
        </TouchableOpacity>
      );
    }
    return <View className="flex-row justify-center mt-2 flex-wrap">{pages}</View>;
  };

  // Render Delete button when swipe left
  const renderRightActions = (id: number) => (
    <TouchableOpacity
      onPress={() => handleDeleteUser(id)}
      className="bg-red-500 justify-center items-center w-[80px] rounded-xl mb-2 ml-2"
    >
      <Text className="text-white font-bold">Delete</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <ScrollView className="flex-1 bg-white p-4">
        {/* STAFF LIST */}
        <View className='mb-8'>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-3xl font-bold">Staff</Text>
            <TouchableOpacity
              onPress={() => openAddUserModal('staff')}
              className="p-1 bg-blue-500 rounded-full"
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Search by name or email..."
            placeholderTextColor={'gray'}
            style={{ fontStyle: 'italic' }}
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            value={staffSearch}
            onChangeText={(text) => {
              setStaffSearch(text);
              setStaffPage(1);
            }}
          />
          {staffToDisplay.map(user => (
            <Swipeable
              key={user.id}
              renderRightActions={() => renderRightActions(user.id)}
            >
              <TouchableOpacity 
              onPress={() => openEditUserModal(user)}
              className="bg-blue-50 rounded-xl p-4 mb-2">
                <Text className="text-lg font-semibold">{user.name}</Text>
                <Text className="text-sm text-gray-700">{user.email}</Text>
              </TouchableOpacity>
            </Swipeable>
          ))}
          {renderPagination(totalStaffPages, staffPage, setStaffPage)}
        </View>

        {/* STUDENT LIST */}
        <View>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-3xl font-bold">Student</Text>
            <TouchableOpacity
              onPress={() => openAddUserModal('student')}
              className="p-1 bg-green-500 rounded-full"
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Search by name or SID..."
            placeholderTextColor={'gray'}
            style={{ fontStyle: 'italic' }}
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            value={studentSearch}
            onChangeText={(text) => {
              setStudentSearch(text);
              setStudentPage(1);
            }}
          />
          {studentToDisplay.map(user => (
            <Swipeable
              key={user.id}
              renderRightActions={() => renderRightActions(user.id)}
            >
              <TouchableOpacity
              onPress={() => openEditUserModal(user)}
              className="bg-green-50 rounded-xl p-4 mb-2">
                <Text className="text-lg font-semibold">{user.name}</Text>
                <Text className="text-sm text-gray-700">SID: {user.sid}</Text>
              </TouchableOpacity>
            </Swipeable>
          ))}
          {renderPagination(totalStudentPages, studentPage, setStudentPage)}
        </View>
      </ScrollView>
      {isModalVisible && (
        <Modal visible={true} transparent animationType="slide">
          <View className="absolute inset-0 bg-black/40 justify-center items-center z-50">
            <View className="bg-white w-[90%] p-4 rounded-xl shadow-lg">
              <Text className="text-xl font-bold mb-4">Add {newUser.role}</Text>

              <TextInput
                placeholder="Name"
                value={newUser.name}
                onChangeText={(text) => setNewUser(prev => ({ ...prev, name: text }))}
                className="border border-gray-300 rounded-lg px-4 py-2 mb-3"
              />

              {newUser.role === 'staff' ? (
                <TextInput
                  placeholder="Email"
                  value={newUser.email}
                  onChangeText={(text) => setNewUser(prev => ({ ...prev, email: text }))}
                  className="border border-gray-300 rounded-lg px-4 py-2 mb-3"
                />
              ) : (
                <TextInput
                  placeholder="Student ID"
                  value={newUser.sid}
                  onChangeText={(text) => setNewUser(prev => ({ ...prev, sid: text }))}
                  className="border border-gray-300 rounded-lg px-4 py-2 mb-3"
                />
              )}

              <View className="flex-row justify-end space-x-3">
                <TouchableOpacity onPress={() => setIsModalVisible(false)} className="px-4 py-2 bg-gray-300 rounded-lg">
                  <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddUser} className="px-4 py-2 bg-blue-500 rounded-lg">
                  <Text className="text-white">Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        )}

        {isEditModalVisible && editingUser && (
          <Modal visible={true} transparent animationType="slide">
            <View className="absolute inset-0 bg-black/40 justify-center items-center z-50">
              <View className="bg-white w-[90%] p-4 rounded-xl shadow-lg">
                <Text className="text-xl font-bold mb-4">Edit {editingUser.role}</Text>

                <TextInput
                  placeholder="Name"
                  value={editingUser.name}
                  onChangeText={(text) =>
                    setEditingUser(prev => ({ ...prev, name: text }))
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 mb-3"
                />

                {editingUser.role === 'staff' ? (
                  <TextInput
                    placeholder="Email"
                    value={editingUser.email}
                    onChangeText={(text) =>
                      setEditingUser(prev => ({ ...prev, email: text }))
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2 mb-3"
                  />
                ) : (
                  <TextInput
                    placeholder="Student ID"
                    value={editingUser.sid}
                    onChangeText={(text) =>
                      setEditingUser(prev => ({ ...prev, sid: text }))
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2 mb-3"
                  />
                )}

                <View className="flex-row justify-end space-x-3">
                  <TouchableOpacity
                    onPress={() => setIsEditModalVisible(false)}
                    className="px-4 py-2 bg-gray-300 rounded-lg"
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSaveEditUser}
                    className="px-4 py-2 bg-blue-500 rounded-lg"
                  >
                    <Text className="text-white">Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

    </>
  );
}
