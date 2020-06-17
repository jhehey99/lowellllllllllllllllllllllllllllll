#ifndef __WEBSOCKETHELPER_H__
#define __WEBSOCKETHELPER_H__

#include <WebSocketsClient.h>

/* Initialization */
WebSocketsClient webSocket;
void connectToWebSocket();

const char *socketUrl = "192.168.69.1";
const int socketPort = 6969;
const int socketRetry = 50;
bool socketConnected = false;
bool socketVerified = false;
String socketId;

/* SocketIO Events */
const char *socketVerifyEvent = "verify";
const char *socketVerifiedEvent = "verified";
const char *bloodPressureEvent = "bp";
const char *oxygenSaturationEvent = "bos";

//TODO
#define ECG     0
#define ARMIR   1
#define LEG     2
#define ARMRED  3

const String rawDataEvents[4] = {
  "raw-ecg",
  "raw-ppgarm-ir",
  "raw-ppgleg",
  "raw-ppgarm-red"
};

/* Payload */
typedef struct
{
  String Event;
  String Message;
} Payload;

/* Function Definitions */
Payload parsePayload(uint8_t *payload)
{
  Payload p;
  while (*payload != ']')
  {
    if (*payload == '[')
    {
      payload += 2;
      while (*payload != '"')
      {
        p.Event.concat((char)*payload);
        payload++;
      }
    }
    else if (*payload == ',')
    {
      payload += 2;
      while (*payload != '"')
      {
        p.Message.concat((char)*payload);
        payload++;
      }
    }
    payload++;
  }
  return p;
}

void verifySocket(const Payload &payload)
{
  if (payload.Event == socketVerifiedEvent && !socketVerified)
  {
    socketId = payload.Message;
    socketVerified = true;
    Serial.print("Nodemcu Socket has been verified at ");
    Serial.println(socketId);
  }
}

void websocketSendEvent(WStype_t type, uint8_t *payload, size_t length)
{
  switch (type)
  {
  case WStype_DISCONNECTED:
    Serial.printf("[WSc] Disconnected!\n");
    socketConnected = false;
    socketVerified = false;
    connectToWebSocket();
    break;
  case WStype_CONNECTED:
    Serial.printf("\n[WSc] Connected to url: %s\n", payload);
    socketConnected = true;
    // socket.io upgrade confirmation message (required)
    webSocket.sendTXT("5");
    break;
  case WStype_TEXT:
    Serial.printf("[WSc] get text: %s\n", payload);
    Payload parsedPayload = parsePayload(payload);
    verifySocket(parsedPayload);
    break;
  }
}

void connectToWebSocket()
{
  int retryCount = 0;
  webSocket.beginSocketIO(socketUrl, socketPort);
  webSocket.onEvent(websocketSendEvent);
  Serial.print("Connecting to WebSocket");
  while (!socketConnected)
  {
    retryCount++;
    webSocket.loop();
    Serial.print('.');
    if (retryCount >= socketRetry)
    {
      retryCount = 0;
      Serial.println("Failed to connect to WebSocket...");
      Serial.println("Retrying to connect to WebSocket...");
    }
    delay(10);
  }
  Serial.println("\nSuccessfully connected to WebSocket...");
  delay(100); // small pause
}

void emit(const String &event, const String &message, bool isJson = false)
{
  if (socketConnected)
  {
    String txt("42[\"" + event + "\",");
    if (isJson)
      txt += message + "]";
    else
      txt += "\"" + message + "\"]";
    webSocket.sendTXT(txt);
  }
  else
  {
    Serial.println("[WSc] can't emit, webSocket not connected...");
  }
}

void verifySocket()
{
  // para lang madetermine anong socket id ng nodemcu socket
  if (socketConnected && !socketVerified)
  {
    emit(socketVerifyEvent, "nodemcu");
    webSocket.loop();
  }
}

#endif
