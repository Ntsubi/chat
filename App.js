import { StyleSheet } from 'react-native';
import Start from './components/Start';
import Chat from './components/Chat';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'; //refer to comments from line 25
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'; //refer to comments from line 25

const Stack = createNativeStackNavigator(); //this method returns an object containing 2 components, ie Navigator & Screen 

const firebaseConfig = {
  apiKey: "AIzaSyCAq23_keKI5aiZh7DGfDZV9ANDpUniQao",
  authDomain: "chatapp-2c05f.firebaseapp.com",
  projectId: "chatapp-2c05f",
  storageBucket: "chatapp-2c05f.appspot.com",
  messagingSenderId: "812291137475",
  appId: "1:812291137475:web:4ea2a24db2bdecbf33e776"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

/* Line 31 - 33 is code suggested in a warning inside the terminal:
You are initializing Firebase Auth for React Native without providing
AsyncStorage. Auth state will default to memory persistence and will not
persist between sessions. In order to persist auth state, install the package
"@react-native-async-storage/async-storage" and provide it to
initializeAuth: */

initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);

const App = () => {
  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator
        initialRouteName='Start'
      >
        <Stack.Screen
          name='Start'
          component={Start}
        />
        <Stack.Screen
          name='Chat'
        >
          {props => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;