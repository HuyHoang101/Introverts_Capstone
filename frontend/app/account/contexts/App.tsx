import { UserProvider } from "../contexts/UserContext";
import { Slot } from "expo-router"; // nếu bạn dùng expo-router

export default function App() {
  return (
    <UserProvider>
      <Slot /> {/* Router sẽ render ở đây */}
    </UserProvider>
  );
}
