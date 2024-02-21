# Chat 📱

## Description

This is a simple mobile app built in React Native that provides users with a chat interface to exchange text and media in real time. 

<img src=assets/screenshot_1.png height="520" width="250"/>


## Features
- sending and receiving text messages
- sending and receiving images, or taking photos
- sharing your location 
- access to chat history, even when offline
- use of screen readers is enabled for the visually impaired

## Dependencies 
- React Native 
-- Gifted Chat, Navigation, AsyncStorage, Stack Navigator, Maps
- Expo
- Google Firebase Database & Storage

## Usage
Please follow these steps to get Chat up and running: 
- Clone the repository
- Install Node.js. To avoid any potential conflicts, it is recommended to run `nvm use 16.19.0` in the terminal
- Install Expo by running `npm install -g expo-cli` 
- Download the Expo Go app on your mobile and open 
- In the terminal run `npm start` or `expo start` from the project directory

The messages and images shared will need to be stored somewhere. For this purpose, Google's Firebase is the storage solution. Using a Google Account, sign in and set up a Firestore Database. 
Important pointers during set up: 
- create your database in production mode
- navigate to the "Rules" tab and edit `allow read, write: if false` to `allow read, write: if true` and click "Publish" to save the changes

