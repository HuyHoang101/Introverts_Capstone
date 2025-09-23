import mqtt from "mqtt";
import axios from "axios";

// ---- Local MQTT broker (Arduino publishes here) ----
const localBrokerUrl = "mqtt://18.141.194.161:1883"; 
const localTopic = "/sensor/data";

// ---- Database endpoint on EC2 ----
const dbEndpoint = "https://greensyncintroverts.online/api/pollution-data"; 

// ---- Connect to local broker ----
const localClient = mqtt.connect(localBrokerUrl);

let latestPayload = null; // buffer latest data

localClient.on("connect", () => {
  console.log("✅ Connected to local broker");
  localClient.subscribe(localTopic, (err) => {
    if (err) console.error("❌ Failed to subscribe:", err);
    else console.log(`📡 Subscribed to local topic: ${localTopic}`);
  });
});

localClient.on("error", (err) => console.error("❌ Local broker error:", err));
localClient.on("reconnect", () => console.log("🔄 Reconnecting to local broker..."));

// ---- Update latest payload when new message arrives ----
localClient.on("message", (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    latestPayload = {
      period: new Date().toISOString(),
      temperature: payload.tempC ?? 0,
      humidity: payload.humidity ?? 0,
      co: payload.co ?? 0,
      no2: payload.no2 ?? 0,
      nh3: payload.nh3 ?? 0,
    };
    console.log("📥 Updated latest payload:", latestPayload);
  } catch (err) {
    console.error("❌ Failed to parse MQTT message:", err.message);
  }
});

// ---- Send data to database every 1 hour (3600000 ms) ----
setInterval(async () => {
  if (!latestPayload) return; // nothing to send yet

  try {
    console.log("➡️ Sending hourly data to database:", latestPayload);
    const response = await axios.post(dbEndpoint, latestPayload, { timeout: 5000 });

    if (response.status === 200 || response.status === 201) {
      console.log("✅ Hourly data inserted successfully");
    } else {
      console.warn(`⚠️ Database responded with status: ${response.status}`);
    }
  } catch (err) {
    console.error("❌ Failed to send hourly data:", err.message);
  }
}, 30000);