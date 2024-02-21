import { StyleSheet } from "react-native";

//import the screens
import Start from "./components/Start";
import Chat from "./components/Chat";

//import React Navigator
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  enableNetwork,
  disableNetwork,
} from "firebase/firestore";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

//Whenever a change in connection is detected, NetInfo returns a state object that represents the current network connectivity status
import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect } from "react";
import { Alert } from "react-native";
//initialize a handler to Firebase storage
import { getStorage } from "firebase/storage";

const Stack = createNativeStackNavigator(); //this method returns an object containing 2 components, ie Navigator & Screen

const App = () => {
  const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  const firebaseConfig = {
    apiKey: "AIzaSyCAq23_keKI5aiZh7DGfDZV9ANDpUniQao",
    authDomain: "chatapp-2c05f.firebaseapp.com",
    projectId: "chatapp-2c05f",
    storageBucket: "chatapp-2c05f.appspot.com",
    messagingSenderId: "812291137475",
    appId: "1:812291137475:web:4ea2a24db2bdecbf33e776",
  };

  let app;

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } else {
    app = getApp();
    auth = getAuth(app);
  }
  //initialize Cloud Firestone & get a reference to the service
  const db = getFirestore(app);
  const storage = getStorage(app);

  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              db={db}
              storage={storage}
              {...props}
              isConnected={connectionStatus.isConnected}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;