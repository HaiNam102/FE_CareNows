import React, { useState } from 'react';
import Header from '../../../layouts/Header';
import Footer from '../../../layouts/Footer';
import Sidebar from '../../../layouts/Sidebar';

const BookingHistory = () => {
  const [bookings] = useState([
    {
      id: 1,
      serviceName: "Chăm sóc da mặt",
      date: "28/02/2024",
      time: "09:00",
      status: "Đã hoàn thành",
      price: "500.000đ",
      location: "15 Trưng Nghĩa 2, Hòa Minh, Liên Chiểu"
    },
    {
      id: 2,
      serviceName: "Massage body",
      date: "01/03/2024",
      time: "14:30",
      status: "Đã đặt lịch",
      price: "400.000đ",
      location: "Bệnh viện Đà Nẵng, 124 Hải Phòng"
    }
  ]);

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

              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-[8px] p-6 border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold font-['SVN-Gilroy'] mb-2">{booking.serviceName}</h3>
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
                      <div className="text-right">
                        <p className="text-xl font-semibold font-['SVN-Gilroy'] text-[rgb(0,107,82)]">
                          {booking.price}
                        </p>
                        <p className={`mt-2 px-3 py-1 rounded-full text-sm font-['SVN-Gilroy'] inline-block
                          ${booking.status === "Đã hoàn thành" 
                            ? "bg-[rgb(0,107,82)]/10 text-[rgb(0,107,82)]" 
                            : "bg-blue-50 text-blue-600"}`}>
                          {booking.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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