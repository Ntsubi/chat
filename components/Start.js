import { useState } from 'react';
import { getAuth, signInAnonymously } from "firebase/auth";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ImageBackground, KeyboardAvoidingView, Platform, Alert } from 'react-native';

const Start = ({ navigation }) => {
  const auth = getAuth(); //initializing Firebase Authentication handler
  //these states will update the UI to display the user's name and chosen bgColor
  const [name, setName] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');

  const signInUser = () => {
    signInAnonymously(auth)
      .then(result => {
        navigation.navigate('Chat', { name, backgroundColor, id: result.user.uid });
        Alert.alert('Signed in successfully');
      })
      .catch((error) => {
        Alert.alert('Unable to sign in. Try again later');
      })
  }

  const handleColorChange = (color) => {
    setBackgroundColor(color);
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/background_image.png')} resizeMode='cover' style={styles.image} >
        {/* Title of the app */}
        <Text style={styles.title}>Chat</Text>
        {/* This box is the container for name input and color pallete */}
        <View style={styles.box}>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder='Your name'
          />
          <Text style={styles.bgText}>Choose Background Color</Text>
          <View style={styles.colorContainer}>
            <TouchableOpacity
              style={[styles.colorPallete, { backgroundColor: '#090C08' }]}
              onPress={() => handleColorChange('#090C08')}
            />
            <TouchableOpacity
              style={[styles.colorPallete, { backgroundColor: '#474056' }]}
              onPress={() => handleColorChange('#474056')}
            />
            <TouchableOpacity
              style={[styles.colorPallete, { backgroundColor: '#8A95A5' }]}
              onPress={() => handleColorChange('#8A95A5')}
            />
            <TouchableOpacity
              style={[styles.colorPallete, { backgroundColor: '#B9C6AE' }]}
              onPress={() => handleColorChange('#B9C6AE')}
            />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => signInUser()}
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      {/* this prevents the name & keyboard being obstructed by iOS keyboard. note: behavior for iOS ALWAYS set to padding */}
      {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    width: "88%",
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 50
  },
  button: {
    backgroundColor: '#757083',
    padding: 15,
    width: '88%',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  title: {
    bottom: 150,
    fontSize: 45,
    fontWeight: '600',
    color: '#fff',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  box: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: '44%',
    width: '88%'
  },
  bgText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 100
  },
  colorContainer: {
    flexDirection: 'row' //since default flex direction is column, set to row so child elements (ie colorPallete) appear side by side 
  },
  colorPallete: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 10
  }
});

export default Start;
