import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import SockJS from 'sockjs-client';
import { Client, Stomp } from '@stomp/stompjs';

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

  // Log API URL when component mounts
  useEffect(() => {
    console.log("ChatProvider mounted with API_URL:", API_URL);
    
    // Check if the API is reachable
    const checkApiHealth = async () => {
      try {
        const response = await fetch(`${API_URL}/api/health`, { 
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          console.log("API is reachable");
        } else {
          console.warn(`API health check failed: ${response.status}`);
        }
      } catch (error) {
        console.error("API is not reachable:", error);
      }
    };
    
    // Check if the chat rooms API is working
    const checkChatRoomsApi = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn("No token available for chat rooms API check");
          return;
        }
        
        console.log("Checking chat rooms API...");
        const response = await fetch(`${API_URL}/api/chat/rooms`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Chat rooms API check successful:", data);
        } else {
          console.warn(`Chat rooms API check failed: ${response.status}`);
          const errorText = await response.text();
          console.error("Error response:", errorText);
        }
      } catch (error) {
        console.error("Error checking chat rooms API:", error);
      }
    };
    
    checkApiHealth();
    checkChatRoomsApi();
  }, []);

  // Get user info from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        console.log("Raw token from localStorage:", token);
        const decoded = jwtDecode(token);
        console.log("Token decoded (full object):", decoded);
        
        // Extract user information from token
        const userId = decoded.userId;  // This should be the customer_id or care_taker_id
        const userName = decoded.userName || decoded.name;
        const userRole = decoded.role || 'CUSTOMER'; // Extract role from token or default to CUSTOMER
        
        // Extract username for API calls - try multiple possible fields
        let username = null;
        
        // Check all possible locations for username
        if (decoded.sub) {
          username = decoded.sub;
          console.log("Found username in 'sub':", username);
        } else if (decoded.username) {
          username = decoded.username;
          console.log("Found username in 'username':", username);
        } else if (decoded.email) {
          username = decoded.email;
          console.log("Found username in 'email':", username);
        } else if (decoded.preferred_username) {
          username = decoded.preferred_username;
          console.log("Found username in 'preferred_username':", username);
        } else if (decoded.name) {
          username = decoded.name;
          console.log("Using name as username:", username);
        }
        
        console.log(`User info from token: userId=${userId}, name=${userName}, username=${username}, role=${userRole}`);
        
        // Set user info based on token role
        setUserRole(userRole);
        setUserId(userId);
        setUserName(userName);
        setUsername(username);
        
        if (!username) {
          console.warn("Token does not contain username");
        }
        
        // Test API directly
        testApiEndpoints();
      } catch (error) {
        console.error('Error decoding token:', error);
        // Set fallback values for testing
        setUserRole('CUSTOMER');
        setUsername('');
        console.log("Using fallback values due to token error");
        
        // Test API directly even with error
        testApiEndpoints();
      }
    } else {
      console.warn('No token found in localStorage');
      // Set fallback values for testing
      setUserRole('CUSTOMER');
      setUsername('');
      console.log("Using fallback values due to missing token");
      
      // Test API directly even without token
      testApiEndpoints();
    }
  }, []);
  
  // Test API endpoints directly
  const testApiEndpoints = async () => {
    console.log("Testing API endpoints directly...");
    
    // Test URLs to try - will select based on role
    let testUrls = [];
    
    if (userRole === 'CARE_TAKER') {
      testUrls = [
        `${API_URL}/api/chat/rooms/caretaker/username/${username || ''}`,
        `${API_URL}/api/chat/rooms/caretaker/1`,
        `${API_URL}/api/chat/rooms`
      ];
    } else {
      // Default to CUSTOMER role
      testUrls = [
        `${API_URL}/api/chat/rooms/customer/username/${username || ''}`,
      `${API_URL}/api/chat/rooms/customer/1`,
      `${API_URL}/api/chat/rooms`
    ];
    }
    
    const token = localStorage.getItem('token') || '';
    
    // Try each test URL
    for (const url of testUrls) {
      try {
        console.log(`Testing API: ${url}`);
        
        const response = await fetch(url, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ SUCCESS for ${url}:`, data);
        } else {
          const text = await response.text();
          console.error(`❌ ERROR ${response.status} for ${url}:`, text);
        }
      } catch (error) {
        console.error(`❌ FETCH ERROR for ${url}:`, error);
      }
    }
  };

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
  
  // Update fetchChatRooms to handle both roles
  const fetchChatRooms = async () => {
    // Use a try/catch for the whole function to prevent any errors from stopping execution
    try {
      console.log("=== Starting fetchChatRooms ===");
      console.log("Role:", userRole);
      console.log("Username:", username);
      console.log("User ID:", userId);
      
      if (!username) {
        console.warn("Username is missing");
      }
      
      const effectiveUsername = username || '';
      
      // Ensure token is valid before making API calls
      let token;
      try {
        const isTokenOk = await ensureValidToken();
        if (!isTokenOk) {
          console.error("Invalid token, will try without validation");
        }
        token = localStorage.getItem('token');
        console.log("Token available:", !!token);
        if (token) {
          console.log("Token first 20 chars:", token.substring(0, 20) + "...");
        }
      } catch (e) {
        console.error("Token validation error:", e);
        token = localStorage.getItem('token');
      }
      
      if (!token) {
        console.error("No authentication token found");
      }
      
      // Log the username and role for debugging
      console.log(`Fetching chat rooms for ${userRole} with username ${effectiveUsername}`);
      
      // Try multiple endpoints based on user role
      let endpoints = [];
      
      if (userRole === 'CARE_TAKER') {
        endpoints = [
          `${API_URL}/api/chat/rooms/caretaker/username/${effectiveUsername}`,
          `${API_URL}/api/chat/rooms/caretaker/${userId || 1}`
        ];
      } else {
        // Default to CUSTOMER role
        endpoints = [
        `${API_URL}/api/chat/rooms/customer/username/${effectiveUsername}`,
        `${API_URL}/api/chat/rooms/customer/${userId || 1}`
      ];
      }
      
      let response = null;
      let data = null;
      let successEndpoint = null;
      
      // Try each endpoint
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          
          const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          };
          
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
          
          const resp = await fetch(endpoint, { headers });
          
          if (resp.ok) {
            response = resp;
            successEndpoint = endpoint;
            console.log(`✅ Successful response from ${endpoint}`);
            
            const respData = await resp.json();
            console.log("Response data:", respData);
            
            if (respData && respData.data) {
              data = respData;
              break;
            } else {
              console.warn("Response missing data property:", respData);
            }
          } else {
            const errorText = await resp.text();
            console.error(`❌ Endpoint ${endpoint} failed (${resp.status}):`, errorText);
          }
        } catch (err) {
          console.error(`❌ Fetch error for ${endpoint}:`, err);
        }
      }
      
      if (!data) {
        console.error("All API endpoints failed or returned invalid data");
        setChatRooms([]);
        return;
      }
      
      console.log(`Using successful endpoint: ${successEndpoint}`);
      console.log("API response for chat rooms:", data);
      
      if (data.data && Array.isArray(data.data)) {
        console.log(`Received ${data.data.length} chat rooms`);
        
        if (data.data.length > 0) {
          // DEBUG: Log all available fields in the first room
          const firstRoom = data.data[0];
          console.log("FULL ROOM FIELDS:", Object.keys(firstRoom));
          console.log("ROOM DATA SAMPLE:", firstRoom);
          
          // Map rooms with proper partner information based on role
          const mappedRooms = data.data.map(room => {
            // Determine the correct partner info based on user role
            let partnerName, partnerId;
            
            if (userRole === 'CARE_TAKER') {
              // For care takers, the partner is the customer
              // Try multiple possible fields for customer name
              partnerName = room.customerName || 
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
                           (room.customerId ? `Customer ${room.customerId}` : "Khách hàng");
              partnerId = room.customerId;
              
              console.log("Caretaker view - Customer info:", {
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
                name: room.name,
                customerId: room.customerId,
                usedName: partnerName
              });
            } else {
              // For customers, the partner is the care taker
              partnerName = room.partnerName || room.careTakerName || "Care Taker";
              partnerId = room.partnerId || room.careTakerId;
            }
            
            return {
              ...room,
              partnerName: partnerName,
              partnerId: partnerId
            };
          });
          
          console.log("Available chat rooms with proper partner info:", mappedRooms);
        
          // Store the mapped room data
          setChatRooms(mappedRooms);
        
          // If no room is selected yet, select the first one
          if (!selectedCareTaker) {
            const firstRoom = mappedRooms[0];
          const roomId = firstRoom.roomId;
            
            console.log(`Auto-selecting first room: ${roomId} with partner: ${firstRoom.partnerName}`);
          
          // Set the partner name immediately
          setSelectedCareTakerName(firstRoom.partnerName || "Unknown Partner");
          
            // Set selected room but don't connect automatically
            setSelectedCareTaker(roomId);
          }
        } else {
          console.warn("No chat rooms found for this user");
          setChatRooms([]);
        }
      } else {
        console.warn("No chat rooms found in response or invalid format:", data);
        setChatRooms([]);
      }
    } catch (error) {
      console.error('Unexpected error in fetchChatRooms:', error);
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