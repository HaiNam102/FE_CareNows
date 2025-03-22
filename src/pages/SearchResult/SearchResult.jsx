import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faArrowRight, 
  faCalendarAlt, 
  faMapMarkerAlt, 
  faHome, 
  faChevronDown, 
  faSearch 
} from '@fortawesome/free-solid-svg-icons';
import Pagination from '../../components/Pagination';
import ProfilePage from '../ProfilePage';

const SearchResult = () => {
    const location = useLocation();
    // Lấy giá trị từ location state hoặc localStorage nếu có
    const getInitialDistrict = () => {
        if (location.state?.district) return location.state.district;
        const savedDistrict = localStorage.getItem('selectedDistrict');
        return savedDistrict ? savedDistrict : null;
    };
    
    const getInitialDateRange = () => {
        if (location.state?.dateRange) return location.state.dateRange;
        const savedDateRange = localStorage.getItem('selectedDateRange');
        return savedDateRange ? JSON.parse(savedDateRange) : null;
    };

    const [profiles, setProfiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [currentSection, setCurrentSection] = useState('profile');
    const [district, setDistrict] = useState(getInitialDistrict());
    const [dateRange, setDateRange] = useState(getInitialDateRange());
    const itemsPerPage = 8;
    
    // Lưu district và dateRange vào localStorage khi thay đổi
    useEffect(() => {
        if (district) {
            localStorage.setItem('selectedDistrict', district);
        }
        if (dateRange) {
            localStorage.setItem('selectedDateRange', JSON.stringify(dateRange));
        }
    }, [district, dateRange]);

    useEffect(() => {
        fetch("http://localhost:5000/profiles")
          .then(res => res.json())
          .then(data => setProfiles(data))
          .catch(err => console.error("Lỗi fetch dữ liệu:", err));
    }, []);

    // Cập nhật state khi location.state thay đổi
    useEffect(() => {
        if (location.state?.district) {
            setDistrict(location.state.district);
        }
        if (location.state?.dateRange) {
            setDateRange(location.state.dateRange);
        }
    }, [location.state]);

    const totalPages = Math.ceil(profiles.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProfiles = profiles.slice(indexOfFirstItem, indexOfLastItem);

    const createDisplayItems = () => {
        const displayItems = [...currentProfiles];
        const placeholdersNeeded = itemsPerPage - displayItems.length;
      
        for (let i = 0; i < placeholdersNeeded; i++) {
            displayItems.push({ id: `placeholder-${i}`, isPlaceholder: true });
        }
        return displayItems;
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const formatDate = (date) => {
        if (!date) return "";
        if (typeof date === 'string') {
            date = new Date(date);
        }
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    const handleProfileClick = (profile) => {
        setSelectedProfile(profile);
        setIsProfileOpen(true);
        // Thêm class để ngăn scroll khi profile đang mở
        document.body.classList.add('no-scroll');
    };

    const handleCloseProfile = () => {
        document.body.classList.remove('no-scroll'); // Xóa class để cho phép scroll
        setSelectedProfile(null);  // Reset selectedProfile
        setIsProfileOpen(false);
    };

    // Cập nhật hàm này để nhận và lưu trữ district và dateRange
    const handleNavigate = (section, currentDistrict, currentDateRange) => {
        console.log(`Navigating to ${section} with district: ${currentDistrict} and dateRange:`, currentDateRange);
        setCurrentSection(section);
        // Đảm bảo dữ liệu district và dateRange được giữ nguyên
        if (currentDistrict) {
            setDistrict(currentDistrict);
        }
        if (currentDateRange) {
            setDateRange(currentDateRange);
        }
    };

    // Component ProfileCard với event handler
    const ProfileCard = ({ profile }) => {
        if (profile.isPlaceholder) {
            return <div className="w-full h-full opacity-0"></div>;
        }

        return (
            <div 
                className="w-full h-full p-3 bg-white rounded-lg border border-gray-400 flex flex-col justify-center items-center gap-3 cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => handleProfileClick(profile)}
            >
                <div className="self-stretch text-black text-2xl font-semibold">{profile.name}</div>
                <div className="text-[#8C8C8C] text-lg font-semibold">{profile.role}</div>
                <img className="w-36 h-36 rounded-full" src={profile.image} alt={profile.name} />
                <div className="self-stretch text-[#8C8C8C] text-sm">📍 {profile.location}</div>
                <div className="self-stretch flex justify-between items-center">
                    <div className="flex justify-center items-center">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                        <span className="text-[#121212] text-sm font-bold ml-1">{profile.rating}</span>
                        <span className="text-[#BCB9C5] text-sm font-bold">({profile.reviews})</span>
                    </div>
                    <div className="flex justify-start items-center gap-10">
                        <div className="p-1 bg-white flex justify-center items-center gap-2.5">
                            <div>
                                <span className="text-[#00a37d] text-lg font-semibold">{profile.hourlyRate}</span>
                                <span className="text-[#121212] text-2xl font-semibold">/</span>
                                <span className="text-[#121212] text-sm font-semibold">h</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-center gap-1.5">
                    <div className="self-stretch h-0 bg-green-700 border border-green-700"></div>
                    <div className="self-stretch flex justify-between items-center">
                        <div className="text-[#00a37d] text-sm font-medium">Xem chi tiết</div>
                        <FontAwesomeIcon icon={faArrowRight} className="text-[#00a37d]" />
                    </div>
                </div>
            </div>
        );
    };

    // Component SearchFilters
    const SearchFilters = () => {
        const displayDateRange = () => {
            if (!dateRange) return "Chọn thời gian";
            if (Array.isArray(dateRange)) {
                return `${formatDate(dateRange[0])} - ${formatDate(dateRange[1])}`;
            }
            return "Chọn thời gian";
        };

        return (
            <div className="bg-white">
                <div className="flex flex-wrap items-center justify-center p-4 space-x-2">
                    <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-700" />
                        <span className="text-gray-700">{displayDateRange()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-700" />
                        <span className="text-gray-700">{district || "Chọn địa điểm"}</span>
                    </div>
                </div>
                <div className="flex flex-wrap items-start justify-start p-4 space-x-2">
                    <button className="border border-gray-300 rounded-full px-4 py-2 text-gray-700">Loại bảo mẫu</button>
                    <button className="border border-gray-300 rounded-full px-4 py-2 text-gray-700 flex items-center">
                        Giới tính <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-[#00a37d]" />
                    </button>
                    <button className="border border-gray-300 rounded-full px-4 py-2 text-gray-700 flex items-center">
                        Quận <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-[#00a37d]" />
                    </button>
                    <button className="border border-gray-300 rounded-full px-4 py-2 text-gray-700">Chuyên viên 5*</button>
                    <button className="border border-gray-300 rounded-full px-4 py-2 text-gray-700">Năm kinh nghiệm</button>
                    <button className="border border-gray-300 rounded-full px-4 py-2 text-gray-700">Giờ dịch vụ</button>
                    <div className="flex items-center border border-[#00a37d] rounded-full px-2 py-2">
                        <input type="text" placeholder="Tên bảo mẫu/Url" className="outline-none text-gray-700 w-full" />
                    </div>
                    <button className="bg-[#00a37d] text-white rounded-full px-4 py-2 flex items-center">
                        <FontAwesomeIcon icon={faSearch} className="mr-2" /> Tìm kiếm
                    </button>
                </div>
            </div>
        );
    };

    const displayItems = createDisplayItems();

    return (
        <div className="bg-gray-10">
            <SearchFilters />
            <div className="container mx-auto py-4">
                <div className="min-h-[800px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {displayItems.map(item => <ProfileCard key={item.id} profile={item} />)}
                    </div>
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
            
            {/* Profile Page Overlay and Slide-in */}
            {(isProfileOpen || selectedProfile) && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    {/* Overlay */}
                    <div 
                        className={`absolute inset-0 bg-black transition-opacity duration-300 ease-in-out ${
                            isProfileOpen ? 'opacity-50' : 'opacity-0'
                        }`}
                        onClick={handleCloseProfile}
                    ></div>
                    
                    {/* Profile Container */}
                    <div className="absolute inset-y-0 right-0 max-w-full flex">
                        <div 
                            className={`transform transition-transform duration-300 ease-in-out ${
                                isProfileOpen ? 'translate-x-0' : 'translate-x-full'
                            }`}
                            style={{ marginTop: '15px', marginRight: '15px' }}
                        >
                            {selectedProfile && (
                                <ProfilePage 
                                    profile={selectedProfile} 
                                    onClose={handleCloseProfile} 
                                    onNavigate={handleNavigate}
                                    district={district}
                                    dateRange={dateRange}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchResult;