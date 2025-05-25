import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, Calendar, ChevronDown, Home, Hospital } from 'lucide-react';
import Image2 from "../assets/images/Nanny Picture.png";
import Image1 from "../assets/images/Nanny Picture (1).png";
import { useNavigate } from "react-router-dom";
import CalendarComponent from '../components/Calendar';
import api from '../services/api';

const districts = [
  "Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn", "Liên Chiểu", "Cẩm Lệ", "Hòa Vang", "Hoàng Sa"
];

const BookService = () => {
  const [careType, setCareType] = useState("home");
  const [selectedDistrict, setSelectedDistrict] = useState("Liên Chiểu"); // Mặc định là Hải Châu
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState([
    new Date('2025-05-10'),
    new Date('2025-06-20')
  ]); // Mặc định ngày 20/03/2025 đến 30/03/2025
  const [searchInput, setSearchInput] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const navigate = useNavigate();

  // Dropdown state and ref
  const dropdownRef = useRef(null);
  const [districtFilter, setDistrictFilter] = useState("");

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDistrictDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Format date range for display
  const formatDateRange = () => {
    if (selectedDateRange[0] && selectedDateRange[1]) {
      const startDate = formatDate(selectedDateRange[0]);
      const endDate = formatDate(selectedDateRange[1]);
      return `${startDate} - ${endDate}`;
    }
    return "Chọn thời gian";
  };

  // Format date as YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return "";
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  // Hàm gọi API để tìm kiếm bảo mẫu
  const fetchCareTakers = async () => {
    try {
      // Tạo URL trực tiếp để đảm bảo format chính xác
      const startDate = formatDate(selectedDateRange[0]);
      const endDate = formatDate(selectedDateRange[1]);
      const url = `/careTaker/search?district=${encodeURIComponent(selectedDistrict)}&dayStart=${startDate}&dayEnd=${endDate}`;
      const response = await api.get(url);
      console.log("API Response:", response.data);
      console.log("Request URL:", url);

      // Chuyển hướng đến SearchResult với dữ liệu
      navigate('/searchResult', {
        state: {
          profiles: response.data.data,
          district: selectedDistrict,
          dateRange: selectedDateRange
        }
      });
    } catch (error) {
      console.error("Error fetching care takers:", error);
    }
  };

  const fetchSearchCareTakers = async () => {
    try {
      const url = `/careTaker/getCareTakerSearchId/${searchInput}`;
      const response = await api.get(url);
      console.log("API Response:", response.data);
      console.log("Request URL:", url);
    } catch (error) {
      console.error("Error fetching care takers:", error);
    }
  };

  // Cập nhật hàm handleSearch để gọi fetchCareTakers
  const handleSearch = () => {
    fetchCareTakers(); // Gọi hàm fetchCareTakers
    fetchSearchCareTakers(); // Gọi hàm fetchSearchCareTakers nếu cần
  };

  // Hàm để mở Calendar
  const openCalendar = () => {
    setShowCalendar(true);
  };

  // Hàm để xử lý khi người dùng chọn ngày từ Calendar
  const handleDateRangeSelection = (dateRange) => {
    setSelectedDateRange(dateRange);
  };

  // Handle district selection
  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setIsDistrictDropdownOpen(false);
  };

  // Filter districts based on input
  const filteredDistricts = districts.filter(district =>
    district.toLowerCase().includes(districtFilter.toLowerCase())
  );

  return (
    <div className="bg-emerald-900 text-white min-h-[650px] h-auto rounded-3xl flex flex-col items-center justify-center p-4 sm:p-6 relative w-full overflow-hidden mb-10">
      {/* Decorative images - responsive positioning */}
      <div className="absolute top-4 right-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden">
          <img src={Image1} alt="Caregiver" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="absolute top-20 sm:top-24 md:top-32 left-4 sm:left-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg overflow-hidden">
          <img src={Image2} alt="Caregiver" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="absolute bottom-12 sm:bottom-16 left-4 sm:left-8 md:left-12">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden">
          <img src={Image1} alt="Caregiver" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="absolute bottom-12 sm:bottom-16 right-4 sm:right-6 md:right-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden">
          <img src={Image2} alt="Caregiver" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col items-center gap-12 sm:gap-16 md:gap-20 sm:mb-16 w-full max-w-5xl px-2 sm:px-4 z-10">
        {/* Title section */}
        <div className="flex flex-col items-center gap-6 sm:gap-8 mb-50">
          <div className="flex flex-col items-center">
            {/* Main title */}
            <div className="text-[62.11px] font-light text-white mb-2 text-center leading-[74.53px]" style={{ fontFamily: 'Playfair', fontWeight: '300' }}>
              Biến sự quan tâm
            </div>

            {/* Title row with arrow */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 md:gap-8">
              <div className="relative text-emerald-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider transform scale-x-150 sm:scale-x-300 md:scale-x-550">
                ⟶
              </div>
              <div className="text-[62.11px] font-semibold italic text-white font-serif sm:ml-2 md:ml-5 text-center sm:text-left leading-[74.53px]" style={{ fontFamily: 'Playfair', fontWeight: '600' }}>
                thành sự chăm sóc
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="text-[23.29px] text-gray-400 font-normal text-center leading-[27.95px]" style={{ fontFamily: 'SVN-Gilroy', fontWeight: '400' }}>
            Tìm bảo mẫu tin cậy, an tâm từng khoảnh khắc!
          </div>
        </div>

        {/* Service selection and search area */}
        <div className="w-full relative">
          {/* Service type tabs */}
          <div className="flex justify-center mb-4">
            {/* Service type buttons removed for brevity */}
          </div>

          {/* Search form */}
          <div className="bg-white rounded-lg border border-gray-800 p-3 sm:p-4 md:p-6 flex flex-wrap md:flex-nowrap items-center">
            {/* Location selector - CẢI TIẾN DROPDOWN Ở ĐÂY */}
            <div className="relative w-full md:w-1/4 border-b md:border-b-0 md:border-r border-gray-300 pb-3 md:pb-0 md:pr-4 mb-3 md:mb-0" ref={dropdownRef}>
              {/* Label */}
              <div className="flex items-center text-gray-500 text-sm font-medium mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Địa điểm</span>
              </div>

              {/* Dropdown button */}
              <button
                type="button"
                className="flex items-center justify-between w-full text-black p-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                onClick={() => setIsDistrictDropdownOpen(!isDistrictDropdownOpen)}
              >
                <span className={`text-base ${selectedDistrict === "Quận" ? "text-gray-500" : "text-black font-medium"}`}>
                  {selectedDistrict}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isDistrictDropdownOpen ? "transform rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown menu */}
              {isDistrictDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 z-20 bg-white shadow-lg rounded-lg w-full border border-gray-200 overflow-hidden">
                  {/* Search filter */}
                  <div className="sticky top-0 p-2 border-b border-gray-200 bg-white">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Tìm quận..."
                        className="w-full p-2 pl-10 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        value={districtFilter}
                        onChange={(e) => setDistrictFilter(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>

                  {/* District list */}
                  <div className="max-h-60 overflow-y-auto">
                    {filteredDistricts.length > 0 ? (
                      filteredDistricts.map((district) => (
                        <div
                          key={district}
                          className={`p-3 text-black cursor-pointer hover:bg-emerald-50 transition-colors ${selectedDistrict === district ? "bg-emerald-100 font-medium" : ""
                            }`}
                          onClick={() => handleDistrictSelect(district)}
                        >
                          {district}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-gray-500 text-center">
                        Không tìm thấy quận phù hợp
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Time selector */}
            <div className="flex items-center w-full md:w-2/5 border-b md:border-b-0 md:border-r border-gray-300 pb-3 md:pb-0 md:pr-4 mb-3 md:mb-0">
              <div className="flex flex-col w-full ml-6">
                <div className="flex items-center text-gray-500 text-sm font-medium mb-2">
                  <Calendar className="w-3.5 h-3.5 mr-2" />
                  <span>Thời gian</span>
                </div>
                <div
                  className="relative flex items-center w-full cursor-pointer p-2 rounded hover:bg-gray-50 transition-colors"
                  onClick={openCalendar}
                >
                  <span className="text-black flex-grow">{formatDateRange()}</span>
                  <ChevronDown className="w-5 h-5 ml-2 text-black" />
                </div>
              </div>
            </div>

            {/* Search field and button */}
            <div className="flex items-center w-full md:w-1/3 justify-between md:pl-4">
              <input
                type="text"
                placeholder="Tên bảo mẫu/ID"
                className="border border-black rounded-full px-3 sm:px-4 py-2 text-gray-600 text-sm w-3/5"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button
                className="bg-emerald-400 rounded-full px-3 py-2 flex items-center ml-2 w-2/5 justify-center hover:bg-emerald-500 transition-colors"
                onClick={handleSearch}
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-1 text-black" />
                <span className="text-black text-sm sm:text-base font-medium">
                  Tìm kiếm
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-3xl w-full mx-4">
            <CalendarComponent
              onClose={() => setShowCalendar(false)}
              onSelectDateRange={handleDateRangeSelection}
              initialDateRange={selectedDateRange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookService;