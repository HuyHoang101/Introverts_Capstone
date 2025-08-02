import React, { createContext, useContext, useState } from "react";

// Định nghĩa kiểu dữ liệu user
type User = {
  username: string;
  avatar: string;
  setUsername: (name: string) => void;
  setAvatar: (url: string) => void;
};

// Context mặc định
const UserContext = createContext<User>({
  username: "A Nguyen", // mặc định
  avatar: "https://i.pravatar.cc/150?img=3", // mặc định
  setUsername: () => {},
  setAvatar: () => {},
});

// Provider để bọc toàn app
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState("A Nguyen");
  const [avatar, setAvatar] = useState("https://i.pravatar.cc/150?img=3");

  return (
    <UserContext.Provider value={{ username, avatar, setUsername, setAvatar }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook tiện để lấy dữ liệu
export const useUser = () => useContext(UserContext);
