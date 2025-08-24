import * as SecureStore from 'expo-secure-store';
import { loginApi, registerApi } from '../lib/authApi';

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
  const result = await registerApi(formData);
  return result; // có thể là { message, user }
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
