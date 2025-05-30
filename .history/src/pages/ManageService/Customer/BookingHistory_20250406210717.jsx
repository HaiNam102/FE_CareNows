import React, { useState, useEffect } from 'react';
import { motion, LayoutGroup } from "framer-motion";
import Header from '../../../layouts/Header';
import Footer from '../../../layouts/Footer';
import Sidebar from '../../../layouts/Sidebar';
import { Star, ChevronRight, ArrowRight } from 'lucide-react';
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";

// Navigation categories
const categories = [
  { id: "all", label: "Tất cả" },
  { id: "doing", label: "Đang thực hiện" },
  { id: "completed", label: "Đã hoàn thành" },
  { id: "cancelled", label: "Đã hủy" }
];

const getStatusConfig = (status) => {
  const configs = {
    completed: {
      color: "bg-[#11AA52]",
      text: "Complete"
    },
    doing: {
      color: "bg-[#F7B928]",
      text: "Đang thực hiện"
    },
    cancelled: {
      color: "bg-[#FF4842]",
      text: "Đã hủy"
    }
  };
  return configs[status];
};

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
          <main className="mx-auto w-full max-w-[1200px] px-8 py-8">
            <div className="w-full">
              {/* Navigation Tabs */}
              <div className="flex justify-center w-full mb-6">
                <div className="bg-white rounded-lg inline-flex">
                  <div className="flex items-center px-[10px] py-[6px]">
                    {categories.map((category, index) => (
                      <React.Fragment key={category.id}>
                        <button
                          className={`whitespace-nowrap rounded-lg transition-colors ${
                            activeCategory === category.id
                              ? 'bg-[#00A86B] text-white px-6 py-2'
                              : 'text-gray-400'
                          } font-['SVN-Gilroy'] text-base`}
                          onClick={() => setActiveCategory(category.id)}
                        >
                          {category.label}
                        </button>
                        {index < categories.length - 1 && <div className="w-[161px]" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booking Cards */}
              <div className="grid grid-cols-2 gap-8">
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
                      className={`relative overflow-hidden ${isActive ? "z-10" : "z-0"}`}
                    >
                      <Card className="w-full bg-white rounded-lg">
                        {activeCategory !== "all" && !isActive && (
                          <div className="absolute inset-0 z-10 bg-gray-200/40" />
                        )}

                        <CardHeader className="px-6 py-1">
                          <div className="flex items-center justify-between">
                            <div className="[font-family:'SVN-Gilroy-Bold',Helvetica] font-bold text-black text-[20px] leading-[26.3px] pt-2">
                              Ngày book đơn: {booking.date}
                            </div>
                            <Badge className={`${booking.statusColor} text-white [font-family:'SVN-Gilroy-Medium',Helvetica] font-medium text-[13px] leading-[26.3px] mt-2`}>
                              {booking.statusLabel}
                            </Badge>
                          </div>
                          <div className="[font-family:'SVN-Gilroy-Medium',Helvetica] font-medium text-[#8c8c8c] text-[13px] leading-[26.3px] mt-1">
                            Đơn hàng: {booking.orderNumber}
                          </div>
                          <div className="h-[0.75px] bg-[#006B52]/10 -mx-6 mt-4 mb-6" />
                        </CardHeader>

                        <CardContent className="px-6">
                          <div className="flex items-start gap-6 pt-8">
                            <div
                              className="w-[130px] h-[130px] bg-cover bg-center rounded-full"
                              style={{ backgroundImage: `url(${booking.caregiver.avatar})` }}
                            />
                            <div className="flex flex-col items-start gap-2 flex-1">
                              <div className="self-stretch [font-family:'SVN-Gilroy-Medium',Helvetica] font-medium text-black text-2xl leading-[28.8px]">
                                {booking.caregiver.name}
                              </div>
                              <div className="flex items-center gap-1 self-stretch">
                                <Star className="w-[15.31px] h-[15.31px] text-[#00a37d] fill-[#00a37d]" />
                                <div className="[font-family:'SVN-Gilroy-Bold',Helvetica] font-bold text-[14.2px] leading-[17.1px]">
                                  <span className="text-[#00a37d]">{booking.caregiver.rating}</span>
                                  <span className="text-[#111111]">&nbsp;</span>
                                  <span className="text-[#bcb9c5]">{booking.caregiver.ratingCount}</span>
                                </div>
                              </div>
                              <div className="self-stretch [font-family:'SVN-Gilroy-Medium',Helvetica] font-medium text-[#8c8c8c] text-[13px] leading-[26.3px]">
                                {booking.serviceName}
                              </div>
                              <div className="self-stretch [font-family:'SVN-Gilroy-Medium',Helvetica] font-medium text-[#008666] text-[13px] leading-[26.3px] underline cursor-pointer">
                                Đánh giá ngay
                              </div>
                              <div className="self-stretch text-right [font-family:'SVN-Gilroy-SemiBold',Helvetica] text-[#00a37d] text-[24px] font-semibold">
                                {booking.price}
                              </div>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="flex flex-col px-6 pb-2.5">
                          <div className="w-full h-[0.75px] bg-[#006B52] -mx-6" />
                          <div className="flex items-center justify-between w-full mt-4">
                            <div className="[font-family:'SVN-Gilroy-Medium',Helvetica] font-medium text-[#006B52] text-[13px] leading-[26.3px] cursor-pointer">
                              Xem chi tiết
                            </div>
                            <ArrowRight className="w-[21px] h-[21px] text-[#006B52] stroke-[1.5]" />
                          </div>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingHistory; 