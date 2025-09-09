// service/chatService.ts
import * as chatApi from "@/lib/chatApi";

export type ChatMessage = {
  id: string;
  content: string;
  sender: "user" | "bot";
};

export const sendChatMessage = async (message: string) => {
  const res = await chatApi.sendMessage(message);
  console.log("Chat API response:", res);
  return res.reply as string;
};