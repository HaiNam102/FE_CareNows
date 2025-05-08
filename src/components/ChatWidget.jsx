import React, { useState } from 'react';

const mockUsers = [
  {
    id: 1,
    name: 'Caremess',
    description: 'Hỏi bất cứ điều gì',
    avatar: '/avatar-caremess.png',
    online: true,
  },
  {
    id: 2,
    name: 'Tố Uyên',
    description: 'Bạn: Dịch vụ rất tốt!',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    online: true,
  },
  {
    id: 3,
    name: 'Hải Trần',
    description: 'Baby kajima, St...',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    online: false,
  },
];

const mockMessages = {
  2: [
    { fromMe: false, text: 'Chào bạn, tôi đã nhận được đơn chăm sóc!' },
    { fromMe: false, text: 'Tôi sẽ đến trong 2 phút' },
    { fromMe: false, text: 'Hoàn thành ca chăm sóc, bệnh nhân đang nghỉ ngơi tốt' },
    { fromMe: true, text: 'Cảm ơn bạn nhé!' },
    { fromMe: true, text: 'Dịch vụ rất tốt, mình sẽ đặt lịch tiếp' },
  ],
  3: [
    { fromMe: false, text: 'Chào bạn, tôi đã nhận được đơn chăm sóc!' },
    { fromMe: false, text: 'Tôi sẽ đến trong 2 phút' },
    { fromMe: false, text: 'Hoàn thành ca chăm sóc, bệnh nhân đang nghỉ ngơi tốt' },
    { fromMe: true, text: 'Cảm ơn bạn nhé!' },
  ],
  1: [
    { fromMe: false, text: 'Xin chào! Bạn cần hỗ trợ gì?' },
  ],
};

const ChatWidget = () => {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(mockUsers[1]);
  const [messages, setMessages] = useState(mockMessages[selectedUser.id] || []);
  const [input, setInput] = useState('');

  // Khi chọn user khác
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setMessages(mockMessages[user.id] || []);
  };

  // Gửi tin nhắn
  const handleSend = () => {
    if (input.trim() === '') return;
    const newMsg = { fromMe: true, text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  // Lọc user theo search
  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-[700px] h-[500px] bg-white rounded-2xl shadow-2xl flex overflow-hidden">
      {/* Danh sách người dùng */}
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
          {filteredUsers.map(user => (
            <div
              key={user.id}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#E6FFFA] transition-all ${selectedUser.id === user.id ? 'bg-[#E6FFFA]' : ''}`}
              onClick={() => handleSelectUser(user)}
            >
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{user.name}</div>
                <div className="text-xs text-gray-500 truncate">{user.description}</div>
              </div>
              {user.online && <span className="w-2 h-2 bg-emerald-500 rounded-full" />}
            </div>
          ))}
        </div>
      </div>
      {/* Khung chat */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <div className="font-semibold">{selectedUser.name}</div>
            <div className="text-xs text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" /> Online
            </div>
          </div>
        </div>
        <div className="flex-1 px-6 py-4 overflow-y-auto space-y-2 bg-white">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
              {!msg.fromMe && (
                <img src={selectedUser.avatar} alt="" className="w-8 h-8 rounded-full mr-2 self-end" />
              )}
              <div className={`px-4 py-2 rounded-2xl text-sm max-w-[60%] ${msg.fromMe ? 'bg-emerald-400 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                {msg.text}
              </div>
              {msg.fromMe && (
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="me" className="w-8 h-8 rounded-full ml-2 self-end" />
              )}
            </div>
          ))}
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
      </div>
    </div>
  );
};

export default ChatWidget; 