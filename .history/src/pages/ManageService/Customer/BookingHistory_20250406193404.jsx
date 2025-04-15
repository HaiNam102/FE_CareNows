import React, { useState, useEffect } from 'react';
import { motion, LayoutGroup } from "framer-motion";
import Header from '../../../layouts/Header';
import Footer from '../../../layouts/Footer';
import Sidebar from '../../../layouts/Sidebar';
import { Star, ChevronRight } from 'lucide-react';

// Navigation categories
const categories = [
  { id: "all", label: "Tất cả" },
  { id: "doing", label: "Đang thực hiện" },
  { id: "pending", label: "Đang chờ" },
  { id: "completed", label: "Đã hoàn thành" },
  { id: "cancelled", label: "Đã hủy" },
];

const BookingHistory = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [bookings] = useState([
    {
      id: 1,
      serviceName: "Chăm sóc da mặt",
      date: "28/02/2024",
      time: "09:00",
      status: "completed",
      statusLabel: "Đã hoàn thành",
      statusColor: "bg-[rgb(0,107,82)]/10 text-[rgb(0,107,82)]",
      price: "500.000đ",
      location: "15 Trưng Nghĩa 2, Hòa Minh, Liên Chiểu",
      caregiver: {
        name: "Tố Uyên",
        avatar: "https://i.pravatar.cc/300",
        rating: 5
      }
    },
    {
      id: 2,
      serviceName: "Massage body",
      date: "01/03/2024",
      time: "14:30",
      status: "pending",
      statusLabel: "Đang chờ",
      statusColor: "bg-blue-50 text-blue-600",
      price: "400.000đ",
      location: "Bệnh viện Đà Nẵng, 124 Hải Phòng",
      caregiver: {
        name: "Mai Anh",
        avatar: "https://i.pravatar.cc/301",
        rating: 4
      }
    }
  ]);
  const [sortedBookings, setSortedBookings] = useState(bookings);

  // Sort bookings when active category changes
  useEffect(() => {
    if (activeCategory === "all") {
      setSortedBookings([...bookings]);
    } else {
      const sorted = [...bookings].sort((a, b) => {
        const aIsActive = a.status === activeCategory;
        const bIsActive = b.status === activeCategory;
        if (aIsActive && !bIsActive) return -1;
        if (!aIsActive && bIsActive) return 1;
        return 0;
      });
      setSortedBookings(sorted);
    }
  }, [activeCategory, bookings]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex pt-[123px]">
        {/* Left side - Fixed position */}
        <div className="w-[426px] flex-shrink-0">
          <Sidebar />
        </div>

        {/* Right side - Scrollable content */}
        <div className="flex-1">
          <main className="mx-auto w-full max-w-[900px] px-8 py-8">
            <div className="w-full">
              <div className="mb-8">
                <h2 className="text-2xl font-bold font-['SVN-Gilroy']">Lịch sử đặt lịch</h2>
              </div>

              {/* Navigation */}
              <div className="mb-6 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={\`px-4 py-2 rounded-full font-['SVN-Gilroy'] \${
                      activeCategory === category.id
                        ? "bg-[rgb(0,107,82)] text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }\`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Bookings Grid */}
              <LayoutGroup>
                <div className="grid grid-cols-1 gap-6">
                  {sortedBookings.map((booking) => {
                    const isActive = activeCategory === "all" || booking.status === activeCategory;

                    return (
                      <motion.div
                        key={booking.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          },
                        }}
                        className={\`relative overflow-hidden rounded-lg \${isActive ? "z-10" : "z-0"}\`}
                      >
                        <div className="bg-white rounded-[8px] p-6 border border-gray-100">
                          {/* Overlay for inactive cards */}
                          {activeCategory !== "all" && !isActive && (
                            <div className="absolute inset-0 z-10 bg-gray-200/40" />
                          )}

                          <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                              <div className="w-16 h-16 rounded-full overflow-hidden">
                                <img 
                                  src={booking.caregiver.avatar}
                                  alt={booking.caregiver.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div>
                                <h3 className="text-xl font-semibold font-['SVN-Gilroy'] mb-2">{booking.serviceName}</h3>
                                <div className="flex items-center gap-1 mb-2">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      size={14}
                                      className={i < booking.caregiver.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                    />
                                  ))}
                                </div>
                                <div className="space-y-2">
                                  <p className="text-gray-500 font-['SVN-Gilroy']">
                                    Ngày: <span className="text-black">{booking.date}</span>
                                  </p>
                                  <p className="text-gray-500 font-['SVN-Gilroy']">
                                    Giờ: <span className="text-black">{booking.time}</span>
                                  </p>
                                  <p className="text-gray-500 font-['SVN-Gilroy']">
                                    Địa điểm: <span className="text-black">{booking.location}</span>
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-xl font-semibold font-['SVN-Gilroy'] text-[rgb(0,107,82)]">
                                {booking.price}
                              </p>
                              <p className={\`mt-2 px-3 py-1 rounded-full text-sm font-['SVN-Gilroy'] inline-block \${booking.statusColor}\`}>
                                {booking.statusLabel}
                              </p>
                              <button className="mt-4 flex items-center text-gray-500 hover:text-[rgb(0,107,82)]">
                                Xem chi tiết <ChevronRight size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </LayoutGroup>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingHistory; 