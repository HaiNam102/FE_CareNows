import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import avataradmin from '../../assets/images/Logo.png';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { jwtDecode } from 'jwt-decode';

const defaultCareTakerAvatar = 'https://randomuser.me/api/portraits/women/45.jpg';
const customerAvatar = 'https://randomuser.me/api/portraits/women/32.jpg';
const API_URL = 'http://localhost:8080';

const ChatWidget = () => {
  const { selectedCareTaker, selectedCareTakerName, messages: contextMessages, addMessage } = useChat();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [input, setInput] = useState('');
  const [displayUsers, setDisplayUsers] = useState([]);
  const [chatMessages, setChatMessages] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('Đang kết nối...');
  const stompClientRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [userRole, setUserRole] = useState(null);

  // Get user role from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
    }
  }, []);

  // Connect to WebSocket server
  useEffect(() => {
    if (selectedCareTaker) {
      connectToChat(selectedCareTaker);
    }
    
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [selectedCareTaker]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Update user list when messages change
  useEffect(() => {
    updateUserList();
  }, [chatMessages, selectedCareTaker, selectedCareTakerName, contextMessages]);

  const connectToChat = (caretakerId) => {
    setConnectionStatus('Đang kết nối...');
    
    try {
      const client = new Client({
        webSocketFactory: () => new SockJS(`${API_URL}/ws`),
        debug: function(str) {
          // console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: function(frame) {
          setConnectionStatus('Đã kết nối');
          
          // Create room ID from careTakerId
          const roomId = caretakerId;
          
          // Get chat history
          fetchChatHistory(roomId);
          
          // Subscribe to new messages
          client.subscribe(`/topic/room.${roomId}`, (response) => {
            const receivedMessage = JSON.parse(response.body);
            handleNewMessage(receivedMessage, roomId);
          });
        },
        onStompError: function(frame) {
          setConnectionStatus(`Lỗi kết nối: ${frame.headers.message}`);
        }
      });
      
      client.activate();
      stompClientRef.current = client;
    } catch (error) {
      setConnectionStatus(`Lỗi kết nối: ${error.message}`);
    }
  };

  const fetchChatHistory = async (roomId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/chat/room/${roomId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        updateChatMessages(roomId, data.data);
      } else if (contextMessages[roomId]) {
        // Fallback to context messages if API fails
        updateChatMessages(roomId, contextMessages[roomId].map(msg => ({
          roomId: roomId,
          senderId: msg.fromMe ? 'currentUser' : roomId,
          senderType: msg.fromMe ? 'CUSTOMER' : 'CARE_TAKER',
          senderName: msg.fromMe ? 'Bạn' : selectedCareTakerName || 'Bảo mẫu',
          content: msg.text,
          createdAt: new Date().toISOString()
        })));
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const updateChatMessages = (roomId, messages) => {
    setChatMessages(prev => ({
      ...prev,
      [roomId]: messages
    }));
  };

  const handleNewMessage = (message, roomId) => {
    setChatMessages(prev => {
      const updatedMessages = [...(prev[roomId] || []), message];
      return {
        ...prev,
        [roomId]: updatedMessages
      };
    });
    
    const contextMsg = {
      fromMe: message.senderType === (userRole === 'CARE_TAKER' ? 'CARE_TAKER' : 'CUSTOMER'),
      text: message.content
    };
    addMessage(roomId, contextMsg);
  };

  const updateUserList = () => {
    const roomIds = Object.keys(chatMessages);
    
    Object.keys(contextMessages).forEach(id => {
      if (!roomIds.includes(id)) {
        roomIds.push(id);
      }
    });
    
    const newUsers = roomIds.map(roomId => {
      const parsedId = parseInt(roomId, 10);
      
      if (parsedId === selectedCareTaker) {
        return {
          id: parsedId,
          name: selectedCareTakerName || 'Bảo mẫu',
          description: 'Bảo mẫu CareNow',
          avatar: defaultCareTakerAvatar,
          online: true,
          roomId: parsedId
        };
      } else {
        return {
          id: parsedId,
          name: `Khách hàng ${parsedId}`,
          description: 'Cuộc trò chuyện khác',
          avatar: customerAvatar,
          online: true,
          roomId: parsedId
        };
      }
    });
    
    if (selectedCareTaker && selectedCareTakerName && !newUsers.some(u => u.id === selectedCareTaker)) {
      const currentUser = {
        id: selectedCareTaker,
        name: selectedCareTakerName,
        description: 'Bảo mẫu CareNow',
        avatar: defaultCareTakerAvatar,
        online: true,
        roomId: selectedCareTaker
      };
      newUsers.unshift(currentUser);
    }
    
    setDisplayUsers(newUsers);
    
    if (selectedCareTaker && newUsers.some(user => user.id === selectedCareTaker)) {
      const currentUser = newUsers.find(user => user.id === selectedCareTaker);
      setSelectedUser(currentUser);
    } else if (newUsers.length > 0) {
      setSelectedUser(newUsers[0]);
    }
  };

  const handleSend = () => {
    if (!selectedUser || input.trim() === '') return;
    
    if (stompClientRef.current && stompClientRef.current.connected) {
      const messageToSend = {
        roomId: selectedUser.roomId,
        senderId: userRole === 'CARE_TAKER' ? selectedCareTaker : 'currentUser',
        senderType: userRole === 'CARE_TAKER' ? 'CARE_TAKER' : 'CUSTOMER',
        senderName: userRole === 'CARE_TAKER' ? selectedCareTakerName : 'Bạn',
        content: input.trim()
      };
      
      stompClientRef.current.publish({
        destination: "/app/chat.send",
        body: JSON.stringify(messageToSend)
      });
      
      handleNewMessage({
        ...messageToSend,
        createdAt: new Date().toISOString()
      }, selectedUser.roomId);
    } else {
      const newMsg = { 
        fromMe: true, 
        text: input.trim() 
      };
      addMessage(selectedUser.id, newMsg);
      
      setChatMessages(prev => {
        const message = {
          roomId: selectedUser.roomId,
          senderId: userRole === 'CARE_TAKER' ? selectedCareTaker : 'currentUser',
          senderType: userRole === 'CARE_TAKER' ? 'CARE_TAKER' : 'CUSTOMER',
          senderName: userRole === 'CARE_TAKER' ? selectedCareTakerName : 'Bạn',
          content: input.trim(),
          createdAt: new Date().toISOString()
        };
        
        const updatedMessages = [...(prev[selectedUser.roomId] || []), message];
        return {
          ...prev,
          [selectedUser.roomId]: updatedMessages
        };
      });
    }
    
    setInput('');
  };

  const filteredUsers = displayUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const currentChatMessages = selectedUser && chatMessages[selectedUser.roomId] 
    ? chatMessages[selectedUser.roomId] 
    : (selectedUser && contextMessages[selectedUser.id] 
      ? contextMessages[selectedUser.id].map(msg => ({
          roomId: selectedUser.roomId,
          senderId: msg.fromMe ? 'currentUser' : selectedUser.id,
          senderType: msg.fromMe ? (userRole === 'CARE_TAKER' ? 'CARE_TAKER' : 'CUSTOMER') : (userRole === 'CARE_TAKER' ? 'CUSTOMER' : 'CARE_TAKER'),
          senderName: msg.fromMe ? 'Bạn' : selectedUser.name,
          content: msg.text,
          createdAt: new Date().toISOString()
        }))
      : []);

  return (
    <div className="w-[700px] h-[500px] bg-white rounded-2xl shadow-2xl flex overflow-hidden">
      {/* User list */}
      <div className="w-1/3 bg-[#F8FFFE] border-r border-gray-100 flex flex-col">
        <div className="p-4 pb-2 font-bold text-xl">Tin nhắn</div>
        <div className="px-4 pb-2">
          <input
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A37D]"
            placeholder="Tìm kiếm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto mt-2">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div
                key={user.id}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#E6FFFA] transition-all ${selectedUser?.id === user.id ? 'bg-[#E6FFFA]' : ''}`}
                onClick={() => setSelectedUser(user)}
              >
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{user.name}</div>
                  <div className="text-xs text-gray-500 truncate">{user.description}</div>
                </div>
                {user.online && <span className="w-2 h-2 bg-emerald-500 rounded-full" />}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500">
              Không có cuộc trò chuyện nào
            </div>
          )}
        </div>
      </div>
      
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="font-semibold">{selectedUser.name}</div>
                <div className="text-xs text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" /> {connectionStatus}
                </div>
              </div>
            </div>
            <div 
              ref={chatContainerRef}
              className="flex-1 px-6 py-4 overflow-y-auto space-y-2 bg-white"
            >
              {currentChatMessages.length > 0 ? (
                currentChatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.senderType === (userRole === 'CARE_TAKER' ? 'CARE_TAKER' : 'CUSTOMER') ? 'justify-end' : 'justify-start'}`}>
                    {msg.senderType !== (userRole === 'CARE_TAKER' ? 'CARE_TAKER' : 'CUSTOMER') && (
                      <img src={selectedUser.avatar} alt="" className="w-8 h-8 rounded-full mr-2 self-end" />
                    )}
                    <div className={`px-4 py-2 rounded-2xl text-sm max-w-[60%] ${msg.senderType === (userRole === 'CARE_TAKER' ? 'CARE_TAKER' : 'CUSTOMER') ? 'bg-emerald-400 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                      {msg.content}
                      <div className="text-xs opacity-70 mt-1">
                        {msg.senderName} • {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                    {msg.senderType === (userRole === 'CARE_TAKER' ? 'CARE_TAKER' : 'CUSTOMER') && (
                      <img src={userRole === 'CARE_TAKER' ? defaultCareTakerAvatar : customerAvatar} alt="me" className="w-8 h-8 rounded-full ml-2 self-end" />
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
                </div>
              )}
            </div>
            <form
              className="flex items-center gap-2 px-6 py-4 border-t border-gray-100 bg-white"
              onSubmit={e => { e.preventDefault(); handleSend(); }}
            >
              <input
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A37D]"
                placeholder="Nhắn tin"
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="bg-emerald-400 hover:bg-emerald-500 text-white rounded-full p-3 transition-colors"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M2 21l21-9-21-9v7l15 2-15 2v7z" fill="currentColor"/></svg>
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
            <img src={avataradmin} alt="CareNow" className="w-24 h-24 mb-4" />
            <p className="text-center">Chọn một cuộc trò chuyện hoặc bắt đầu cuộc trò chuyện mới</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWidget; 