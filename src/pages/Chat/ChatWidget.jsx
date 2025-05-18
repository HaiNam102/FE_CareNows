import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import avataradmin from '../../assets/images/Logo.png';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const API_URL = 'http://localhost:8080';
const defaultCareTakerAvatar = 'https://randomuser.me/api/portraits/women/45.jpg';
const customerAvatar = 'https://randomuser.me/api/portraits/women/32.jpg';

const ChatWidget = () => {
  const { 
    selectedCareTaker, 
    selectedCareTakerName,
    setSelectedCareTakerName,
    messages,
    userId,
    userName,
    userRole,
    connectionStatus,
    setConnectionStatus,
    chatContainerRef,
    sendMessage,
    chatRooms,
    fetchChatRooms,
    stompClientRef,
    setSelectedCareTaker,
    setMessages,
    connectToChat,
    fetchChatHistory
  } = useChat();
  
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [input, setInput] = useState('');
  const [displayUsers, setDisplayUsers] = useState([]);

  // Add a ref to track the current room ID
  const currentRoomIdRef = useRef(null);

  // Fetch chat rooms when component mounts
  useEffect(() => {
    if (userId) {
      console.log("Fetching chat rooms on mount");
      fetchChatRooms();
    }
  }, [userId]);
  
  // Update user list when chatRooms changes
  useEffect(() => {
    console.log("chatRooms changed:", chatRooms);
    if (chatRooms && chatRooms.length > 0) {
      updateUserList();
      console.log(`Available chat rooms: ${chatRooms.length}`, chatRooms);
    } else {
      console.warn("No chat rooms available to display");
      // Clear the user list if there are no rooms
      setDisplayUsers([]);
    }
  }, [chatRooms, selectedCareTaker]);
  
  // Update selectedUser when selectedCareTaker changes
  useEffect(() => {
    if (selectedCareTaker && displayUsers.length > 0) {
      const user = displayUsers.find(user => user.roomId === selectedCareTaker);
      if (user) {
        setSelectedUser(user);
        
        // When selectedCareTaker changes, fetch messages and connect to the room
        if (currentRoomIdRef.current !== selectedCareTaker) {
          currentRoomIdRef.current = selectedCareTaker;
          connectToChat(selectedCareTaker);
        }
      }
    }
  }, [selectedCareTaker, displayUsers]);

  // Update effect to log user info when it changes
  useEffect(() => {
    if (userId && userRole) {
      console.log(`User info: ID=${userId}, Role=${userRole}, Name=${userName || 'Unknown'}`);
    }
  }, [userId, userRole, userName]);

  // Add visibility change event to refresh messages when tab becomes visible
  useEffect(() => {
    // Function to handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && selectedCareTaker) {
        console.log("Page became visible, refreshing messages");
        fetchChatRooms();
      }
    };

    // Add event listener for visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Clean up
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selectedCareTaker, fetchChatRooms]);

  // Add a periodic connection check to ensure WebSocket is connected
  useEffect(() => {
    // Function to check connection status periodically
    const connectionCheckInterval = setInterval(() => {
      if (selectedCareTaker && stompClientRef.current) {
        // Check if WebSocket is connected
        if (!stompClientRef.current.connected) {
          console.log("WebSocket disconnected, attempting to reconnect");
          setConnectionStatus('Reconnecting...');
          connectToChat(selectedCareTaker);
        }
      }
    }, 30000); // Every 30 seconds

    // Clean up
    return () => {
      clearInterval(connectionCheckInterval);
    };
  }, [selectedCareTaker, connectToChat]);

  // Refresh messages when switching rooms
  useEffect(() => {
    if (selectedUser && selectedUser.roomId) {
      // Delay to allow UI to update before focusing the chat
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 300);
    }
  }, [messages, selectedUser]);

  // Update effect to refresh the user list when messages change for room names
  useEffect(() => {
    if (chatRooms && chatRooms.length > 0) {
      updateUserList();
    }
  }, [chatRooms, messages]);

  // Add a special effect to update header name from messages
  useEffect(() => {
    if (selectedUser && messages[selectedUser.roomId]?.length > 0) {
      // Find the most recent message from the customer
      const customerMessages = messages[selectedUser.roomId].filter(
        msg => msg.senderType === 'CUSTOMER' && msg.senderName && msg.senderName !== 'Khách hàng'
      );
      
      if (customerMessages.length > 0) {
        // Get the sender name from the most recent customer message
        const latestName = customerMessages[customerMessages.length - 1].senderName;
        
        if (latestName && latestName !== 'Khách hàng' && selectedUser.name === 'Khách hàng') {
          console.log(`Updating header name from message: ${latestName}`);
          
          // Update the selected user with the real name
          setSelectedUser({
            ...selectedUser,
            name: latestName
          });
          
          // Also update in display users list
          setDisplayUsers(prevUsers => 
            prevUsers.map(user => 
              user.roomId === selectedUser.roomId 
                ? { ...user, name: latestName } 
                : user
            )
          );
        }
      }
    }
  }, [selectedUser, messages]);

  useEffect(() => {
    // For each room, if we don't have messages yet, fetch them
    chatRooms.forEach(room => {
      if (!messages[room.roomId]) {
        fetchChatHistory(room.roomId);
      }
    });
  }, [chatRooms]);

  useEffect(() => {
    if (!selectedUser || !selectedUser.roomId) return;

    const interval = setInterval(() => {
      fetchChatHistory(selectedUser.roomId);
    }, 1000);

    // Clean up on unmount or when selectedUser changes
    return () => clearInterval(interval);
  }, [selectedUser, fetchChatHistory]);

  const handleUserSelect = (user) => {
    if (!user || !user.roomId) return;
    
    // Track which room we're connecting to
    const roomId = Number(user.roomId);
    console.log(`Switching to room ${roomId}`, user);
    
    // Update UI state
    setSelectedUser(user);
    setSelectedCareTakerName(user.name);
    
    // Set selected room in context - this will trigger the WebSocket connection
    setSelectedCareTaker(roomId);
  };

  const updateUserList = () => {
    console.log("Starting updateUserList with chatRooms:", chatRooms);
    
    // Filter out duplicate roomIds
    const uniqueRooms = chatRooms.filter((room, index, self) => 
      index === self.findIndex((r) => r.roomId === room.roomId)
    );
    
    console.log("Updating user list with unique rooms:", uniqueRooms);
    
    let users = uniqueRooms.map(room => {
      if (!room.roomId) {
        console.warn("Room without roomId:", room);
        return null;
      }
      
      // Create user entry for each chat partner
      const roomId = Number(room.roomId);
      
      // Find the latest message for this room
      const latestMsgArr = messages[roomId];
      const latestMsg = latestMsgArr && latestMsgArr.length > 0
        ? latestMsgArr[latestMsgArr.length - 1].content
        : room.lastMessage || 'Chưa có tin nhắn';
      
      // Check if we have messages with this room that might contain real names
      let customerName = null;
      if (userRole === 'CARE_TAKER' && messages[roomId]) {
        // Find the most recent message from customer with a real name
        const customerMessages = messages[roomId].filter(
          msg => msg.senderType === 'CUSTOMER' && msg.senderName && 
                msg.senderName !== 'Khách hàng' && msg.senderName !== 'Customer'
        );
        
        if (customerMessages.length > 0) {
          customerName = customerMessages[customerMessages.length - 1].senderName;
          console.log(`Found customer name in messages: ${customerName}`);
        }
      }
      
      // For caretakers, we're viewing customers and vice versa
      let partnerName;
      if (userRole === 'CARE_TAKER') {
        // First try from message history, then fall back to room data
        partnerName = customerName || 
                     room.customerName || 
                     room.consumerName || 
                     room.customerUserName ||
                     room.customerFullName ||
                     room.fullName ||
                     room.displayName ||
                     room.firstName ||
                     (room.firstName && room.lastName ? `${room.firstName} ${room.lastName}` : null) ||
                     room.userName ||
                     room.username ||
                     room.name ||
                     'Khách hàng';
      } else {
        // Customer nhìn thấy tên bảo mẫu
        partnerName = room.partnerName || 
                     room.careTakerName || 
                     'Bảo mẫu';
      }
      
      // Log all available fields for debugging
      console.log("ROOM FIELDS FOR CUSTOMER:", Object.keys(room));
      console.log("CUSTOMER DATA:", {
        customerName: room.customerName,
        consumerName: room.consumerName,
        customerUserName: room.customerUserName,
        username: room.username,
        name: room.name,
        userName: room.userName,
        firstName: room.firstName,
        lastName: room.lastName,
        fullName: room.fullName,
        displayName: room.displayName,
        foundInMessages: customerName
      });
      
      const user = {
        id: roomId,
        name: partnerName,  // Always use the partnerName from the API
        description: latestMsg,
        avatar: defaultCareTakerAvatar,
        online: true,
        roomId: roomId,
        // Store additional data for debugging
        customerId: room.customerId,
        partnerId: room.partnerId
      };
      
      console.log(`Mapped room ${roomId} to user with name: ${partnerName}`);
      return user;
    }).filter(Boolean);
    
    console.log(`Created ${users.length} user entries for chat rooms`);
    setDisplayUsers(users);
    
    // Auto-select room if needed
    if (selectedCareTaker && users.some(user => user.roomId === Number(selectedCareTaker))) {
      const currentUser = users.find(user => user.roomId === Number(selectedCareTaker));
      console.log(`Found existing selected room ${selectedCareTaker} in user list:`, currentUser);
      setSelectedUser(currentUser);
      setSelectedCareTakerName(currentUser.name);
    } else if (users.length > 0 && !selectedUser) {
      console.log(`No room selected, auto-selecting first room:`, users[0]);
      setSelectedUser(users[0]);
      setSelectedCareTakerName(users[0].name);
    } else if (users.length === 0) {
      console.warn("No users to display in the chat list");
    }
  };

  const handleSend = () => {
    if (!selectedUser || !selectedUser.roomId || input.trim() === '') return;
    
    const messageContent = input.trim();
    setInput(''); // Clear input immediately for better UX
    
    console.log(`Sending message to room ${selectedUser.roomId}: ${messageContent}`);
    
    try {
      // Use the sendMessage function from ChatContext
      sendMessage(selectedUser.roomId, messageContent);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Show error to user
      setConnectionStatus('Error sending message');
      
      // Still add message locally so user doesn't lose it
          const localMessage = {
            content: messageContent,
            senderType: 'CUSTOMER',
            senderName: 'Bạn',
            createdAt: new Date().toISOString(),
        pending: true,
        error: true
          };
          
          setMessages(prev => ({
            ...prev,
            [selectedUser.roomId]: [...(prev[selectedUser.roomId] || []), localMessage]
          }));
    }
  };

  const filteredUsers = displayUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const currentChatMessages = selectedUser 
    ? (messages[selectedUser.roomId] || []).map(msg => {
        // Determine if this message is from current user or the partner
        const isFromCurrentUser = msg.senderType === userRole;
        
        // Determine appropriate display name based on role and sender
        let displayName;
        if (isFromCurrentUser) {
          displayName = userName || "Bạn";
        } else if (userRole === 'CARE_TAKER' && msg.senderType === 'CUSTOMER') {
          // For caretakers viewing customer messages, use all available name fields
          displayName = msg.senderName || 
                       selectedUser?.name || 
                       msg.customerName || 
                       msg.firstName ||
                       msg.username ||
                       "Khách hàng";
        } else {
          // For customers viewing caretaker messages or any other case
          displayName = msg.senderName || selectedUser?.name || "Partner";
        }
        
        return {
        content: msg.content || msg.text || "",
        senderType: msg.senderType || "",
          isFromCurrentUser: isFromCurrentUser,
          senderName: displayName,
          createdAt: msg.createdAt || new Date().toISOString(),
          pending: msg.pending || false
        };
      })
    : [];

  useEffect(() => {
    // Only poll if user is logged in and chat is open
    if (!userId) return;

    const interval = setInterval(() => {
      fetchChatRooms();
    }, 1000);

    // Clean up on unmount
    return () => clearInterval(interval);
  }, [userId, fetchChatRooms]);

  return (
    <div className="w-[700px] h-[500px] bg-white rounded-2xl shadow-2xl flex overflow-hidden">
      {/* User list (caretakers) */}
      <div className="w-1/3 bg-[#F8FFFE] border-r border-gray-100 flex flex-col">
        <div className="p-4 pb-2 font-bold text-xl">Tin nhắn với bảo mẫu</div>
        <div className="px-4 pb-2">
          <input
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A37D]"
            placeholder="Tìm kiếm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        {/* Caretaker list */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length > 0 ? filteredUsers.map(user => (
            <div 
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#E6FFFA] transition-all ${
                selectedUser?.id === user.id ? 'bg-[#E6FFFA]' : ''
              }`}
            >
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{user.name}</div>
                <div className="text-xs text-gray-500 truncate">{user.description}</div>
              </div>
              {user.online && <span className="w-2 h-2 bg-emerald-500 rounded-full" />}
            </div>
          )) : (
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
            {/* Chat header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="font-semibold">{selectedUser.name}</div>
                <div className="text-xs text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" /> {connectionStatus}
                </div>
              </div>
            </div>
            
            {/* Chat messages */}
            <div ref={chatContainerRef} className="flex-1 px-6 py-4 overflow-y-auto space-y-2 bg-white">
              {currentChatMessages.length > 0 ? currentChatMessages.map((msg, idx) => {
                const messageDate = new Date(msg.createdAt);
                
                return (
                  <div key={idx} className={`flex ${msg.isFromCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    {!msg.isFromCurrentUser && (
                      <img 
                        src={selectedUser.avatar} 
                        alt="" 
                        className="w-8 h-8 rounded-full mr-2 self-end" 
                      />
                    )}
                    <div className={`px-4 py-2 rounded-2xl text-sm max-w-[60%] ${
                      msg.isFromCurrentUser 
                        ? 'bg-emerald-400 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}>
                      {msg.content}
                      <div className="text-xs opacity-70 mt-1">
                        {msg.isFromCurrentUser ? userName || "Bạn" : msg.senderName || selectedUser.name}
                        {' • '}
                        {messageDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                    {msg.isFromCurrentUser && (
                      <img 
                        src={userRole === 'CARE_TAKER' ? defaultCareTakerAvatar : customerAvatar} 
                        alt="me" 
                        className="w-8 h-8 rounded-full ml-2 self-end" 
                      />
                    )}
                  </div>
                );
              }) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
                </div>
              )}
            </div>
            
            {/* Chat input */}
            <form className="flex items-center gap-2 px-6 py-4 border-t border-gray-100 bg-white" onSubmit={e => { e.preventDefault(); handleSend(); }}>
              <input
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A37D]"
                placeholder="Nhắn tin"
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button type="submit" className="bg-emerald-400 hover:bg-emerald-500 text-white rounded-full p-3 transition-colors">
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