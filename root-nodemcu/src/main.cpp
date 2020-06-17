#include "RFHelper.h"
#include "WifiHelper.h"
#include "WebSocketHelper.h"

/* Definitions */
#define SENSOR_IN 2 // CHANGE THIS TO WHAT PIN YOU ARE USING TO YOUR NODEMCU

/* Initialization */
int value = 0;

void setup()
{

  /* Serial Monitor */
  Serial.begin(9600);
  Serial.flush();
  Serial.println("\nSetup...");

  /* Wifi */
  connectToWifi();

  /* Web Socket */
  connectToWebSocket();
}

void loop()
{
  // put your main code here, to run repeatedly:
  verifySocket();

	// READ ECG SENSOR VALUE HERE
	value = analogRead(SENSOR_IN);

	// CONVERT IT TO STRING
	String data = String(value)

	// emit to the web socket
	emit('raw-ecg', data);
}
