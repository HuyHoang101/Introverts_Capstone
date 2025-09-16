import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  Animated,
  PanResponder,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sendChatMessage } from "@/service/chatService";
import { useChat } from "@/component/ChatContext";

const { width, height } = Dimensions.get("window");
const BUBBLE_SIZE = 64;
const PADDING = 8;
const SAFE_BOTTOM = 46;
const CHAT_W = Math.min(340, width - 24);
const CHAT_H = Math.min(420, height - 120);

// Màu chữ mặc định an toàn cho nền sáng
const TEXT_COLOR = "#111827"; // slate-900

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const dist2 = (x1: number, y1: number, x2: number, y2: number) =>
  Math.hypot(x1 - x2, y1 - y2);

const initialPos = () => ({
  x: width - BUBBLE_SIZE - 24,
  y: height - SAFE_BOTTOM - BUBBLE_SIZE,
});

export default function FloatingChat() {
  const [sessionId, setSessionId] = useState(0);
  const [pan, setPan] = useState(() => new Animated.ValueXY(initialPos()));

  const [bubblePos, setBubblePos] = useState(initialPos());
  const [open, setOpen] = useState(false);
  const [showCloseZone, setShowCloseZone] = useState(false);

  const { messages, addUserMessage, addBotMessage, visible, setVisible } = useChat();
  const [input, setInput] = useState("");

  useEffect(() => {
    if (visible) {
      const start = initialPos();
      (pan as any)?.stopAnimation?.(() => {});
      const freshPan = new Animated.ValueXY(start);
      setPan(freshPan);

      setBubblePos(start);
      setOpen(false);
      setShowCloseZone(false);
      setSessionId((s) => s + 1);
    }
  }, [visible]);

  useEffect(() => {
    const id = pan.addListener((v) => setBubblePos({ x: v.x, y: v.y }));
    return () => pan.removeListener(id);
  }, [pan]);

  const minX = PADDING;
  const maxX = width - BUBBLE_SIZE - PADDING;
  const minY = PADDING + (Platform.OS === "android" ? 0 : 20);
  const maxY = height - BUBBLE_SIZE - SAFE_BOTTOM;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          (pan as any).stopAnimation?.(() => {});
          const current = (pan as any).__getValue();
          pan.setOffset({ x: current.x, y: current.y });
          pan.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: (evt, gesture) => {
          Animated.event([null, { dx: pan.x, dy: pan.y }], {
            useNativeDriver: false,
          })(evt, gesture);
          setShowCloseZone(gesture.moveY > height - 150);
        },
        onPanResponderRelease: (_evt, gestureState) => {
          pan.flattenOffset();

          const current = (pan as any).__getValue();
          const finalX = current.x;
          const finalY = current.y + (Platform.OS === "android" ? 0 : 20);

          const clampedX = clamp(finalX, minX, maxX);
          const clampedY = clamp(finalY, minY, maxY);

          const moveDist = Math.hypot(gestureState.dx, gestureState.dy);

          if (moveDist < 6) {
            Animated.spring(pan, {
              toValue: { x: clampedX, y: clampedY },
              useNativeDriver: false,
            }).start();
            setOpen((prev) => !prev);
            setShowCloseZone(false);
            return;
          }

          const bubbleCenterX = clampedX + BUBBLE_SIZE / 2;
          const bubbleCenterY = clampedY + BUBBLE_SIZE / 2;

          const closeZoneSize = 150;
          const closeZoneCenterX = width / 2;
          const closeZoneCenterY = height - 40 - closeZoneSize / 2 + 100;

          const distance = Math.hypot(
            bubbleCenterX - closeZoneCenterX,
            bubbleCenterY - closeZoneCenterY
          );

          if (distance < closeZoneSize / 2) {
            (pan as any).stopAnimation?.(() => {});
            Animated.spring(pan, {
              toValue: {
                x: closeZoneCenterX - BUBBLE_SIZE / 2,
                y: closeZoneCenterY - BUBBLE_SIZE / 2,
              },
              speed: 20,
              bounciness: 0,
              useNativeDriver: false,
            }).start(() => {
              setOpen(false);
              setVisible(false);
              setShowCloseZone(false);
            });
            return;
          }

          const corners = [
            { x: minX, y: minY },
            { x: maxX, y: minY },
            { x: minX, y: maxY },
            { x: maxX, y: maxY },
          ];
          let nearest = corners[0];
          let best = dist2(clampedX, clampedY, nearest.x, nearest.y);
          for (let i = 1; i < corners.length; i++) {
            const d = dist2(clampedX, clampedY, corners[i].x, corners[i].y);
            if (d < best) {
              best = d;
              nearest = corners[i];
            }
          }

          Animated.spring(pan, {
            toValue: { x: nearest.x, y: nearest.y },
            useNativeDriver: false,
            friction: 8,
            tension: 60,
          }).start();

          setShowCloseZone(false);
        },
        onPanResponderTerminate: () => {
          pan.flattenOffset();
          setShowCloseZone(false);
        },
      }),
    [pan]
  );

  if (!visible) return null;

  const anchor = (() => {
    let left = bubblePos.x - CHAT_W + BUBBLE_SIZE / 2;
    left = clamp(left, 8, width - CHAT_W - 8);

    let top = bubblePos.y - CHAT_H - 12;
    if (top < 8) {
      top = bubblePos.y + BUBBLE_SIZE + 12;
      top = clamp(top, 8, height - CHAT_H - 8);
    }
    return { x: left, y: top };
  })();

  const handleSend = async () => {
    if (!input.trim()) return;
    addUserMessage(input);
    setInput("");

    try {
      const reply = await sendChatMessage(input);
      addBotMessage(reply);
    } catch (err) {
      console.error("sendChatMessage error", err);
      addBotMessage("Error when connecting with AI Chat Bot.");
    }
  };

  return (
    <>
      {open && (
        <KeyboardAvoidingView
          key={`chat-${sessionId}`}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={[
            styles.chatContainer,
            { left: anchor.x, top: anchor.y, width: CHAT_W, height: CHAT_H },
          ]}
        >
          <View {...panResponder.panHandlers} style={styles.chatHeader}>
            <Text style={styles.chatHeaderTitle}>Chat Bot</Text>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 10 }}
            renderItem={({ item }) => (
              <View
                style={[
                  item.sender === "user" ? styles.msgUser : styles.msgBot,
                  { maxWidth: "80%", marginBottom: 6 },
                ]}
              >
                {/* Thêm màu chữ tĩnh để không bị đổi thành trắng */}
                <Text style={styles.msgText}>{item.content}</Text>
              </View>
            )}
            style={{ flex: 1 }}
          />

          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Enter message..."
              placeholderTextColor={"#999"}
              style={styles.textInput}
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
              <Ionicons name="send" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          {
            position: "absolute",
            width: BUBBLE_SIZE,
            height: BUBBLE_SIZE,
            borderRadius: BUBBLE_SIZE / 2,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#16a34a",
            elevation: 12,
            zIndex: 9999,
          },
          pan.getLayout(),
        ]}
      >
        <Ionicons name="chatbubbles" size={28} color="white" />
      </Animated.View>

      {showCloseZone && (
        <View
          style={{
            position: "absolute",
            bottom: 40,
            alignSelf: "center",
            backgroundColor: "rgba(22,163,74,0.3)",
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>X</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 14,
    zIndex: 9998,
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#16a34a",
  },
  chatHeaderTitle: { color: "white", fontWeight: "600" },
  inputRow: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    color: TEXT_COLOR, // ← thêm màu chữ cho input
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: "#16a34a",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
  },
  msgUser: {
    alignSelf: "flex-end",
    backgroundColor: "#dcfce7",
    padding: 8,
    borderRadius: 8,
  },
  msgBot: {
    alignSelf: "flex-start",
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderRadius: 8,
  },
  // ← thêm style chữ dùng chung cho bong bóng
  msgText: {
    color: TEXT_COLOR,
  },
});
