import request from '../lib/userApi';
import { requestVerifyApi, consumeVerifyApi } from '../lib/verifyApi';
import { registerApi } from '../lib/authApi';
import * as SecureStore from 'expo-secure-store';

// CRUD cơ bản
export const getAllUsers = async () => {
  return request('/', { method: 'GET' });
};

export const getUserById = async (id: string) => {
  return request(`/${id}`, { method: 'GET' });
};

export const addUser = async (data: any) => {
  return request('/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateUser = async (id: string, data: any) => {
  return request(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// Gửi yêu cầu xác thực
export const requestVerification = async (email: string) => {
  const res = await requestVerifyApi(email);
  if (!res.success) throw new Error("Failed to send verification email");
  alert("Please check your email and click the verification link.");
  return res;
};

// Xử lý token sau khi user click link
export const handleVerification = async (
  token: string,
  action: "register" | "changePassword",
  payload: any
) => {
  const consumeResult = await consumeVerifyApi(token);
  if (!consumeResult.success) throw new Error("Email verification failed.");

  if (action === "register") {
    const userResult = await registerApi(payload);
    await SecureStore.setItemAsync("userInfo", JSON.stringify(userResult.user));
    await SecureStore.setItemAsync("accessToken", userResult.token);
    alert("Registration successful!");
    return userResult;
  }

  if (action === "changePassword") {
    const { id, newPassword } = payload;
    const result = await updateUser(id, { password: newPassword });
    if (!result) throw new Error("Password change failed");
    alert("Password changed successfully");
    return result;
  }
};

export const deleteUser = async (id: string) => {
  return request(`/${id}`, { method: 'DELETE' });
};

export const uploadUserAvatar = async (id: string, fileUri: string) => {
  const formData = new FormData();
  formData.append('avatar', {
    uri: fileUri,
    name: 'avatar.jpg',
    type: 'image/jpeg',
  } as any); // 👈 React Native cần ép kiểu

  const res = await fetch(`https://greensyncintroverts.online/api/users/${id}/upload-avatar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Upload failed: ${err}`);
  }

  return res.json();
};

export const deleteUserAvatar = async (id: string) => {
  const res = await fetch(`https://greensyncintroverts.online/api/users/${id}/delete-avatar`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Delete failed: ${err}`);
  }

  return res.json();
};
