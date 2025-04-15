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
  { id: "completed", label: "Đã hoàn thành" },
  { id: "cancelled", label: "Đã hủy" }
];

const BookingHistory = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [bookings] = useState([
    {
      id: 1,
      serviceName: "Chăm sóc tại bệnh viện",
      date: "22/11/2025",
      orderNumber: "#1234",
      status: "completed",
      statusLabel: "Đã hoàn thành",
      statusColor: "bg-[#11AA52] text-white",
      price: "500.000 VND",
      location: "Bệnh viện Đà Nẵng",
      caregiver: {
        name: "Kim sa",
        avatar: "/images/caregiver1.jpg",
        rating: 5,
        ratingCount: "(20)"
      }
    },
    {
      id: 2,
      serviceName: "Chăm sóc tại bệnh viện",
      date: "22/11/2025",
      orderNumber: "#1234",
      status: "doing",
      statusLabel: "Đang thực hiện",
      statusColor: "bg-[#F7B928] text-white",
      price: "500.000 VND",
      location: "Bệnh viện Đà Nẵng",
      caregiver: {
        name: "Mai Anh",
        avatar: "/images/caregiver2.jpg",
        rating: 5,
        ratingCount: "(20)"
      }
    },
    {
      id: 3,
      serviceName: "Chăm sóc tại bệnh viện",
      date: "22/11/2025",
      orderNumber: "#1234",
      status: "cancelled",
      statusLabel: "Đã hủy",
      statusColor: "bg-[#FF4842] text-white",
      price: "500.000 VND",
      location: "Bệnh viện Đà Nẵng",
      caregiver: {
        name: "Mai Xuân",
        avatar: "/images/caregiver3.jpg",
        rating: 5,
        ratingCount: "(20)"
      }
    },
    {
      id: 4,
      serviceName: "Chăm sóc tại bệnh viện",
      date: "22/11/2025",
      orderNumber: "#1234",
      status: "cancelled",
      statusLabel: "Đã hủy",
      statusColor: "bg-[#FF4842] text-white",
      price: "500.000 VND",
      location: "Bệnh viện Đà Nẵng",
      caregiver: {
        name: "Kim sa",
        avatar: "/images/caregiver4.jpg",
        rating: 5,
        ratingCount: "(20)"
      }
    }
  ]);
  const [sortedBookings, setSortedBookings] = useState(bookings);

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
        <div className="w-[426px] flex-shrink-0">
          <Sidebar />
        </div>

        <div className="flex-1 bg-[#F9FAFB]">
          <main className="mx-auto w-full max-w-[900px] px-8 py-8">
            <div className="w-full">
            

              <div className="bg-white rounded-lg px-10 py-6">
                <div className="flex items-center">
                  {categories.map((category, index) => (
                    <React.Fragment key={category.id}>
                      <button
                        className={`px-4 py-3 font-['SVN-Gilroy'] text-base transition-colors ${
                          activeCategory === category.id
                            ? 'text-[#00A86B]'
                            : 'text-gray-400'
                        }`}
                        onClick={() => setActiveCategory(category.id)}
                      >
                        {category.label}
                      </button>
                      {index < categories.length - 1 && <div className="w-[160px]" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <LayoutGroup>
                <div className="grid grid-cols-2 gap-6">
                  {sortedBookings.map((booking) => {
                    const isActive = activeCategory === "all" || booking.status === activeCategory;
                    const category = categories.find(c => c.id === booking.status);

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
                        className={`relative overflow-hidden rounded-lg ${isActive ? "z-10" : "z-0"}`}
                      >
                        <div className="bg-white rounded-[8px] p-6">
                          {activeCategory !== "all" && !isActive && (
                            <div className="absolute inset-0 z-10 bg-gray-200/40" />
                          )}

                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <p className="text-[#637381] font-['SVN-Gilroy'] text-sm">
                                Ngày book đơn: {booking.date}
                              </p>
                              <span className={`px-3 py-1 rounded-full text-sm font-['SVN-Gilroy'] bg-[${category?.color}] text-white`}>
                                {booking.statusLabel}
                              </span>
                            </div>

                            <p className="text-gray-500 font-['SVN-Gilroy']">
                              Đơn hàng: {booking.orderNumber}
                            </p>

                            <div className="flex gap-4">
                              <div className="w-16 h-16 rounded-full overflow-hidden">
                                <img 
                                  src={booking.caregiver.avatar}
                                  alt={booking.caregiver.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="flex-1">
                                <h3 className="text-xl font-semibold font-['SVN-Gilroy']">{booking.caregiver.name}</h3>
                                <div className="flex items-center gap-1">
                                  <div className="flex">
                                    {Array.from({ length: booking.caregiver.rating }).map((_, i) => (
                                      <Star
                                        key={i}
                                        size={16}
                                        className="fill-[#FFC107] text-[#FFC107]"
                                      />
                                    ))}
                                  </div>
                                  <span className="text-gray-400 text-sm">{booking.caregiver.ratingCount}</span>
                                </div>
                                <p className="text-gray-500 mt-1">{booking.serviceName}</p>
                                <button className="text-[#00A3FF] text-sm mt-1 hover:underline">
                                  Đánh giá ngay
                                </button>
                              </div>

                              <div className="text-right">
                                <p className="text-[#00A3FF] text-xl font-semibold font-['SVN-Gilroy']">
                                  {booking.price}
                                </p>
                                <button className="mt-4 flex items-center text-gray-500 hover:text-[#00A3FF] text-sm">
                                  Xem chi tiết <ChevronRight size={16} />
                                </button>
                              </div>
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