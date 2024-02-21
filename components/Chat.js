import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const Chat = ({ route, navigation, db, isConnected, storage }) => {

  const [messages, setMessages] = useState([]);
  const { name, backgroundColor, id } = route.params;

  //declared & initialized here to avoid it being accessible only within the scope of the if block. Reassigned on line 22
  let unsubMessages;
  useEffect(() => {
    navigation.setOptions({ title: name });
    // unregister current onSnapshot() listener to avoid registering multiple listeners when useEffect code is re-executed
    if (unsubMessages) unsubMessages();

    if (isConnected === true) {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      //the onSnapshot() function listens for updates inside the collection
      unsubMessages = onSnapshot(q, (docs) => {
        let newMessages = [];
        docs.forEach(doc => {
          newMessages.push({ id: doc.id, ...doc.data(), createdAt: new Date(doc.data().createdAt.toMillis()) })
        });
        //cacheing messages here while the useEffect() callback function is updating the messages array
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    //clean up code 
    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, [isConnected]);

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("message_cache", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  }

  const loadCachedMessages = async () => {
    const messageCache = await AsyncStorage.getItem("message_cache") || [];
    setMessages(JSON.parse(messageCache));
  }

  const onSend = (newMessages) => {
    //the message to be sent/added is the 1st item inside the newMessages array
    addDoc(collection(db, "messages"), newMessages[0]);
  }

  //customize the color of the sender & receiver speech bubbles. Then pass renderBubbles inside GiftedChat component
  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#FC7A1E"
        },
        left: {
          backgroundColor: "#fff"
        }
      }}
    />
  }

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  }

  const renderCustomActions = (props) => {
    return <CustomActions id={id} storage={storage} {...props} />
  }

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        onSend={messages => onSend(messages)}
        renderInputToolbar={renderInputToolbar}
        user={{
          _id: id,
          name
        }}
      />
      {/* this will prevent the name input field & color picker being obstructed by the Android keyboard */}
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Chat;