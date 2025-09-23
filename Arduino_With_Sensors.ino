#include <Arduino.h>
#include <WiFiS3.h>
#include <ArduinoMqttClient.h>
#include <math.h>
#include "SHTC3Modbus.h" //https://github.com/mkevn/SHTC3Modbus

/* ===================== GAS SENSOR DEFINITIONS ===================== */
#define VC       5.0
#define ADC_MAX  1023.0

// --- GM-802B (NH3) ---
#define RL_NH3   4700      // ohm
#define PIN_NH3  A0
float R0_NH3   = 61891.9;  // baseline in clean air

// --- MQ-7 (CO) ---
#define RL_CO    5060
#define PIN_CO   A2
float R0_CO    = 50008.2;

// --- NO2 sensor ---
#define RL_NO2   4700
#define PIN_NO2  A1
float R0_NO2   = 21474836.0;

/* ===================== SHTC3 RS485 DEFINITIONS ===================== */
#define RX_SHT A4
#define TX_SHT A5
SHTC3 shtc3(RX_SHT, TX_SHT, BAUD_4800, 0x01);

/* ===================== WIFI & MQTT ===================== */
char ssid[] = "huyhoang";
char pass[] = "huyhoang";

const char* broker = "18.141.194.161";
const int   port   = 1883;
const char* topic  = "/sensor/data";

WiFiClient net;
MqttClient mqttClient(net);

char clientId[32];

/* ===================== FUNCTIONS ===================== */
float readNH3() {
  int adc = analogRead(PIN_NH3);
  float Vout = adc * VC / ADC_MAX;
  float Rs = RL_NH3 * (VC - Vout) / Vout;
  float ratio = Rs / R0_NH3;
  return pow(10, (-4.27 * log10(ratio) + 0.391));
}

float readCO() {
  int adc = analogRead(PIN_CO);
  float Vout = adc * VC / ADC_MAX;
  float Rs = RL_CO * (VC - Vout) / Vout;
  float ratio = Rs / R0_CO;
  return pow(10.0, (-1.792 * log10(ratio) + 1));
}

float readNO2() {
  int adc = analogRead(PIN_NO2);
  float Vout = adc * VC / ADC_MAX;
  float Rs = RL_NO2 * (VC - Vout) / Vout;
  float ratio = Rs / R0_NO2;
  return pow(10.0, (1.8384 * log10(ratio) - 0.2524));
}

/* ===================== SETUP ===================== */
void setup() {
  Serial.begin(115200);
  delay(2000);

  // Wi-Fi
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  // MQTT
  snprintf(clientId, sizeof(clientId), "unoR4-%lu", millis());
  Serial.print("Connecting to MQTT...");
  if (!mqttClient.connect(broker, port)) {
    Serial.println(" FAILED");
    while (true) { delay(1000); }
  }
  Serial.println(" connected!");

  // SHTC3
  shtc3.begin(4800);
}

/* ===================== LOOP ===================== */
void loop() {
  // --- Read sensors ---
  float nh3 = readNH3();
  float co  = readCO();
  float no2 = readNO2();
  dataSHTC3 data = shtc3.getData();

  // --- JSON Payload ---
  String payload = "{";
  payload += "\"nh3\":" + String(nh3, 2) + ",";
  payload += "\"co\":"  + String(co, 2) + ",";
  payload += "\"no2\":" + String(no2, 2) + ",";
  payload += "\"tempC\":" + String(data.temperatureC, 1) + ",";
  payload += "\"humidity\":" + String(data.humidity, 1);
  payload += "}";

  Serial.println("Publishing: " + payload);
  mqttClient.beginMessage(topic);
  mqttClient.print(payload);
  mqttClient.endMessage();

  mqttClient.poll();

  delay(5000); // every 5 sec
}
