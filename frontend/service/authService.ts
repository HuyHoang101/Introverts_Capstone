import * as SecureStore from 'expo-secure-store';
import { loginApi, registerApi } from '../lib/authApi';
import { requestVerifyApi, consumeVerifyApi } from '../lib/verifyApi';

export const login = async (email: string, password: string) => {
  const { token, user } = await loginApi(email, password);
  await SecureStore.setItemAsync('accessToken', token);
  await SecureStore.setItemAsync('userInfo', JSON.stringify(user));
  return user;
};

export const register = async (formData: {
  email: string;
  password: string;
  name: string;
}) => {
  // 1. Gửi yêu cầu xác nhận email
  const verifyResult = await requestVerifyApi(formData.email);

  if (!verifyResult.ok) {
    throw new Error('Email verification request failed.');
  }

  // 2. Thông báo yêu cầu người dùng kiểm tra email và nhấn vào link xác minh
  alert('Please check your email and click the verification link.');

  // 3. Sau khi người dùng nhấn vào link xác minh trong email, frontend sẽ nhận token và tiêu thụ nó
  const token = new URLSearchParams(window.location.search).get('token'); // Lấy token từ query params

  if (!token) {
    throw new Error('Token not found in URL.');
  }
  
  // 4. Tiêu thụ token xác minh
  const consumeResult = await consumeVerifyApi(token);

  if (consumeResult.success) {
    // 5. Sau khi xác minh thành công, tạo tài khoản người dùng
    const userResult = await registerApi(formData); // Tạo user sau khi xác minh email

    // Lưu thông tin user vào SecureStore
    await SecureStore.setItemAsync('userInfo', JSON.stringify(userResult.user));
    await SecureStore.setItemAsync('accessToken', userResult.token);

    alert('Registration successful!');
    return userResult; // Trả về thông tin user
  } else {
    throw new Error('Email verification failed.');
  }
};


export const logout = async () => {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('userInfo');
};

export const getAccessToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync('accessToken');
};

export const getUserInfo = async (): Promise<any | null> => {
  const userJson = await SecureStore.getItemAsync('userInfo');
  return userJson ? JSON.parse(userJson) : null;
};
