import React, { createContext, useContext, useState } from "react";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export type ChatMessage = {
  id: string;
  content: string;
  sender: "user" | "bot";
};

type ChatContextType = {
  messages: ChatMessage[];
  addUserMessage: (text: string) => void;
  addBotMessage: (text: string) => void;
  visible: boolean;
  setVisible: (v: boolean) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [visible, setVisible] = useState(true);

  const addUserMessage = (text: string) => {
    setMessages((prev) => [...prev, { id: uuidv4(), content: text, sender: "user" }]);
  };

  const addBotMessage = (text: string) => {
    setMessages((prev) => [...prev, { id: uuidv4(), content: text, sender: "bot" }]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        addUserMessage,
        addBotMessage,
        visible,
        setVisible,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
};
