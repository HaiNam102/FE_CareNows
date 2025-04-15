import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, MapPin, ChevronDown, Search } from 'lucide-react';
import Pagination from '../../components/Pagination';
import ProfilePage from '../ProfilePage/ProfilePage';

const SearchResult = () => {
    const location = useLocation();
    // Lấy giá trị từ location state hoặc localStorage nếu có
    const getInitialDistrict = () => {
        if (location.state?.district) return location.state.district;
        const savedDistrict = localStorage.getItem('selectedDistrict');
        return savedDistrict ? savedDistrict : "Hải Châu"; // Mặc định là "Hải Châu"
    };

    const getInitialDateRange = () => {
        if (location.state?.dateRange) return location.state.dateRange;
        const savedDateRange = localStorage.getItem('selectedDateRange');
        if (savedDateRange) return JSON.parse(savedDateRange);
        // Mặc định là từ 20/03/2025 đến 30/03/2025
        return [new Date('2025-03-20'), new Date('2025-03-30')];
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

    // Format date as YYYY-MM-DD
    const formatDateForAPI = (date) => {
        if (!date) return "";
        if (typeof date === 'string') {
            date = new Date(date);
        }
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };

    // In SearchResult.js, update your useEffect fetch:
    useEffect(() => {
        // Tạo URL trực tiếp để đảm bảo format chính xác
        const startDate = dateRange && dateRange[0] ? formatDateForAPI(dateRange[0]) : "2025-03-20";
        const endDate = dateRange && dateRange[1] ? formatDateForAPI(dateRange[1]) : "2025-03-30";
        const districtValue = district || "Hải Châu";
        
        // Tạo URL với format cố định
        const url = `http://localhost:8080/api/careTaker/search?district=${encodeURIComponent(districtValue)}&dayStart=${startDate}&dayEnd=${endDate}`;
        
        console.log("Fetching from URL:", url);
        
        // Gọi API với URL đã định sẵn
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log("API Response:", data);
                // Check API response structure based on Postman example
                if (data.data) {
                    setProfiles(data.data);
                } else {
                    setProfiles(data); // Fallback in case response structure is different
                }
            })
            .catch(err => console.error("Lỗi fetch dữ liệu:", err));
    }, [district, dateRange]);

    // Cập nhật state khi location.state thay đổi
    useEffect(() => {
        if (location.state?.district) {
            setDistrict(location.state.district);
        }
        if (location.state?.dateRange) {
            setDateRange(location.state.dateRange);
        }
        if (location.state?.profiles) {
            setProfiles(location.state.profiles);
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
            displayItems.push({ careTakerId: `placeholder-${i}`, isPlaceholder: true });
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
        console.log("Selected profile:", profile);
        
        // Ensure the profile has a valid careTakerId before passing it
        if (profile && profile.careTakerId) {
            // Close the current profile first to reset all state
            setIsProfileOpen(false);
            setSelectedProfile(null);
            
            // Wait for UI to update before opening new profile
            setTimeout(() => {
                console.log("Opening caretaker profile:", profile.careTakerId);
                setSelectedProfile(profile);
                setIsProfileOpen(true);
                
                // Update URL with caretaker ID for direct access
                const urlParams = new URLSearchParams(window.location.search);
                urlParams.set('id', profile.careTakerId.toString());
                window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
                
                // Add class to prevent scrolling when profile is open
                document.body.classList.add('no-scroll');
            }, 200); // Longer delay to ensure state updates properly
        } else {
            console.error("Profile is missing careTakerId:", profile);
        }
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

    // Hàm gọi API với URL cố định cho nút tìm kiếm
    const handleSearch = () => {
        const startDate = dateRange && dateRange[0] ? formatDateForAPI(dateRange[0]) : "2025-04-20";
        const endDate = dateRange && dateRange[1] ? formatDateForAPI(dateRange[1]) : "2025-04-30";
        const districtValue = district || "Hải Châu";
        
        // Tạo URL với format cố định
        const url = `http://localhost:8080/api/careTaker/search?district=${encodeURIComponent(districtValue)}&dayStart=${startDate}&dayEnd=${endDate}`;
        
        console.log("Searching with URL:", url);
        
        // Gọi API với URL đã định sẵn
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log("Search API Response:", data);
                if (data.data) {
                    setProfiles(data.data);
                } else {
                    setProfiles(data);
                }
            })
            .catch(err => console.error("Lỗi fetch dữ liệu tìm kiếm:", err));
    };

    const formatPrice = (price) => {
        if (!price) return '0';
        const numPrice = parseInt(price.replace(/\D/g, ''));
        return numPrice.toLocaleString('vi-VN').replace(/\./g, '.');
    };

    // Component ProfileCard với event handler
    const ProfileCard = ({ profile }) => {
        if (profile.isPlaceholder) {
            return <div className="w-[261px] h-[377px] opacity-0"></div>;
        }

        return (
            <div
                className="group w-full max-w-[280px] min-w-[261px] h-[377px] p-3 pb-[22px] bg-white rounded-lg border-[0.667px] border-[#8C8C8C] flex flex-col justify-center items-center gap-3 cursor-pointer transition-all duration-300 font-['SVN-Gilroy'] relative hover:border-[#8C8C8C]"
                onClick={() => handleProfileClick(profile)}
            >
                <div 
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                    style={{ 
                        background: 'linear-gradient(0deg, rgba(153, 248, 220, 0.2) 0%, rgba(153, 248, 220, 0) 66%)'
                    }}
                ></div>
                <div className="relative z-10 flex flex-col items-center gap-3 w-full">
                    <div className="self-stretch text-black text-2xl font-semibold">{profile.nameOfCareTaker}</div>
                    <div className="text-[#8C8C8C] text-lg self-stretch">
                        {profile.experienceYear} năm kinh nghiệm
                    </div>

                    <img className="w-36 h-36 rounded-full" src={profile.imgProfile} alt={profile.nameOfCareTaker} />
                    <div className="self-stretch text-[#8C8C8C] text-sm">📍 {profile.ward} - {profile.district}</div>
                    <div className="self-stretch flex justify-between items-center">
                        <div className="flex justify-center items-center">
                            <span className="text-[#121212] text-sm font-bold ml-1">{profile.rating}</span>
                            <span className="text-[#BCB9C5] text-sm font-bold">({profile.totalReviewers})</span>
                        </div>
                        <div className="flex items-baseline flex-shrink-0">
                            <span className="text-[#00a37d] text-[24px] font-semibold leading-[28.8px] whitespace-nowrap">{formatPrice(profile.servicePrice)}</span>
                            <span className="text-[#121212] text-lg font-semibold ml-0.5">/</span>
                            <span className="text-[#121212] text-sm font-semibold">h</span>
                        </div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-center gap-1.5">
                        <div className="self-stretch h-0 bg-green-700 border border-green-700"></div>
                        <div className="self-stretch flex justify-between items-center">
                            <div className="text-[#00a37d] text-sm font-medium">Xem chi tiết</div>
                        </div>
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
            <div className="fixed top-[64px] left-0 right-0 z-40 bg-white drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)] h-[140px]">
                {/* Date and Location Header */}
                <div className="flex items-center justify-center py-3">
                    <div className="flex items-center space-x-4 text-base text-gray-600">
                        <div className="flex items-center">
                            <Calendar className="mr-2 h-[17px] w-[17px] stroke-[1.5]" />
                            <span className="text-[16px]">{displayDateRange()}</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div className="flex items-center">
                            <MapPin className="mr-2 h-[17px] w-[17px] stroke-[1.5]" />
                            <span className="text-[16px]">{district || "Chọn địa điểm"}</span>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="flex justify-center px-4 pb-3">
                    <div className="flex items-center gap-3 max-w-7xl w-full">
                        <button className="border border-gray-300 rounded-full px-6 py-2.5 text-gray-700 whitespace-nowrap hover:border-[#00a37d] transition-colors">
                            Loại bảo mẫu
                        </button>
                        <button className="border border-gray-300 rounded-full px-6 py-2.5 text-gray-700 flex items-center whitespace-nowrap hover:border-[#00a37d] transition-colors">
                            Giới tính <ChevronDown className="ml-2 h-4 w-4 text-[#00a37d]" />
                        </button>
                        <button className="border border-gray-300 rounded-full px-6 py-2.5 text-gray-700 flex items-center whitespace-nowrap hover:border-[#00a37d] transition-colors">
                            Quận <ChevronDown className="ml-2 h-4 w-4 text-[#00a37d]" />
                        </button>
                        <button className="border border-gray-300 rounded-full px-6 py-2.5 text-gray-700 whitespace-nowrap hover:border-[#00a37d] transition-colors">
                            Chuyên viên 5*
                        </button>
                        <button className="border border-gray-300 rounded-full px-6 py-2.5 text-gray-700 whitespace-nowrap hover:border-[#00a37d] transition-colors">
                            Năm kinh nghiệm
                        </button>
                        <button className="border border-gray-300 rounded-full px-6 py-2.5 text-gray-700 whitespace-nowrap hover:border-[#00a37d] transition-colors">
                            Giờ dịch vụ
                        </button>
                        <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 rounded-full border-2 border-[#00a37d]"></div>
                            <input 
                                type="text" 
                                placeholder="Tên bảo mẫu/Url" 
                                className="relative w-[200px] px-4 py-2.5 rounded-full border border-black bg-transparent outline-none text-gray-700"
                            />
                        </div>
                        <button 
                            className="flex-shrink-0 bg-[#00a37d] text-white rounded-full px-6 py-2.5 flex items-center whitespace-nowrap hover:bg-[#008f6c] transition-colors"
                            onClick={handleSearch}
                        >
                            <Search className="mr-2 h-4 w-4" /> Tìm kiếm
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const displayItems = createDisplayItems();
    return (
        <div className="min-h-screen font-['SVN-Gilroy'] relative">
            <div className="h-[140px]">
                <SearchFilters />
            </div>
            <div className="w-full">
                <div className="max-w-[1200px] mx-auto px-4 mt-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
                        {displayItems.map(item => (
                            <div key={item.care_taker_id} className="flex justify-center">
                                <ProfileCard profile={item} />
                            </div>
                        ))}
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
            </div>

            {/* Profile Page Overlay and Slide-in */}
            {(isProfileOpen || selectedProfile) && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    {/* Overlay */}
                    <div
                        className={`absolute inset-0 bg-black transition-opacity duration-300 ease-in-out ${isProfileOpen ? 'opacity-50' : 'opacity-0'
                            }`}
                        onClick={handleCloseProfile}
                    ></div>

                    {/* Profile Container */}
                    <div className="absolute inset-y-0 right-0 max-w-full flex">
                        <div
                            className={`transform transition-transform duration-300 ease-in-out ${isProfileOpen ? 'translate-x-0' : 'translate-x-full'
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
