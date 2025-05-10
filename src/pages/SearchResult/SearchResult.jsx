import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, MapPin, ChevronDown, Search, X } from 'lucide-react';
import Pagination from '../../components/Pagination';
import ProfilePage from '../ProfilePage/ProfilePage';
import api from '../../services/api';

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={onClose}
            ></div>
            <div className="relative bg-white rounded-lg w-[650px] h-[500px] p-6 border-4 border-double border-[#00a37d]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button onClick={onClose}>
                        <X className="h-6 w-6 text-gray-600" />
                    </button>
                </div>
                <div className="overflow-y-auto h-[400px]">{children}</div>
            </div>
        </div>
    );
};

// SearchFilters Component
const SearchFilters = ({
    onSearch,
    district,
    dateRange,
    setDistrict,
    openCareTakerTypeModal,
    openDistrictModal,
    openServiceHoursModal,
    openExperienceModal,
    openRatingModal,
    setSelectedGender,
    setSelectedRating,
    setExperienceYears,
    selectedGender,
    selectedRating,
    experienceYears,
    selectedCareTakerType,
    setSelectedCareTakerType,
    selectedServiceHours,
    setSelectedServiceHours
}) => {
    const districts = [
        'Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ', 'Hòa Vang'
    ];

    const displayDateRange = () => {
        if (!dateRange) return "Chọn thời gian";
        if (Array.isArray(dateRange)) {
            const formatDate = (date) => {
                if (!date) return "";
                if (typeof date === 'string') {
                    date = new Date(date);
                }
                return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            };
            return `${formatDate(dateRange[0])} - ${formatDate(dateRange[1])}`;
        }
        return "Chọn thời gian";
    };

    return (
        <div className="fixed top-[64px] left-0 right-0 z-40 bg-white drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)] h-[140px]">
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

            <div className="flex justify-center px-4 pb-3">
                <div className="flex items-center gap-3 max-w-7xl w-full">
                    <button
                        className={`border rounded-full px-6 py-2.5 text-gray-700 whitespace-nowrap hover:border-[#00a37d] transition-colors ${selectedCareTakerType.length > 0 ? 'border-[#99f8dc]' : 'border-gray-300'}`}
                        onClick={openCareTakerTypeModal}
                    >
                        Loại bảo mẫu
                    </button>

                    <div className="relative">
                        <select
                            value={selectedGender}
                            onChange={(e) => setSelectedGender(e.target.value)}
                            className={`border rounded-full px-6 py-2.5 text-gray-700 flex items-center whitespace-nowrap hover:border-[#00a37d] transition-colors appearance-none bg-white ${selectedGender ? 'border-[#99f8dc]' : 'border-gray-300'}`}
                        >
                            <option value="">Giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#00a37d] pointer-events-none" />
                    </div>

                    <button
                        className={`border rounded-full px-6 py-2.5 text-gray-700 flex items-center whitespace-nowrap hover:border-[#00a37d] transition-colors ${district ? 'border-[#99f8dc]' : 'border-gray-300'}`}
                        onClick={openDistrictModal}
                    >
                        Quận <ChevronDown className="ml-2 h-4 w-4 text-[#00a37d]" />
                    </button>

                    <button
                        className={`border rounded-full px-6 py-2.5 text-gray-700 whitespace-nowrap hover:border-[#00a37d] transition-colors ${selectedRating.length > 0 ? 'border-[#99f8dc]' : 'border-gray-300'}`}
                        onClick={openRatingModal}
                    >
                        Chuyên viên 5*
                    </button>

                    <button
                        className={`border rounded-full px-6 py-2.5 text-gray-700 whitespace-nowrap hover:border-[#00a37d] transition-colors ${experienceYears ? 'border-[#99f8dc]' : 'border-gray-300'}`}
                        onClick={openExperienceModal}
                    >
                        Năm kinh nghiệm
                    </button>

                    <button
                        className={`border rounded-full px-6 py-2.5 text-gray-700 whitespace-nowrap hover:border-[#00a37d] transition-colors ${selectedServiceHours ? 'border-[#99f8dc]' : 'border-gray-300'}`}
                        onClick={openServiceHoursModal}
                    >
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
                        onClick={onSearch}
                    >
                        <Search className="mr-2 h-4 w-4" /> Tìm kiếm
                    </button>
                </div>
            </div>
        </div>
    );
};

