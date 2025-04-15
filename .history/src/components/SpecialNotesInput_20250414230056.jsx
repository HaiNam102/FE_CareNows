import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Plus, Search } from 'lucide-react';

const SpecialNotesInput = ({ value, onChange, placeholder }) => {
  // Nhóm ghi chú theo danh mục để dễ quản lý và tìm kiếm
  const noteCategories = [
    {
      category: "Tình trạng ăn uống",
      notes: [
        "Ăn tốt, ăn hết khẩu phần",
        "Biếng ăn, ăn được 1/2 khẩu phần",
        "Cần hỗ trợ khi ăn uống",
        "Khó nuốt, cần thức ăn mềm",
        "Dị ứng với hải sản",
        "Dị ứng với đậu phộng",
        "Tiêu hóa kém, hay đầy hơi",
        "Đã bổ sung sữa dinh dưỡng sau bữa chính"
      ]
    },
    {
      category: "Tình trạng giấc ngủ",
      notes: [
        "Ngủ tốt, không thức dậy giữa đêm",
        "Mất ngủ, thức giấc nhiều lần",
        "Ngủ không sâu giấc",
        "Cần dùng thuốc hỗ trợ để ngủ",
        "Thường xuyên có ác mộng",
        "Ngủ ngáy, có thể ngừng thở khi ngủ",
        "Hay buồn ngủ vào ban ngày"
      ]
    },
    {
      category: "Đau và khó chịu",
      notes: [
        "Đau nhẹ ở vùng lưng, mức độ 3/10",
        "Đau khớp gối khi leo cầu thang",
        "Đau đầu thường xuyên",
        "Đau bụng sau khi ăn",
        "Đau ngực khi hoạt động",
        "Đau vùng xương khớp khi thay đổi thời tiết",
        "Tê buốt chân tay vào buổi sáng"
      ]
    },
    {
      category: "Thuốc và điều trị",
      notes: [
        "Tuân thủ tốt lịch uống thuốc",
        "Hay quên uống thuốc buổi chiều",
        "Cần nhắc nhở khi uống thuốc",
        "Có phản ứng phụ với kháng sinh",
        "Đã tiêm insulin đúng giờ",
        "Đã dùng thuốc hạ sốt lúc 2h chiều",
        "Mới thay băng vết thương lúc 9h sáng"
      ]
    },
    {
      category: "Sinh hiệu và chỉ số",
      notes: [
        "Huyết áp cao (145/95 mmHg)",
        "Huyết áp thấp (90/60 mmHg)",
        "Đường huyết sau ăn: 9.8 mmol/L",
        "Nhiệt độ: 37.8°C",
        "SpO2: 95%",
        "Mạch: 85 lần/phút",
        "Nhịp thở: 18 lần/phút"
      ]
    },
    {
      category: "Vận động và tự lập",
      notes: [
        "Đi lại tự do không cần hỗ trợ",
        "Cần gậy hỗ trợ khi di chuyển",
        "Sử dụng xe lăn khi ra ngoài",
        "Yếu nửa người bên trái",
        "Tập vật lý trị liệu 30 phút mỗi ngày",
        "Khó khăn khi lên xuống cầu thang",
        "Tự tắm rửa được nhưng cần giám sát"
      ]
    },
    {
      category: "Tinh thần và nhận thức",
      notes: [
        "Tinh thần tỉnh táo, giao tiếp tốt",
        "Hay quên việc mới xảy ra",
        "Lú lẫn, nhầm lẫn người thân",
        "Tâm trạng lo âu, căng thẳng",
        "Có dấu hiệu trầm cảm",
        "Tâm trạng thay đổi thất thường",
        "Định hướng tốt về không gian, thời gian"
      ]
    },
    {
      category: "Da và vết thương",
      notes: [
        "Da khô, cần bôi kem dưỡng ẩm",
        "Có vết loét tỳ đè vùng cùng cụt",
        "Vết mổ khô tốt, không viêm nhiễm",
        "Da ngứa, có phát ban nhẹ",
        "Vết thương đang lành tốt",
        "Có dấu hiệu nhiễm trùng vết thương",
        "Cần thay băng 2 lần/ngày"
      ]
    },
    {
      category: "Bài tiết",
      notes: [
        "Tiểu tiện bình thường",
        "Tiểu khó, tiểu lắt nhắt",
        "Tiểu có màu sẫm, lượng ít",
        "Đại tiện thông suốt",
        "Táo bón, 3 ngày chưa đi cầu",
        "Tiêu chảy nhẹ",
        "Đang dùng tã người lớn"
      ]
    },
    {
      category: "Hô hấp",
      notes: [
        "Hô hấp bình thường",
        "Khó thở khi gắng sức nhẹ",
        "Ho có đờm màu trắng",
        "Khò khè khi hít sâu",
        "Thở nhanh nông khi lo lắng",
        "Mới hút đờm lúc 10h sáng",
        "Cần thở oxy lưu lượng thấp"
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