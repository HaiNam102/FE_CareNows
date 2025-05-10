import React, { useState } from 'react';
import ChatWidget from './ChatWidget';

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
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="w-20 h-20 bg-[#E6FFFA] rounded-2xl shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-2xl active:scale-95 focus:outline-none"
        style={{ boxShadow: '0 4px 16px 0 #B2DFDB' }}
        aria-label="Open chat"
      >
        {!isChatOpen ? <ChatBubbleIcon /> : <DownArrowIcon />}
      </button>

      {/* Chat Widget */}
      {isChatOpen && (
        <div className="absolute bottom-24 right-0 animate-fade-in">
          <ChatWidget />
        </div>
      )}
    </div>
  );
};

export default FloatingChatButton; 