// SearchResult Component
const SearchResult = () => {
    const location = useLocation();

    const getInitialDistrict = () => {
        if (location.state?.district) return location.state.district;
        const savedDistrict = localStorage.getItem('selectedDistrict');
        return savedDistrict ? savedDistrict : "Hải Châu";
    };

    const getInitialDateRange = () => {
        if (location.state?.dateRange) return location.state.dateRange;
        const savedDateRange = localStorage.getItem('selectedDateRange');
        if (savedDateRange) return JSON.parse(savedDateRange);
        return [new Date('2025-03-20'), new Date('2025-03-30')];
    };

    const [profiles, setProfiles] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [currentSection, setCurrentSection] = useState('profile');
    const [district, setDistrict] = useState(getInitialDistrict());
    const [dateRange, setDateRange] = useState(getInitialDateRange());
    const [isCareTakerTypeModalOpen, setIsCareTakerTypeModalOpen] = useState(false);
    const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);
    const [isServiceHoursModalOpen, setIsServiceHoursModalOpen] = useState(false);
    const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedRating, setSelectedRating] = useState([]);
    const [experienceYears, setExperienceYears] = useState('');
    const [selectedCareTakerType, setSelectedCareTakerType] = useState([]);
    const [selectedServiceHours, setSelectedServiceHours] = useState('');
    const itemsPerPage = 8;

    const districts = [
        'Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ', 'Hòa Vang'
    ];

    const careTakerTypes = [
        { label: 'Chăm sóc bệnh mãn tính (tiểu đường, huyết áp)', value: 'Chăm sóc bệnh mãn tính' },
        { label: 'Chăm sóc hậu phẫu', value: 'Chăm sóc hậu phẫu' },
        { label: 'Trẻ cần phục hồi chức năng', value: 'Trẻ cần phục hồi chức năng' },
        { label: 'Trẻ đặc biệt (tự kỷ, khuyết tật...)', value: 'Trẻ đặc biệt' },
        { label: 'Phục hồi chức năng', value: 'Phục hồi chức năng' },
        { label: 'Do sinh hiệu cơ bản', value: 'Do sinh hiệu cơ bản' },
        { label: 'Hỗ trợ oxy (mặt nạ, ống thông mũi)', value: 'Hỗ trợ oxy' },
        { label: 'Chăm sóc vết thương', value: 'Chăm sóc vết thương' },
        { label: 'Dùng máy theo dõi (máy đo SpO2, máy theo dõi tim)', value: 'Dùng máy theo dõi' },
        { label: 'Thao tác sonde (sonde tiểu, sonde da dày)', value: 'Thao tác sonde' }
    ];

    const experienceOptions = [
        'Dưới 1 năm',
        '1 năm',
        '2 năm',
        '3 năm',
        '4 năm',
        'Trên 5 năm'
    ];

    const serviceHoursRanges = [
        '100K - 200K/ngày',
        '200K - 300K/ngày',
        '300K - 400K/ngày',
        '400K - 500K/ngày',
        'Trên 500K/ngày'
    ];

    const ratingOptions = [
        'Tất cả sao',
        '1 sao',
        '2 sao',
        '3 sao',
        '4 sao',
        '5 sao'
    ];

    const handleCareTakerTypeChange = (value) => {
        setSelectedCareTakerType(prev =>
            prev.includes(value)
                ? prev.filter(item => item !== value)
                : [...prev, value]
        );
    };

    const handleCareTakerTypeSelectAll = () => {
        if (selectedCareTakerType.length === careTakerTypes.length) {
            setSelectedCareTakerType([]);
        } else {
            setSelectedCareTakerType(careTakerTypes.map(type => type.value));
        }
    };

    const handleDistrictChange = (selectedDistrict) => {
        setDistrict(selectedDistrict);
        setIsDistrictModalOpen(false);
    };

    const handleDistrictSelectAll = () => {
        setDistrict(districts.length === 1 && district === districts[0] ? '' : districts[0]);
    };

    const handleServiceHoursChange = (range) => {
        setSelectedServiceHours(prev => prev === range ? '' : range);
        setIsServiceHoursModalOpen(false);
    };

    const handleServiceHoursSelectAll = () => {
        if (selectedServiceHours) {
            setSelectedServiceHours('');
        } else {
            setSelectedServiceHours(serviceHoursRanges[0]);
        }
    };

    const handleExperienceChange = (exp) => {
        setExperienceYears(prev => prev === exp ? '' : exp);
        setIsExperienceModalOpen(false);
    };

    const handleExperienceSelectAll = () => {
        if (experienceYears) {
            setExperienceYears('');
        } else {
            setExperienceYears(experienceOptions[0]);
        }
    };

    const handleRatingChange = (rating) => {
        if (rating === 'Tất cả sao') {
            setSelectedRating([]);
        } else {
            setSelectedRating(prev =>
                prev.includes(rating)
                    ? prev.filter(item => item !== rating)
                    : [...prev, rating]
            );
        }
    };

    const handleRatingSelectAll = () => {
        setSelectedRating([]);
    };

    useEffect(() => {
        if (district) {
            localStorage.setItem('selectedDistrict', district);
        }
        if (dateRange) {
            localStorage.setItem('selectedDateRange', JSON.stringify(dateRange));
        }
    }, [district, dateRange]);

    const formatDateForAPI = (date) => {
        if (!date) return "";
        if (typeof date === 'string') {
            date = new Date(date);
        }
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const startDate = dateRange && dateRange[0] ? formatDateForAPI(dateRange[0]) : "2025-03-20";
        const endDate = dateRange && dateRange[1] ? formatDateForAPI(dateRange[1]) : "2025-03-30";
        const districtValue = district || "Hải Châu";
        
        const url = `/careTaker/search?district=${encodeURIComponent(districtValue)}&dayStart=${startDate}&dayEnd=${endDate}`;
        
        console.log("Fetching from URL:", url);
        
        api.get(url)
            .then(response => {
                console.log("API Response:", response.data);
                if (response.data.data) {
                    setProfiles(response.data.data);
                    setFilteredProfiles(response.data.data);
                } else {
                    setProfiles(response.data);
                    setFilteredProfiles(response.data);
                }
            })
            .catch(err => console.error("Lỗi fetch dữ liệu:", err));
    }, [district, dateRange]);

    useEffect(() => {
        let filtered = [...profiles];

        // Filter by gender
        if (selectedGender) {
            filtered = filtered.filter(profile => 
                profile.gender.toLowerCase() === (selectedGender === 'male' ? 'male' : 'female')
            );
        }

        // Filter by rating
        if (selectedRating.length > 0) {
            filtered = filtered.filter(profile => 
                selectedRating.includes(`${Math.floor(profile.rating)} sao`)
            );
        }

        // Filter by experience years
        if (experienceYears) {
            filtered = filtered.filter(profile => {
                const years = profile.experienceYear;
                if (experienceYears === 'Dưới 1 năm') return years < 1;
                if (experienceYears === 'Trên 5 năm') return years > 5;
                return years === parseInt(experienceYears);
            });
        }

        // Filter by caretaker type
        if (selectedCareTakerType.length > 0) {
            filtered = filtered.filter(profile => 
                profile.optionDetailsOfCareTakers.some(option => 
                    selectedCareTakerType.includes(option.detailName)
                )
            );
        }

        // Filter by service hours (price range)
        if (selectedServiceHours) {
            filtered = filtered.filter(profile => {
                const price = parseInt(profile.servicePrice);
                if (selectedServiceHours === '100K - 200K/ngày') return price >= 100000 && price <= 200000;
                if (selectedServiceHours === '200K - 300K/ngày') return price > 200000 && price <= 300000;
                if (selectedServiceHours === '300K - 400K/ngày') return price > 300000 && price <= 400000;
                if (selectedServiceHours === '400K - 500K/ngày') return price > 400000 && price <= 500000;
                if (selectedServiceHours === 'Trên 500K/ngày') return price > 500000;
                return true;
            });
        }

        setFilteredProfiles(filtered);
        setCurrentPage(1);
    }, [selectedGender, selectedRating, experienceYears, selectedCareTakerType, selectedServiceHours, profiles]);

    const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProfiles = filteredProfiles.slice(indexOfFirstItem, indexOfLastItem);

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

    const handleProfileClick = (profile) => {
        if (profile && profile.careTakerId) {
            setIsProfileOpen(false);
            setSelectedProfile(null);
            setSelectedProfile(profile);
            setIsProfileOpen(true);

            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('id', profile.careTakerId.toString());
            window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);

            document.body.classList.add('no-scroll');
        }
    };

    const handleCloseProfile = () => {
        document.body.classList.remove('no-scroll');
        setSelectedProfile(null);
        setIsProfileOpen(false);
    };

    const handleNavigate = (section, currentDistrict, currentDateRange) => {
        setCurrentSection(section);
        if (currentDistrict) setDistrict(currentDistrict);
        if (currentDateRange) setDateRange(currentDateRange);
    };

    const handleSearch = () => {
        const startDate = dateRange && dateRange[0] ? formatDateForAPI(dateRange[0]) : "2025-04-20";
        const endDate = dateRange && dateRange[1] ? formatDateForAPI(dateRange[1]) : "2025-04-30";
        const districtValue = district || "Hải Châu";
        
        const url = `/careTaker/search?district=${encodeURIComponent(districtValue)}&dayStart=${startDate}&dayEnd=${endDate}`;
        
        console.log("Fetching from URL:", url);
        
        api.get(url)
            .then(response => {
                console.log("API Response:", response.data);
                if (response.data.data) {
                    setProfiles(response.data.data);
                    setFilteredProfiles(response.data.data);
                } else {
                    setProfiles(response.data);
                    setFilteredProfiles(response.data);
                }
            })
            .catch(err => console.error("Lỗi fetch dữ liệu tìm kiếm:", err));
    };

    const formatPrice = (price) => {
        if (!price) return '0';
        const numPrice = parseInt(price.replace(/\D/g, ''));
        return numPrice.toLocaleString('vi-VN').replace(/\./g, '.');
    };

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
                    <div className="text-[#8C8C8C] text-lg self-stretch text-left">
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

    const displayItems = createDisplayItems();

    return (
        <div className="min-h-screen font-['SVN-Gilroy'] relative">
            <div className="h-[140px]">
                <SearchFilters
                    onSearch={handleSearch}
                    district={district}
                    dateRange={dateRange}
                    setDistrict={setDistrict}
                    openCareTakerTypeModal={() => setIsCareTakerTypeModalOpen(true)}
                    openDistrictModal={() => setIsDistrictModalOpen(true)}
                    openServiceHoursModal={() => setIsServiceHoursModalOpen(true)}
                    openExperienceModal={() => setIsExperienceModalOpen(true)}
                    openRatingModal={() => setIsRatingModalOpen(true)}
                    setSelectedGender={setSelectedGender}
                    setSelectedRating={setSelectedRating}
                    setExperienceYears={setExperienceYears}
                    selectedGender={selectedGender}
                    selectedRating={selectedRating}
                    experienceYears={experienceYears}
                    selectedCareTakerType={selectedCareTakerType}
                    setSelectedCareTakerType={setSelectedCareTakerType}
                    selectedServiceHours={selectedServiceHours}
                    setSelectedServiceHours={setSelectedServiceHours}
                />
            </div>
            <div className="w-full">
                <div className="max-w-[1200px] mx-auto px-4 mt-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
                        {displayItems.map(item => (
                            <div key={item.careTakerId} className="flex justify-center">
                                <ProfileCard profile={item} />
                            </div>
                        ))}
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
            </div>

            <Modal
                isOpen={isCareTakerTypeModalOpen}
                onClose={() => setIsCareTakerTypeModalOpen(false)}
                title="Loại bảo mẫu"
            >
                <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={selectedCareTakerType.length === careTakerTypes.length}
                            onChange={handleCareTakerTypeSelectAll}
                            className="mr-2"
                        />
                        Tất cả
                    </label>
                    {careTakerTypes.map(type => (
                        <label key={type.value} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedCareTakerType.includes(type.value)}
                                onChange={() => handleCareTakerTypeChange(type.value)}
                                className="mr-2"
                            />
                            {type.label}
                        </label>
                    ))}
                </div>
                <button
                    className="mt-4 bg-[#00a37d] text-white rounded-full px-6 py-2.5"
                    onClick={() => setIsCareTakerTypeModalOpen(false)}
                >
                    Áp dụng
                </button>
            </Modal>

            <Modal
                isOpen={isDistrictModalOpen}
                onClose={() => setIsDistrictModalOpen(false)}
                title="Chọn Quận"
            >
                <div className="grid grid-cols-2 gap-4">
                    {/* <button
                        className={`p-2 rounded-lg ${!district ? 'bg-[#00a37d] text-white' : 'bg-gray-100'}`}
                        onClick={handleDistrictSelectAll}
                    >
                        Tất cả
                    </button> */}
                    {districts.map(d => (
                        <button
                            key={d}
                            className={`p-2 rounded-lg ${district === d ? 'bg-[#00a37d] text-white' : 'bg-gray-100'}`}
                            onClick={() => handleDistrictChange(d)}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </Modal>

            <Modal
                isOpen={isServiceHoursModalOpen}
                onClose={() => setIsServiceHoursModalOpen(false)}
                title="Chọn khoảng giá"
            >
                <div className="grid grid-cols-2 gap-4">
                    <button
                        className={`p-2 rounded-lg ${!selectedServiceHours ? 'bg-[#00a37d] text-white' : 'bg-gray-100'}`}
                        onClick={handleServiceHoursSelectAll}
                    >
                        Tất cả
                    </button>
                    {serviceHoursRanges.map(range => (
                        <button
                            key={range}
                            className={`p-2 rounded-lg ${selectedServiceHours === range ? 'bg-[#00a37d] text-white' : 'bg-gray-100'}`}
                            onClick={() => handleServiceHoursChange(range)}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </Modal>

            <Modal
                isOpen={isExperienceModalOpen}
                onClose={() => setIsExperienceModalOpen(false)}
                title="Năm kinh nghiệm"
            >
                <div className="grid grid-cols-2 gap-4">
                    <button
                        className={`p-2 rounded-lg ${!experienceYears ? 'bg-[#00a37d] text-white' : 'bg-gray-100'}`}
                        onClick={handleExperienceSelectAll}
                    >
                        Tất cả
                    </button>
                    {experienceOptions.map(exp => (
                        <button
                            key={exp}
                            className={`p-2 rounded-lg ${experienceYears === exp ? 'bg-[#00a37d] text-white' : 'bg-gray-100'}`}
                            onClick={() => handleExperienceChange(exp)}
                        >
                            {exp}
                        </button>
                    ))}
                </div>
            </Modal>

            <Modal
                isOpen={isRatingModalOpen}
                onClose={() => setIsRatingModalOpen(false)}
                title="Chọn số sao"
            >
                <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={selectedRating.length === 0}
                            onChange={handleRatingSelectAll}
                            className="mr-2"
                        />
                        Tất cả sao
                    </label>
                    {ratingOptions.slice(1).map(rating => (
                        <label key={rating} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedRating.includes(rating)}
                                onChange={() => handleRatingChange(rating)}
                                className="mr-2"
                            />
                            {rating}
                        </label>
                    ))}
                </div>
                <button
                    className="mt-4 bg-[#00a37d] text-white rounded-full px-6 py-2.5"
                    onClick={() => setIsRatingModalOpen(false)}
                >
                    Áp dụng
                </button>
            </Modal>

            {(isProfileOpen || selectedProfile) && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div
                        className={`absolute inset-0 bg-black transition-opacity duration-300 ease-in-out ${isProfileOpen ? 'opacity-50' : 'opacity-0'}`}
                        onClick={handleCloseProfile}
                    ></div>
                    <div className="absolute inset-y-0 right-0 max-w-full flex">
                        <div
                            className={`transform transition-transform duration-300 ease-in-out ${isProfileOpen ? 'translate-x-0' : 'translate-x-full'}`}
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