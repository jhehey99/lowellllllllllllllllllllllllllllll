READ ME

- nasa pinaka baba yung hardware setup

---

DEFAULT SETUP FOR SERVER

- Database is disabled
- Database Name is lowellDB
- Running in test mode
- Port is 6969
- Url is "http://localhost:6969/ecg"

---

# If you want a database. (Its okay if NO database, still works!)

- Download MongoDB Compass
- go to "app.js"
- find this (line 24, 25, somewhere dun)
  // Uncomment line below to connect to database
  // connection.connect(mongooseConfig);
- uncomment the connect. if you want to connect to a database
- this will automatically create the database schema and everything. as long as you have mongodb installed.

# If you are using a database

- You can view the ecg records you recorded
- you can't view it, if not connected

# If wanna change the name of your database

- go to .env file, change DB_NAME
- it automatically creates the database and tables needed

# NOTE

- If you dont want a database. its okay, it still works
- You can still access the raw ecg files and view the real time graphs

---

# SERVER SETUP

# Install dependencies

\$ npm install

# Start server

\$ npm run dev

# After Starting the server make sure the console prints out, to know its ok

$ DataSocket - ECG socket connected
$ DBConnection - Successfully connected to the database

# View the web app

- Go to url "http://localhost:6969/ecg"

# By default it is in test mode

- You will see a sine wave being displayed
- You can record it, and check the raw files to see if it is actually recorded

# Raw ECG Files

- Raw files are created in "tmp/raw_data/{recordId}/ecg.txt"

# DISABLE test mode

- go to "app.js"
- find (line 63, somewhere dun)
  "require('./lib/socket/test')(io);"
- COMMENT THIS OUT to disable test mode

---

# Test in real device

- disable test mode
- make sure nodemcu is connected to wifi
- make sure ip address, url, and port inside nodemcu is correct

# Determine if nodemcu CONNECTED successfully to the server

- You will see in the console

- > DeviceSocket - verify - socketId: {id}
- OR
- > DeviceSocket - verify - Device at {id} was verified

# Determine if nodemcu DISCONNECTED

- you will see in the console
  > DeviceSocket - disconnect - Device at {id} was disconnected

# NOTE:

- Dont worry if nodemcu suddenly disconnected from the server
- sometimes it disconnects, but will reconnect back again by itself
- as long as configuration is properly setup

---

# DANGER! If you wanna delete all records in database and temporary files

- go to "http://localhost:6969/dev/reset"
- this will delete all data in database and files in tmp directory
- Use this only for resetting your files it it is very cluttered

---

# HARDWARE SETUP

# Change wifi ssid and pass

- go to root-nodemcu/include/WifiHelper.h
- change ssid and pass

# Change Ip address

- go to go to root-nodemcu/include/WebSocketHelper.h
- change socketUrl to the ip address of your laptop

# Port settings

- Make sure socketPort is the same as the port of your server
- by default it is 6969
- you can view the PORT of the server in the .env file

# Reading and sending sensor data

- go root-nodemcu/src/main.cpp
- change the SENSOR_IN to the pin you use in your device
- convert the value to to string
- then emit to websocket

# Check the sensor value first if you are reading something

- Use serial print or something

---

# Platform IO

---

# Download these packages

- WebSocketsClient
- ESP8266WiFiMulti
