import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import socket from '../socket.js';
import Message from './Message.js';

const Chat = ({ user, onLogout }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    fetchChats();
    fetchUsers();

    // Socket event listeners
    socket.on('receive_message', (message) => {
      if (selectedChat && message.chat === selectedChat._id) {
        setMessages(prev => [...prev, message]);
        markMessageAsSeen(message._id);
      }
      updateChatLastMessage(message);
    });

    socket.on('message_delivered', (messageId) => {
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, status: 'delivered' } : msg
      ));
    });

    socket.on('message_seen', ({ messageId, seenBy }) => {
      if (seenBy === user._id) return;
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, status: 'seen' } : msg
      ));
    });

    socket.on('user_typing', ({ userId, isTyping }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    });

    socket.on('user_online', (userId) => {
      setOnlineUsers(prev => new Set(prev).add(userId));
      updateUserOnlineStatus(userId, true);
    });

    socket.on('user_offline', (userId) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      updateUserOnlineStatus(userId, false);
    });

    return () => {
      socket.off('receive_message');
      socket.off('message_delivered');
      socket.off('message_seen');
      socket.off('user_typing');
      socket.off('user_online');
      socket.off('user_offline');
    };
  }, [selectedChat, user._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get('/api/users/chats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setChats(response.data.chats);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(`/api/users/chats/${chatId}/messages`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const selectChat = (chat) => {
    setSelectedChat(chat);
    socket.emit('join_chat', chat._id);
    fetchMessages(chat._id);
  };

  const createChat = async (userId) => {
    try {
      const response = await axios.post('/api/users/chats', {
        participantId: userId,
        isGroupChat: false
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      const newChat = response.data.chat;
      setChats(prev => [newChat, ...prev]);
      setSelectedChat(newChat);
      socket.emit('join_chat', newChat._id);
      setMessages([]);
      setShowUserList(false);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const messageData = {
      chatId: selectedChat._id,
      content: newMessage.trim(),
      messageType: 'text'
    };

    socket.emit('send_message', messageData);
    setNewMessage('');
    stopTyping();
  };

  const markMessageAsSeen = (messageId) => {
    socket.emit('mark_seen', {
      chatId: selectedChat._id,
      messageId
    });
  };

  const updateChatLastMessage = (message) => {
    setChats(prev => prev.map(chat => 
      chat._id === message.chat 
        ? { ...chat, lastMessage: message, updatedAt: new Date() }
        : chat
    ));
  };

  const updateUserOnlineStatus = (userId, isOnline) => {
    setUsers(prev => prev.map(u => 
      u._id === userId ? { ...u, isOnline } : u
    ));
    setChats(prev => prev.map(chat => ({
      ...chat,
      participants: chat.participants.map(p => 
        p._id === userId ? { ...p, isOnline } : p
      )
    })));
  };

  const handleTyping = () => {
    if (!typingTimeoutRef.current) {
      socket.emit('typing', { chatId: selectedChat._id });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(stopTyping, 1000);
  };

  const stopTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
      socket.emit('stop_typing', { chatId: selectedChat._id });
    }
  };

  const getChatName = (chat) => {
    if (chat.isGroupChat) {
      return chat.name;
    }
    const otherParticipant = chat.participants.find(p => p._id !== user._id);
    return otherParticipant?.username || 'Unknown';
  };

  const getTypingUsers = () => {
    if (!selectedChat) return [];
    return Array.from(typingUsers).filter(userId => {
      return selectedChat.participants.some(p => p._id === userId);
    });
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Chat Application</h2>
        <div>
          <span style={{ marginRight: '15px' }}>Welcome, {user.username}</span>
          <button className="btn btn-primary" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-sidebar">
          <div style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              onClick={() => setShowUserList(!showUserList)}
            >
              New Chat
            </button>
            
            {showUserList && (
              <div style={{ marginTop: '10px' }}>
                {users.map(u => (
                  <div 
                    key={u._id} 
                    style={{ 
                      padding: '8px', 
                      cursor: 'pointer', 
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    onClick={() => createChat(u._id)}
                    onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                    onMouseLeave={(e) => e.target.style.background = 'none'}
                  >
                    <span>{u.username}</span>
                    {u.isOnline ? (
                      <span className="online-indicator"></span>
                    ) : (
                      <span className="offline-indicator"></span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {chats.map(chat => (
            <div
              key={chat._id}
              style={{
                padding: '15px',
                borderBottom: '1px solid #ddd',
                cursor: 'pointer',
                background: selectedChat?._id === chat._id ? '#f8f9fa' : 'white'
              }}
              onClick={() => selectChat(chat)}
            >
              <div style={{ fontWeight: 'bold' }}>{getChatName(chat)}</div>
              {chat.lastMessage && (
                <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '5px' }}>
                  {chat.lastMessage.content.substring(0, 30)}...
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="chat-main">
          {selectedChat ? (
            <>
              <div className="chat-header">
                <h3>{getChatName(selectedChat)}</h3>
              </div>

              <div className="chat-messages">
                {messages.map(message => (
                  <Message
                    key={message._id}
                    message={message}
                    isOwn={message.sender._id === user._id}
                  />
                ))}
                
                {getTypingUsers().length > 0 && (
                  <div className="typing-indicator">
                    {getTypingUsers().map(userId => {
                      const typingUser = users.find(u => u._id === userId);
                      return typingUser?.username;
                    }).join(', ')} {getTypingUsers().length === 1 ? 'is' : 'are'} typing...
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className="chat-input">
                <input
                  type="text"
                  className="form-control"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  placeholder="Type a message..."
                />
                <button type="submit" className="btn btn-primary">Send</button>
              </form>
            </>
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              color: '#6c757d' 
            }}>
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
