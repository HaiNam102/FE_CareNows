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
            displayItems.push({ care_taker_id: `placeholder-${i}`, isPlaceholder: true });
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
        // Đảm bảo rằng profile chứa tất cả thông tin cần thiết, bao gồm cả imgProfile
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
        const startDate = dateRange && dateRange[0] ? formatDateForAPI(dateRange[0]) : "2025-03-20";
        const endDate = dateRange && dateRange[1] ? formatDateForAPI(dateRange[1]) : "2025-03-30";
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
                <div className="self-stretch text-black text-2xl font-semibold">{profile.nameOfCareTaker}</div>
                <div className="text-[#8C8C8C] text-lg self-stretch text-[#8C8C8C] text-2xl" >
                    {profile.experienceYear} năm kinh nghiệm
                </div>

                <img className="w-36 h-36 rounded-full" src={profile.imgProfile} alt={profile.nameOfCareTaker} />
                <div className="self-stretch text-[#8C8C8C] text-sm">📍 {profile.ward} - {profile.district}</div>
                <div className="self-stretch flex justify-between items-center">
                    <div className="flex justify-center items-center">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                        <span className="text-[#121212] text-sm font-bold ml-1">{profile.rating}</span>
                        <span className="text-[#BCB9C5] text-sm font-bold">({profile.totalReviewers})</span>
                    </div>
                    <div className="flex justify-start items-center gap-10">
                        <div className="p-1 bg-white flex justify-center items-center gap-2.5">
                            <div>
                                <span className="text-[#00a37d] text-lg font-semibold">{profile.servicePrice}</span>
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
