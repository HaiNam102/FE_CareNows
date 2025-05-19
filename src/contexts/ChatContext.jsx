import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import SockJS from 'sockjs-client';
import { Client, Stomp } from '@stomp/stompjs';
import api, { apiUtils } from '../services/api';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8080';
console.log("ChatContext initialized with API_URL:", API_URL);

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCareTaker, setSelectedCareTaker] = useState(null);
  const [selectedCareTakerName, setSelectedCareTakerName] = useState(null);
  const [messages, setMessages] = useState({});
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [username, setUsername] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [chatRooms, setChatRooms] = useState([]);
  const [isProfileChatActive, setIsProfileChatActive] = useState(false);
  const stompClientRef = useRef(null);
  const chatContainerRef = useRef(null);
  // Add a message tracking ref to prevent duplicates
  const processedMessagesRef = useRef(new Set());
  // Add a state for the button ref
  const [chatButtonRef, setChatButtonRef] = useState(null);

  // Get user info from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        
        // Extract user_id and role directly from JWT
        const userId = decoded.user_id;
        const userRole = decoded.role;
        
        // Set these values in state
        setUserId(userId);
        setUserRole(userRole);
        setUsername(decoded.username);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);
  
  // Fetch chat rooms when chat is opened
  useEffect(() => {
    if (userId && userRole && isChatOpen) {
      fetchChatRooms();
    }
  }, [userId, userRole, isChatOpen]);

  // Connect to WebSocket when a room is selected
  useEffect(() => {
    if (selectedCareTaker) {
      console.log("Room changed, reconnecting to", selectedCareTaker);
      connectToChat(selectedCareTaker);
    }
    
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
        stompClientRef.current = null;
      }
    };
  }, [selectedCareTaker]); // Re-connect whenever selectedCareTaker changes

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Check if token is valid
  const isTokenValid = (token) => {
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      
      // Check if token has expired
      if (decoded.exp) {
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
      }
      
      return true;
    } catch (error) {
      console.error("Error checking token validity:", error);
      return false;
    }
  };
  
  // Refresh token if needed before making API calls
  const ensureValidToken = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error("No token found");
      return false;
    }
    
    if (isTokenValid(token)) {
      return true;
    }
    
    console.warn("Token is expired or invalid, attempting to refresh...");
    
    try {
      // Try to refresh the token
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error("Failed to refresh token");
        return false;
      }
      
      const data = await response.json();
      
      if (data.data && data.data.jwt) {
        localStorage.setItem('token', data.data.jwt);
        console.log("Token refreshed successfully");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return false;
    }
  };
  
  // Update fetchChatRooms to use the partnerName directly from API
  const fetchChatRooms = async () => {
    try {
      if (!userId) {
        console.warn('User ID missing - cannot fetch rooms');
        return;
      }
      
      // Use the ID-based endpoints
      const endpoint = userRole === 'CUSTOMER' 
        ? `/chat/rooms/customer/customerId/${userId}`
        : `/chat/rooms/caretaker/caretakerId/${userId}`;
      
      const response = await api.get(endpoint);
      
      if (response.data && response.data.code === 1010 && Array.isArray(response.data.data)) {
        const rooms = response.data.data;
        
        if (rooms.length > 0) {
          // Just use the rooms directly - they already have partnerName
          setChatRooms(rooms);
          
          // Auto-select first room if none selected
          if (!selectedCareTaker && rooms[0]?.roomId) {
            setSelectedCareTakerName(rooms[0].partnerName);
            setSelectedCareTaker(rooms[0].roomId);
          }
        } else {
          setChatRooms([]);
        }
      } else {
        setChatRooms([]);
      }
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      setChatRooms([]);
    }
  };

  const openChat = (careTakerId, careTakerName) => {
    setSelectedCareTaker(careTakerId);
    setSelectedCareTakerName(careTakerName);
    setIsChatOpen(true);
    setIsProfileChatActive(false); // Reset profile chat status when opening chat
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const toggleChat = () => {
    console.log("=== Toggling chat ===");
    console.log("Current state:", isChatOpen ? "Open → Closing" : "Closed → Opening");
    console.log("Selected care taker/room ID:", selectedCareTaker);
    console.log("Selected care taker name:", selectedCareTakerName);
    console.log("Chat rooms count:", chatRooms?.length || 0);
    setIsChatOpen(!isChatOpen);
    setIsProfileChatActive(false); // Reset profile chat status when toggling chat
  };

  // Make sure we only subscribe once per room
  const connectToChat = (roomId) => {
    if (!roomId) {
      console.error("Cannot connect: Invalid roomId", roomId);
      return;
    }
    
    // Force number type for roomId
    roomId = Number(roomId);
    
    console.log(`Setting up WebSocket for room: ${roomId}`);
    
    // Disconnect any existing connection
    if (stompClientRef.current) {
      try {
        console.log("Closing existing WebSocket connection");
        stompClientRef.current.disconnect();
        stompClientRef.current = null;
      } catch (e) {
        console.error("Error disconnecting WebSocket:", e);
      }
    }
    
    try {
      // Connect using SockJS
      const socket = new SockJS(`${API_URL}/ws`);
      const client = Stomp.over(socket);
      
      // Optional: disable debug logs in production
      // client.debug = null;
      
      // Connect without headers
      client.connect({}, 
        // Success callback
        (frame) => {
          console.log("Connected:", frame);
          setConnectionStatus('Connected');
          
          // Subscribe to room topic and directly update messages state
          console.log(`Subscribing to /topic/room.${roomId}`);
          client.subscribe(`/topic/room.${roomId}`, (message) => {
            console.log("Received message:", message);
            try {
              const receivedMessage = JSON.parse(message.body);
              console.log("Parsed message:", receivedMessage);
              
              // Format date if needed
              if (receivedMessage.createdAt && Array.isArray(receivedMessage.createdAt)) {
                const [year, month, day, hour, minute, second] = receivedMessage.createdAt;
                receivedMessage.createdAt = new Date(year, month-1, day, hour, minute, second).toISOString();
              }
              
              // For caretakers, make sure customer names are preserved
              if (userRole === 'CARE_TAKER' && receivedMessage.senderType === 'CUSTOMER') {
                // Find the chat room to get customer name
                const room = chatRooms.find(room => Number(room.roomId) === Number(roomId));
                if (room) {
                  // Log all room data for debugging
                  console.log("WEBSOCKET - ROOM DATA FOR CUSTOMER NAME:", {
                    customerName: room.customerName,
                    consumerName: room.consumerName,
                    customerUserName: room.customerUserName,
                    customerFullName: room.customerFullName,
                    fullName: room.fullName,
                    displayName: room.displayName,
                    firstName: room.firstName,
                    lastName: room.lastName,
                    userName: room.userName,
                    username: room.username,
                    name: room.name
                  });
                  
                  // Trực tiếp sử dụng các trường chứa tên khách hàng từ API
                  receivedMessage.senderName = room.customerName || 
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
                                             receivedMessage.senderName || 
                                             "Khách hàng";
                  
                  // If the message contains a sender name not in our records, update our chatRooms data
                  if (receivedMessage.senderName && receivedMessage.senderName !== "Khách hàng") {
                    console.log(`Updating room with new customer name: ${receivedMessage.senderName}`);
                    
                    // Update the chatRooms array with the new name
                    setChatRooms(prevRooms => 
                      prevRooms.map(r => 
                        Number(r.roomId) === Number(roomId) 
                          ? { ...r, partnerName: receivedMessage.senderName } 
                          : r
                      )
                    );
                  }
                  
                  console.log(`Set customer name in received message: ${receivedMessage.senderName}`);
                }
              }
              
              // Generate a unique key for this message
              const messageKey = generateMessageKey(receivedMessage);
              
              // Only process if we haven't seen this exact message before
              if (!processedMessagesRef.current.has(messageKey)) {
                console.log(`Processing new message: ${messageKey}`);
                processedMessagesRef.current.add(messageKey);
                
                // Now we can safely add the message
                addMessage(roomId, receivedMessage);
              } else {
                console.log(`Skipping duplicate message: ${messageKey}`);
              }
            } catch (error) {
              console.error("Error processing message:", error);
            }
          });
          
          // Store client reference
      stompClientRef.current = client;
      
          // Fetch message history
          fetchChatHistory(roomId);
        },
        // Error callback
        (error) => {
          console.error("Connection failed:", error);
          setConnectionStatus(`Connection failed: ${error}`);
        }
      );
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
      setConnectionStatus(`Connection error: ${error.message}`);
    }
  };

  // Generate a unique key for message deduplication
  const generateMessageKey = (message) => {
    // Use combination of fields to make a unique identifier
    return `${message.id || ''}:${message.senderId || ''}:${message.content}:${message.senderType}:${message.createdAt || new Date().toISOString()}`;
  };
  
  // Completely rewrite the addMessage function with better handling
  const addMessage = (roomId, message) => {
    setMessages(prev => {
      const currentMessages = prev[roomId] || [];
      
      // Find the room to get proper partner name
      const room = chatRooms.find(r => Number(r.roomId) === Number(roomId));
      
      // Determine if message is from current user
      const isCurrentUser = message.senderType === userRole;
      
      let partnerName;
      if (userRole === 'CARE_TAKER' && !isCurrentUser) {
        // Caretaker nhận tin từ khách hàng - dùng trực tiếp các trường tên khách hàng
        partnerName = room?.customerName || 
                      room?.consumerName || 
                      room?.customerUserName ||
                      room?.customerFullName ||
                      room?.fullName ||
                      room?.displayName ||
                      room?.firstName ||
                      (room?.firstName && room?.lastName ? `${room.firstName} ${room.lastName}` : null) ||
                      room?.userName ||
                      room?.username ||
                      room?.name ||
                      message.senderName ||
                      "Khách hàng";
      } else {
        // Customer nhận tin từ caretaker hoặc các trường hợp khác
        partnerName = room?.partnerName || 
                      room?.careTakerName ||
                      message.senderName || 
                      "Bảo mẫu";
      }
      
      // Ensure message has proper sender name
      const messageWithName = {
        ...message,
        senderName: isCurrentUser
          ? userName || "Bạn"
          : partnerName
      };
      
      // First try to find and replace any pending message
      if (!message.pending) {
        const updatedMessages = [...currentMessages];
        const pendingIndex = updatedMessages.findIndex(msg => 
          msg.pending && 
          msg.content === message.content && 
          msg.senderType === message.senderType
        );
        
        if (pendingIndex >= 0) {
          console.log("Replacing pending message with confirmed message");
          updatedMessages[pendingIndex] = messageWithName;
          
          return {
            ...prev,
            [roomId]: updatedMessages
          };
        }
      }
      
      // If we didn't replace a pending message, just add the new one
      return {
        ...prev,
        [roomId]: [...currentMessages, messageWithName]
      };
    });
  };
  
  // Update sendMessage to include tracking of pending messages
  const sendMessage = (roomId, content) => {
    if (!content.trim()) {
      console.warn("Cannot send empty message");
      return;
    }
    
    if (!stompClientRef.current) {
      console.error("No STOMP client available");
      setConnectionStatus('Not connected');
      return;
    }
    
    // Create message object
    const chatMessage = {
      roomId: Number(roomId),
      senderId: Number(userId || 1),
      senderType: userRole === 'CARE_TAKER' ? 'CARE_TAKER' : 'CUSTOMER',
      content: content.trim(),
      senderName: userName || (userRole === 'CARE_TAKER' ? 'Care Taker' : 'Customer')
    };
    
    console.log("Sending message:", chatMessage);
    
    try {
      // Create a unique key for the pending message
      const pendingMessage = {
        content: content.trim(),
        senderType: userRole === 'CARE_TAKER' ? 'CARE_TAKER' : 'CUSTOMER',
        senderName: userName || "Bạn", 
        senderId: Number(userId || 1),
        createdAt: new Date().toISOString(),
        pending: true
      };
      
      // Add a temporary ID for tracking
      const pendingKey = `pending-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      pendingMessage.pendingId = pendingKey;
      
      // Add the pending message first for immediate feedback
      addMessage(roomId, pendingMessage);
      
      // Now send the actual message to server
      stompClientRef.current.send("/app/chat.send", {}, JSON.stringify(chatMessage));
    } catch (error) {
      console.error("Error sending message:", error);
      setConnectionStatus('Send failed');
    }
  };
  
  // Modify fetchChatHistory to use message tracking
  const fetchChatHistory = async (roomId) => {
    if (!roomId) {
      console.error("Cannot fetch chat history: Invalid roomId");
      return;
    }
    
    console.log(`Fetching chat history for room: ${roomId}`);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn("No token available for fetching chat history");
      }
      
      const headers = {
        'Accept': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Use the endpoint that exists in the backend
      const apiUrl = `${API_URL}/api/chat/room/${roomId}/messages`;
      console.log(`Fetching messages from: ${apiUrl}`);
      
      const response = await fetch(apiUrl, { headers });
      
      if (!response.ok) {
        console.error(`Failed to fetch messages: ${response.status}`);
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Message history response for room ${roomId}:`, data);
      
      if (data.data && Array.isArray(data.data)) {
        // Reset processed messages for this room
        processedMessagesRef.current = new Set();
        
        // Format createdAt for each message
        const formattedMessages = data.data.map(msg => {
          try {
          if (msg.createdAt && Array.isArray(msg.createdAt)) {
            const [year, month, day, hour, minute, second] = msg.createdAt;
            msg.createdAt = new Date(year, month-1, day, hour, minute, second).toISOString();
            } else if (msg.createdAt && typeof msg.createdAt === 'string') {
              const date = new Date(msg.createdAt);
              if (!isNaN(date)) {
                msg.createdAt = date.toISOString();
              }
            }
            
            // For CARE_TAKER role, update customer names if needed
            if (userRole === 'CARE_TAKER' && msg.senderType === 'CUSTOMER') {
              if (msg.senderName && msg.senderName !== "Khách hàng" && msg.senderName !== "Customer") {
                // Found a real customer name in message history
                console.log(`Found customer name in history: ${msg.senderName}`);
                
                // Update chatRooms with the real customer name
                setChatRooms(prevRooms => 
                  prevRooms.map(r => 
                    Number(r.roomId) === Number(roomId) 
                      ? { ...r, partnerName: msg.senderName } 
                      : r
                  )
                );
              }
            }
            
            // Track this message to avoid duplicates from WebSocket
            const messageKey = generateMessageKey(msg);
            processedMessagesRef.current.add(messageKey);
            
          } catch (e) {
            console.warn("Error formatting date for message:", e);
            msg.createdAt = new Date().toISOString();
          }
          return msg;
        });
        
        console.log(`Setting ${formattedMessages.length} messages for room ${roomId}`);
        
        // Replace all messages for this room
        setMessages(prev => ({
            ...prev,
            [roomId]: formattedMessages
        }));
      } else {
        console.warn("No message data found in response");
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  // Add diagnostic function to check WebSocket connection
  const diagnoseWebSocketConnection = () => {
    console.log("======= DIAGNOSING WEBSOCKET CONNECTION =======");
    
    // Check if client exists
    if (!stompClientRef.current) {
      console.error("❌ STOMP client does not exist!");
      return false;
    }
    
    // Check connection status
    console.log(`STOMP client connected: ${stompClientRef.current.connected}`);
    
    // Check STOMP client state
    if (stompClientRef.current.state) {
      console.log(`STOMP client state: ${stompClientRef.current.state}`);
    }
    
    // Check active subscriptions
    if (stompClientRef.current.subscriptions) {
      console.log("Active subscriptions:", Object.keys(stompClientRef.current.subscriptions));
    } else {
      console.warn("No subscription information available");
    }
    
    // Check if socket is available
    if (stompClientRef.current.webSocket) {
      console.log(`WebSocket ready state: ${stompClientRef.current.webSocket.readyState}`);
      console.log(`WebSocket URL: ${stompClientRef.current.webSocket.url}`);
    } else {
      console.warn("No WebSocket found in STOMP client");
    }
    
    console.log("==============================================");
    return stompClientRef.current.connected;
  };

  // Enhanced updatePartnerNameFromRoom to be more robust
  const updatePartnerNameFromRoom = (roomId) => {
    if (!roomId) return;
    
    // Convert to number for consistent comparison
    roomId = Number(roomId);
    
    // Find the room in chatRooms
    const currentRoom = chatRooms.find(room => Number(room.roomId) === roomId);
    
    if (currentRoom) {
      console.log("Found room data for partner name:", currentRoom);
      // Use the partnerName directly from the API response
      setSelectedCareTakerName(currentRoom.partnerName || "Unknown Partner");
      console.log(`Setting partner name to: ${currentRoom.partnerName}`);
    } else {
      console.warn(`Room ${roomId} not found in chatRooms, fetching rooms...`);
      fetchChatRooms().then(() => {
        // Find the room after fetching
        const updatedRoom = chatRooms.find(room => Number(room.roomId) === roomId);
        if (updatedRoom) {
          setSelectedCareTakerName(updatedRoom.partnerName || "Unknown Partner");
        }
      });
    }
  };

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      // Disconnect any WebSocket connection
      if (stompClientRef.current) {
        try {
          stompClientRef.current.disconnect();
          console.log("WebSocket disconnected on unmount");
        } catch (e) {
          console.error("Error disconnecting WebSocket on unmount:", e);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      fetchChatRooms();
    }, 1000);

    return () => clearInterval(interval);
  }, [userId, fetchChatRooms]);

  return (
    <ChatContext.Provider value={{
      isChatOpen,
      selectedCareTaker,
      selectedCareTakerName,
      setSelectedCareTakerName,
      messages,
      userRole,
      userId,
      userName,
      username,
      connectionStatus,
      setConnectionStatus,
      chatContainerRef,
      chatRooms,
      stompClientRef,
      isProfileChatActive,
      setIsProfileChatActive,
      openChat,
      closeChat,
      toggleChat,
      addMessage,
      sendMessage,
      fetchChatRooms,
      fetchChatHistory,
      connectToChat,
      setSelectedCareTaker,
      setMessages,
      chatButtonRef,
      setChatButtonRef
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext; 