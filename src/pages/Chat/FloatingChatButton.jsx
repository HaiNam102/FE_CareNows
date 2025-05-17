import React, { useState, useEffect } from 'react';
import ChatWidget from './ChatWidget';
import { useChat } from '../../contexts/ChatContext';

// Custom Chat Icon SVG
const ChatBubbleIcon = ({ size = 56, color = '#00695C' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="24" height="14" rx="7" fill={color} />
    <polygon points="18,28 21,22 15,22" fill={color} />
  </svg>
);

// Custom Down Arrow Icon SVG
const DownArrowIcon = ({ size = 46, color = '#00695C' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="10,15 18,23 26,15" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FloatingChatButton = () => {
  const { isChatOpen, toggleChat, selectedCareTakerName, fetchChatRooms, userRole, userId, userName, isProfileChatActive } = useChat();
  const [pulseAnimation, setPulseAnimation] = useState(false);

  // Log user info when component mounts
  useEffect(() => {
    console.log("FloatingChatButton mounted with user info:", { userRole, userId, userName });
  }, []);

  // Add a pulse animation when a new caretaker is selected
  useEffect(() => {
    if (selectedCareTakerName) {
      setPulseAnimation(true);
      console.log("Selected caretaker name changed:", selectedCareTakerName);
      
      // Stop the animation after 5 seconds
      const timer = setTimeout(() => {
        setPulseAnimation(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [selectedCareTakerName]);

  const handleOpenChat = () => {
    console.log("Chat button clicked, fetching rooms for:", { userRole, userId });
    // Fetch chat rooms when the chat button is clicked
    fetchChatRooms();
    toggleChat();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Button */}
      <button
        onClick={handleOpenChat}
        className={`w-20 h-20 bg-[#E6FFFA] rounded-2xl shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-2xl active:scale-95 focus:outline-none ${
          pulseAnimation ? 'animate-pulse' : ''
        }`}
        style={{ boxShadow: '0 4px 16px 0 #B2DFDB' }}
        aria-label={userRole === 'CUSTOMER' ? "Open customer chat" : "Open caretaker chat"}
      >
        {!isChatOpen ? <ChatBubbleIcon /> : <DownArrowIcon />}
      </button>

      {/* Chat Widget */}
      {isChatOpen && (
        <div className="absolute bottom-24 right-0 transition-all duration-300 transform scale-100 origin-bottom-right">
          <ChatWidget />
        </div>
      )}
    </div>
  );
};

export default FloatingChatButton; 