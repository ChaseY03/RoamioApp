# Roamio navigation app

This is a University dissertation project 

A cross platform mobile navigation app created with JavaScript built with the React Native Expo

**Author**: [Chase Yang](https://github.com/ChaseY03) :cowboy_hat_face:

## Table of contents
- [Tech stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Demo](#demo)

## Tech Stack

**Front-end:** React Native, Expo, React Navigation, Axios, react-native-dotenv, react-native-google-maps-directions, react-native-google-places-autocomplete, react-native-maps, react-native-maps-directions,  tailwind-react-native-classnames

**Backend:** Node.js, Nodemon, Express, MySQL, body-parser, cors


## Features

- Interactive map with location services
- Ability to save trip details if they have created an account
- Save custom notes to trips when adding to account
- Quick search for attractions of a location
- Weather information on their current location or search for information of another place


## Prerequisites
In order for your application to be run on your machine make sure you have got the following installed:

- Node.js
- npm or Yarn
- Expo CLI


This project is currently only set-up to run locally so you will need to set up your own MySQL database.

- Install [MySQL Server](https://dev.mysql.com/downloads/mysql/) and [MySQL workbench](https://dev.mysql.com/downloads/workbench/)

- Start the MySQL Server on your machine

- Open MySQL Workbench
    - Click on the "+" icon next to "MySQL Connections" to open the connection dialog.
    - Enter the necessary connection details such as hostname (usually "localhost"), username, and password. The default username is often "root" with an empty password, but this may vary depending on your MySQL configuration.
    - Click "OK" to establish the connection.

- Once connected, you will need to make a database schema named `roamio`

- Once the schema is created, you will need to create the respective tables:

```bash
CREATE TABLE `user` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `userEmail` varchar(45) NOT NULL,
  `userPassword` varchar(45) NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `userEmail_UNIQUE` (`userEmail`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `usersavedlocation` (
  `savedlocationID` int NOT NULL AUTO_INCREMENT,
  `savedlocationUserID` int NOT NULL,
  `savedlocationName` varchar(45) NOT NULL,
  `savedlocationOrigin` varchar(255) NOT NULL,
  `savedlocationDestination` varchar(255) NOT NULL,
  `savedlocationDirections` varchar(10000) NOT NULL,
  `savedlocationDistance` varchar(50) NOT NULL,
  `savedlocationDuration` varchar(50) NOT NULL,
  `savedlocationNote` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`savedlocationID`),
  KEY `userID_idx` (`savedlocationUserID`),
  CONSTRAINT `userID` FOREIGN KEY (`savedlocationUserID`) REFERENCES `user` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```


### API keys
To run this project, you will need to add the following environment variables to your .env file

`GOOGLE_API_KEY = []`

`WEATHER_API_KEY = []`



You will need to obtain a Google API key from [Google Cloud](https://cloud.google.com/docs/authentication/api-keys)
You will need to create an account if you do not have one already, once logged in you will need to create a new project or access an existing project

- Once you're in your project, navigate to the "API & Services" > "Library" section

- Search for "Maps JavaScript API" and click on it

- Click the "Enable" button to enable the API for your project

- After enabling the Maps JavaScript API, go to the "API & Services" > "Credentials" section

- Click on the "Create Credentials" dropdown and select "API key". A pop-up will appear with your API key, copy this key. It will need to be added  to your .env file in the project


You will also need to obtain an [OpenWeatherMap](https://openweathermap.org/api) API key. You will be required to create an account and verify


## Installation

- Download the [repository](https://github.com/ChaseY03/RoamioApp) or clone the reposity using `git clone https://github.com/ChaseY03/RoamioApp.git`

- `cd` into `Roamio`

Install all the dependencies

```bash
  npm install
  or
  yarn install
```

Start the expo development server
```bash
npm start
```

- You can either run this application by running an emulator on your development machine or through the Expo Go app on your physical phone
    - Download the Expo Go app from the [App Store](https://apps.apple.com/app/apple-store/id982107779) or [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
    - Once installed, ensure you are on the same network, open the Expo Go app and scan the QR code displayed in the terminal. If this does not work first try you may need to create an account/login and link it with your expo project through the terminal using ```npx expo login```

Start the back-end server connection

```bash
cd roamio-server
npm start
```

## Demo

[Demo video](https://drive.google.com/file/d/1tP9ajjob-h9KeB7Er90XZe5XIwdlVUOa/view?usp=drive_link)
