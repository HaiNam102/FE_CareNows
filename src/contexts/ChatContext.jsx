import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCareTaker, setSelectedCareTaker] = useState(null);
  const [selectedCareTakerName, setSelectedCareTakerName] = useState(null);
  const [messages, setMessages] = useState({});
  const [userRole, setUserRole] = useState(null);

  // Get user role from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
    }
  }, []);

  const openChat = (careTakerId, careTakerName) => {
    setSelectedCareTaker(careTakerId);
    setSelectedCareTakerName(careTakerName);
    setIsChatOpen(true);
    
    // Add welcome message if it's a new caretaker and no messages exist
    if (careTakerId && careTakerName && (!messages[careTakerId] || messages[careTakerId].length === 0)) {
      setTimeout(() => {
        setMessages(prev => ({
          ...prev,
          [careTakerId]: [
            {
              fromMe: false,
              text: userRole === 'CARE_TAKER' 
                ? `Xin chào! Tôi là ${careTakerName} đến từ CareNow. Tôi có thể giúp gì cho bạn?`
                : `Xin chào! Tôi là ${careTakerName} đến từ CareNow. Tôi có thể giúp gì cho bạn?`
            }
          ]
        }));
      }, 500);
    }
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const addMessage = (careTakerId, message) => {
    setMessages(prev => ({
      ...prev,
      [careTakerId]: [...(prev[careTakerId] || []), message]
    }));
  };

  return (
    <ChatContext.Provider value={{
      isChatOpen,
      selectedCareTaker,
      selectedCareTakerName,
      messages,
      userRole,
      openChat,
      closeChat,
      toggleChat,
      addMessage
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