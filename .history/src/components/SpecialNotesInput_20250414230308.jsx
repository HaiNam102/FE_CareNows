import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Plus, Search } from 'lucide-react';

const SpecialNotesInput = ({ value, onChange, placeholder }) => {
  // Nhóm ghi chú theo danh mục với nội dung đơn giản, dễ hiểu
  const noteCategories = [
    {
      category: "Thói quen ăn uống",
      notes: [
        "Ăn uống bình thường",
        "Khẩu phần ăn ít",
        "Cần người hỗ trợ khi ăn",
        "Không ăn được thức ăn cứng",
        "Dị ứng thực phẩm",
        "Cần theo chế độ ăn đặc biệt",
        "Ăn chậm"
      ]
    },
    {
      category: "Giấc ngủ",
      notes: [
        "Ngủ tốt",
        "Hay thức giấc ban đêm",
        "Khó ngủ, mất ngủ",
        "Có thói quen ngủ đặc biệt",
        "Ngủ nhiều vào ban ngày",
        "Cần ngủ với đèn sáng"
      ]
    },
    {
      category: "Vận động",
      notes: [
        "Đi lại bình thường",
        "Đi lại khó khăn, cần hỗ trợ",
        "Sử dụng xe lăn",
        "Cần gậy/khung tập đi",
        "Hay bị mệt khi vận động",
        "Cần tập vật lý trị liệu",
        "Hạn chế vận động"
      ]
    },
    {
      category: "Vệ sinh cá nhân",
      notes: [
        "Tự chăm sóc vệ sinh được",
        "Cần hỗ trợ khi tắm rửa",
        "Cần hỗ trợ khi đánh răng",
        "Cần giúp đỡ khi thay quần áo",
        "Sử dụng tã người lớn",
        "Cần giúp đỡ khi đi vệ sinh"
      ]
    },
    {
      category: "Dùng thuốc",
      notes: [
        "Tự uống thuốc được",
        "Cần nhắc nhở khi uống thuốc",
        "Cần theo dõi phản ứng thuốc",
        "Hay quên uống thuốc",
        "Cần nghiền nhỏ thuốc để uống",
        "Cần trợ giúp tiêm thuốc"
      ]
    },
    {
      category: "Tâm trạng và giao tiếp",
      notes: [
        "Tâm trạng vui vẻ",
        "Hay cáu gắt, bực bội",
        "Dễ buồn, hay khóc",
        "Khó khăn khi giao tiếp",
        "Hay lo lắng",
        "Thích được trò chuyện",
        "Thích được ở một mình"
      ]
    },
    {
      category: "Thói quen và sở thích",
      notes: [
        "Thích xem TV",
        "Thích nghe nhạc",
        "Thích đọc sách",
        "Thích đi dạo",
        "Có thói quen đặc biệt buổi sáng",
        "Có thói quen đặc biệt trước khi ngủ",
        "Thích ăn đồ ngọt"
      ]
    },
    {
      category: "Các lưu ý khác",
      notes: [
        "Da dễ bị tổn thương",
        "Hay bị lạnh",
        "Cần uống nhiều nước",
        "Khó nghe, cần nói to",
        "Cần kính để đọc/xem",
        "Hay quên thời gian",
        "Cần kiểm tra nhiệt độ nước tắm"
      ]
    }
  ];

  // Tạo danh sách phẳng để tìm kiếm
  const allSuggestions = [];
  noteCategories.forEach(category => {
    category.notes.forEach(note => {
      allSuggestions.push(note);
    });
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(noteCategories);
  const [activeTab, setActiveTab] = useState(0); // Index của tab đang active
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Khởi tạo giá trị từ prop
  useEffect(() => {
    if (value) {
      // Tách các ghi chú đã có thành tags
      const notes = value.split('. ').filter(note => note.trim() !== '');
      setSelectedTags(notes);
      setInputValue('');
    }
  }, []);

  // Xử lý click bên ngoài dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lọc danh mục khi tìm kiếm
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCategories(noteCategories);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = noteCategories.map(category => {
      return {
        category: category.category,
        notes: category.notes.filter(note => 
          note.toLowerCase().includes(term)
        )
      };
    }).filter(category => category.notes.length > 0);

    setFilteredCategories(filtered);
    
    // Nếu có kết quả tìm kiếm, chuyển sang tab đầu tiên có kết quả
    if (filtered.length > 0) {
      setActiveTab(0);
    }
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const addSuggestion = (suggestion) => {
    if (!selectedTags.includes(suggestion)) {
      const newTags = [...selectedTags, suggestion];
      setSelectedTags(newTags);
      
      // Cập nhật giá trị cho component cha
      const combinedValue = newTags.join('. ');
      onChange(combinedValue);
    }
    
    setSearchTerm('');
    setInputValue('');
  };

  const removeTag = (tagToRemove) => {
    const newTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(newTags);
    
    // Cập nhật giá trị cho component cha
    const combinedValue = newTags.join('. ');
    onChange(combinedValue);
  };

  const handleKeyDown = (e) => {
    // Cho phép thêm ghi chú tùy chỉnh khi nhấn Enter
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!selectedTags.includes(inputValue.trim())) {
        const newTags = [...selectedTags, inputValue.trim()];
        setSelectedTags(newTags);
        onChange(newTags.join('. '));
        setInputValue('');
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Hiển thị các tag đã chọn */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag, index) => (
          <div 
            key={index} 
            className="bg-[#e6f7f2] text-[#00A37D] px-3 py-1 rounded-full flex items-center gap-1 text-sm"
          >
            <span>{tag}</span>
            <button 
              onClick={() => removeTag(tag)}
              className="hover:text-red-500 ml-1 focus:outline-none"
              type="button"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      
      {/* Trường nhập ghi chú */}
      <div className="relative">
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onClick={() => setShowSuggestions(true)}
          placeholder={selectedTags.length ? "Thêm ghi chú khác..." : placeholder || "Nhập hoặc chọn ghi chú đặc biệt"}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A37D]"
          rows="3"
        />
        
        <button 
          type="button"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="absolute right-3 bottom-3 bg-gray-100 p-1 rounded-full hover:bg-gray-200"
          title="Xem gợi ý ghi chú"
        >
          {showSuggestions ? <X size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      
      {/* Dropdown gợi ý với tabs */}
      {showSuggestions && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Tìm ghi chú..."
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A37D] text-sm"
              />
              <Search size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex overflow-x-auto py-2 px-2 border-b border-gray-200 bg-gray-50">
            {filteredCategories.map((category, index) => (
              <button
                key={index}
                className={`whitespace-nowrap px-3 py-1 rounded-md mr-2 text-sm font-medium ${
                  activeTab === index 
                    ? 'bg-[#00A37D] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab(index)}
                type="button"
              >
                {category.category}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-h-60 overflow-y-auto">
            {filteredCategories.length > 0 ? (
              <div>
                {filteredCategories[activeTab]?.notes.map((note, noteIndex) => (
                  <div
                    key={`${activeTab}-${noteIndex}`}
                    className="p-2 hover:bg-[#f0f9f6] cursor-pointer text-sm flex items-center"
                    onClick={() => addSuggestion(note)}
                  >
                    <Plus size={16} className="mr-2 text-[#00A37D] flex-shrink-0" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                Không tìm thấy ghi chú phù hợp
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialNotesInput;