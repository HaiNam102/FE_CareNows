import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkerAlt, faSearch, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../../components/Pagination'; import ProfilePage from '../ProfilePage/ProfilePage';
// Giả định bạn đã import các hàm như formatDate, createDisplayItems, và các state cần thiết

const SearchResult = () => {
    // Các state cần dùng
    const [dateRange, setDateRange] = React.useState(null);
    const [district, setDistrict] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const [selectedProfile, setSelectedProfile] = React.useState(null);

    const formatDate = (date) => {
        // Giả định format: dd/mm/yyyy
        return new Date(date).toLocaleDateString('vi-VN');
    };

    const displayDateRange = () => {
        if (!dateRange) return "Chọn thời gian";
        if (Array.isArray(dateRange)) {
            return `${formatDate(dateRange[0])} - ${formatDate(dateRange[1])}`;
        }
        return "Chọn thời gian";
    };

    const handleSearch = () => {
        // Gọi API hoặc filter lại data ở đây
    };

    const createDisplayItems = () => {
        // Giả định: trả về danh sách item dạng object có field `care_taker_id`
        return []; // Thay thế bằng dữ liệu thật
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleCloseProfile = () => {
        setIsProfileOpen(false);
        setSelectedProfile(null);
    };

    const handleNavigate = (newProfile) => {
        setSelectedProfile(newProfile);
    };

    const displayItems = createDisplayItems();

    return (
        <div className="bg-gray-100">
            {/* FILTERS */}
            <div className="fixed top-0 left-0 right-0 z-40 bg-white" style={{
                boxShadow: '0px 15px 46.6px 0px rgba(0, 0, 0, 0.25)',
                marginTop: '80px'
            }}>
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
                    <button
                        className="bg-[#00a37d] text-white rounded-full px-4 py-2 flex items-center"
                        onClick={handleSearch}
                    >
                        <FontAwesomeIcon icon={faSearch} className="mr-2" /> Tìm kiếm
                    </button>
                </div>
            </div>

            {/* KẾT QUẢ TÌM KIẾM */}
            <div className="container mx-auto py-4" style={{ paddingTop: '180px' }}>
                <div className="min-h-[800px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {displayItems.map(item => (
                            <ProfileCard
                                key={item.care_taker_id}
                                profile={item}
                                onClick={() => {
                                    setSelectedProfile(item);
                                    setIsProfileOpen(true);
                                }}
                            />
                        ))}
                    </div>
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>

            {/* OVERLAY PROFILE */}
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
