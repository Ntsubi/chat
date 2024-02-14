import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

const Chat = ({ route, navigation, db }) => {

  const [messages, setMessages] = useState([]);
  const { name, backgroundColor, id } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: name });
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    //the onSnapshot() function listens for updates inside the collection
    const unsubMessages = onSnapshot(q, (docs) => {
      let newMessages = [];
      docs.forEach(doc => {
        newMessages.push({ id: doc.id, ...doc.data(), createdAt: new Date(doc.data().createdAt.toMillis()) })
      });
      setMessages(newMessages);
    });

    return () => {
      if (unsubMessages) unsubMessages();
    }

  }, []); //the empty dependency array means this will only be mounted once, ie when user enters their username

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

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={messages => onSend(messages)}
        user={{
          _id: id,
          name
        }}
      />
      {/* this will prevent the name & color picker being obstructed by the Android keyboard */}
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