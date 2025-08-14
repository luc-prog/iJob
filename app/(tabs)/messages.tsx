import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ListRenderItem
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp, } from '@react-navigation/stack';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';

// Définissez les types pour vos paramètres de navigation
type RootStackParamList = {
  Chat: {
    contact: {
      _id: string;
      name: string;
      avatar: string;
      isOnline: boolean;
    };
  };
  // Ajoutez d'autres écrans ici si nécessaire
};

type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;
type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

interface Message {
  _id: string;
  sender: string;
  content: string;
  type: 'text' | 'image';
  status: 'sent' | 'delivered' | 'read';
  createdAt: Date;
}

const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavigationProp>();
  
  // Données du contact avec valeur par défaut si non fourni
  const contact = route.params?.contact || {
    _id: 'default',
    name: 'Contact inconnu',
    avatar: 'https://i.pravatar.cc/150?img=3',
    isOnline: false
  };

  const currentUser = {
    _id: 'user1',
    name: 'Moi',
    avatar: 'https://i.pravatar.cc/150?img=5'
  };

  // États locaux
  const [messages, setMessages] = useState<Message[]>([
    {
      _id: '1',
      sender: contact._id,
      content: 'Bonjour, comment allez-vous ?',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      _id: '2',
      sender: currentUser._id,
      content: 'Je vais bien merci ! Et vous ?',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 1800000)
    },
    {
      _id: '3',
      sender: contact._id,
      content: 'https://via.placeholder.com/300',
      type: 'image',
      status: 'read',
      createdAt: new Date(Date.now() - 900000)
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList<Message>>(null);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      _id: Date.now().toString(),
      sender: currentUser._id,
      content: newMessage,
      type: 'text',
      status: 'sent',
      createdAt: new Date()
    };

    setMessages([...messages, message]);
    setNewMessage('');
    scrollToBottom();
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const renderMessage: ListRenderItem<Message> = ({ item }) => {
    const isCurrentUser = item.sender === currentUser._id;

    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        {item.type === 'text' ? (
          <Text style={styles.messageText}>{item.content}</Text>
        ) : (
          <Image source={{ uri: item.content }} style={styles.messageImage} />
        )}
        
        <View style={styles.messageFooter}>
          <Text style={styles.messageTime}>
            {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {isCurrentUser && (
            <Ionicons
              name={item.status === 'read' ? 'checkmark-done' : 'checkmark'}
              size={16}
              color={item.status === 'read' ? '#4CAF50' : '#999'}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Image source={{ uri: contact.avatar }} style={styles.avatar} />
        
        <View style={styles.headerInfo}>
          <Text style={styles.contactName}>{contact.name}</Text>
          <Text style={styles.status}>
            {contact.isOnline ? 'En ligne' : 'Hors ligne'}
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="videocam" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TouchableOpacity style={styles.attachmentButton}>
          <Ionicons name="image" size={24} color="#4a90e2" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Écrire un message..."
          multiline
        />
        
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#4a90e2'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10
  },
  headerInfo: {
    flex: 1
  },
  contactName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white'
  },
  status: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)'
  },
  headerActions: {
    flexDirection: 'row'
  },
  actionButton: {
    marginLeft: 15
  },
  messagesList: {
    padding: 10
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4a90e2',
    borderBottomRightRadius: 0
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5ea',
    borderBottomLeftRadius: 0
  },
  messageText: {
    color: 'white',
    fontSize: 16
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginVertical: 5
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 5
  },
  messageTime: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginRight: 5
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginHorizontal: 5,
    fontSize: 16
  },
  attachmentButton: {
    padding: 8
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ChatScreen;