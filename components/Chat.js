import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const Chat = ({ route, navigation }) => {

  const [messages, setMessages] = useState([]);
  const { name, backgroundColor } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: name });
    setMessages([
      {
        _id: 1,
        text: 'Hello developer!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'You\'re inside the chat',
        createdAt: new Date(),
        system: true,
      }
    ])
  }, []); //the empty dependency array means this will only be mounted once, ie when user enters their username

  const onSend = (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
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
          _id: 1
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