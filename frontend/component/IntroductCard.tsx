// IntroductCard.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

interface Props {
  visible: boolean;
  onClose: () => void;
}

const IntroductCard: React.FC<Props> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-end">
        <View
          style={{ height: height * 0.85 }}
          className="bg-white rounded-t-2xl p-5"
        >
          {/* Close button */}
          <View className="flex-row items-center mb-2">
            <TouchableOpacity onPress={onClose} className="mr-2">
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Logo */}
          <View className="items-center mb-4">
            <Image
              source={require("@/assets/images/leaf.png")}
              className="w-16 h-16"
              resizeMode="contain"
            />
            <Text className="text-lg font-bold text-gray-800 mt-2">
              About Us
            </Text>
          </View>

          {/* Content */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text className="text-base text-gray-700 mb-3">
              Welcome to the RMIT Sustainability Monitoring App – a smart
              platform designed to support a greener and more efficient campus.
              By combining real-time data tracking, easy reporting, and
              student-friendly tools, the app helps RMIT strengthen its
              commitment to sustainability and smooth daily operations.
            </Text>

            <View className="space-y-3">
              <View>
                <Text className="font-semibold text-gray-800">
                  • Energy, Water & Air Tracking
                </Text>
                <Text className="text-gray-600">
                  Provides accurate monitoring of electricity, water, and air
                  quality data across campus to ensure sustainable operations.
                </Text>
              </View>

              <View>
                <Text className="font-semibold text-gray-800">
                  • Incident Reporting
                </Text>
                <Text className="text-gray-600">
                  Allows students and staff to submit reports when issues are
                  detected; administrators can review and quickly assign staff
                  for timely resolution.
                </Text>
              </View>

              <View>
                <Text className="font-semibold text-gray-800">
                  • Lab Table Booking
                </Text>
                <Text className="text-gray-600">
                  Enables students to reserve tables in laboratories, supporting
                  fair and efficient use of campus resources.
                </Text>
              </View>

              <View>
                <Text className="font-semibold text-gray-800">
                  • AI Assistant
                </Text>
                <Text className="text-gray-600">
                  A smart helper that guides users in writing reports, answering
                  sustainability-related questions, and suggesting practical
                  solutions tailored to the campus.
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default IntroductCard;
