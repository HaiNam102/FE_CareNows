import React, { useState } from "react";
import { Search, MapPin, Calendar, ChevronDown, Home, Hospital } from 'lucide-react';
import Image2 from "../assets/images/Nanny Picture.png";
import Image1 from "../assets/images/Nanny Picture (1).png"


const districts = [
  "Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn", "Liên Chiểu", "Cẩm Lệ", "Hòa Vang", "Hoàng Sa"
];

const BookService = () => {
  const [careType, setCareType] = useState("home");
  const [selectedDistrict, setSelectedDistrict] = useState("Quận");
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);

  return (
    <div className="bg-emerald-900 text-white min-h-[650px] h-auto rounded-3xl flex flex-col items-center justify-center p-4 sm:p-6 relative w-full overflow-hidden mb-10  ">
      {/* Decorative images - responsive positioning */}
      <div className="absolute top-4 right-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden">
          <img src={Image1} alt="Image 1" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="absolute top-20 sm:top-24 md:top-32 left-4 sm:left-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg overflow-hidden">
          <img src={Image2} alt="Image 2" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="absolute bottom-12 sm:bottom-16 left-4 sm:left-8 md:left-12">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden">
          <img src={Image1} alt="Image 3" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="absolute bottom-12 sm:bottom-16 right-4 sm:right-6 md:right-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden">
          <img src={Image2} alt="Image 4" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col items-center gap-12 sm:gap-16 md:gap-20 sm:mb-16 w-full max-w-5xl px-2 sm:px-4 z-10 ">
        {/* Title section */}
          {/* Title section */}
          <div className="flex flex-col items-center gap-6 sm:gap-8  mb-50"> 
            <div className="flex flex-col items-center">
              {/* Main title */}
              <div className="text-[62.11px] font-light text-white Playfair mb-2 text-center leading-[74.53px]" style={{ fontFamily: 'Playfair', fontWeight: '300' }}>
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
          <div className="flex justify-center mb-0">
            <div className="flex">
              <button
                className={`flex items-center px-3 sm:px-4 py-2 sm:py-3 rounded-tl-lg ${careType === 'home' ? 'bg-emerald-400' : 'bg-gray-200'}`}
                onClick={() => setCareType('home')}
              >
                <Home className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                <span className={`text-base sm:text-lg font-medium ${careType === 'home' ? 'text-black' : 'text-gray-500'}`}>
                  Chăm sóc tại nhà
                </span>
              </button>
              <button
                className={`flex items-center px-3 sm:px-4 py-2 sm:py-3 rounded-tr-lg ${careType === 'hospital' ? 'bg-emerald-400' : 'bg-gray-200'}`}
                onClick={() => setCareType('hospital')}
              >
                <Hospital className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                <span className={`text-base sm:text-lg font-medium ${careType === 'hospital' ? 'text-black' : 'text-gray-500'}`}>
                  Chăm sóc tại bệnh viện
                </span>
              </button>
            </div>
          </div>

          {/* Search form - với phân bố đều */}
          <div className="bg-white rounded-lg border border-gray-800 p-3 sm:p-4 md:p-6 flex flex-wrap md:flex-nowrap items-center">
            {/* Location selector - điều chỉnh width */}
            <div className="flex flex-col w-full md:w-1/4 border-b md:border-b-0 md:border-r border-gray-300 pb-3 md:pb-0 md:pr-4 mb-3 md:mb-0">
              <div className="flex items-center text-gray-500 text-sm font-medium mb-2">
                <MapPin className="w-3.5 h-3.5 mr-2" />
                <span>Địa điểm</span>
              </div>
              <div className="relative flex items-center">
                <div onClick={() => setIsDistrictDropdownOpen(!isDistrictDropdownOpen)} className="cursor-pointer flex items-center justify-between w-full">
                  <span className="text-black text-base ml-5">
                    {selectedDistrict}  
                  </span>
                  <ChevronDown className="w-5 h-5 ml-4 text-black" />
                </div>

                {isDistrictDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 z-20 bg-white shadow-lg rounded border border-gray-200 w-48 ">
                    {districts.map(district => (
                      <div
                        key={district}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-black "
                        onClick={() => {
                          setSelectedDistrict(district);
                          setIsDistrictDropdownOpen(false); 
                        }}
                      > 
                        {district}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Time selector - điều chỉnh width */}
            <div className="flex flex-col w-full md:w-2/5 border-b md:border-b-0 md:border-r border-gray-300 pb-3 md:pb-0 md:pr-4 mb-3 md:mb-0">
              <div className="flex items-center text-gray-500 text-sm font-medium mb-2">
                <Calendar className="w-3.5 h-3.5 mr-2" />
                <span>Thời gian</span>
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="text-black text-base ml-5 text-sm sm:text-base">
                  21:00, 02/03/2025 -20:00, 03/03/2025
                </span>
                <ChevronDown className="w-5 h-5 ml-2 text-black" />
              </div>
            </div>

            {/* Search field and button - điều chỉnh width và spacing */}
            <div className="flex items-center w-full md:w-1/3 justify-between md:pl-4">
              <input
                type="text"
                placeholder="Tên bảo mẫu/ID"
                className="border border-black rounded-full px-3 sm:px-4 py-2 text-gray-600 text-sm w-3/5"
              />
              <button className="bg-emerald-400 rounded-full px-3 py-2 flex items-center ml-2 w-2/5 justify-center">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-1 text-black" />
                <span className="text-black text-sm sm:text-base font-medium">
                  Tìm kiếm
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookService;