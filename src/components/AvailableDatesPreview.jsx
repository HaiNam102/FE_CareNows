// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const AvailableDatesPreview = ({ careTakerId }) => {
//   const [availableDates, setAvailableDates] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     setAvailableDates([]);
    
//     if (!careTakerId) {
//       return;
//     }

//     console.log("AvailableDatesPreview: Fetching dates for caretaker ID:", careTakerId);
//     setIsLoading(true);
//     setError(null);

//     const fetchAvailableDates = async () => {
//       try {
//         const token = localStorage.getItem('token');
        
//         const response = await axios.get(`http://localhost:8080/api/calendar/caretaker/${careTakerId}`, {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         console.log("AvailableDatesPreview: API response received for ID:", careTakerId);

//         if (response.data && response.data.code === 1010 && Array.isArray(response.data.data)) {
//           const dates = response.data.data
//             .filter(item => item && item.day)
//             .map(item => {
//               if (!/^\d{4}-\d{2}-\d{2}$/.test(item.day)) {
//                 return null;
//               }

//               const [year, month, day] = item.day.split('-').map(Number);
//               const date = new Date(year, month - 1, day);

//               if (isNaN(date.getTime())) {
//                 return null;
//               }

//               return date;
//             })
//             .filter(date => date !== null);

//           console.log(`AvailableDatesPreview: Found ${dates.length} available dates for caretaker:`, careTakerId);
//           setAvailableDates(dates);
//         } else {
//           setError("Định dạng dữ liệu không hợp lệ");
//         }
//       } catch (error) {
//         console.error("AvailableDatesPreview: Error fetching dates:", error);
//         setError(error.response?.data?.message || "Không thể tải lịch của bảo mẫu");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAvailableDates();
//   }, [careTakerId]);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center my-4">
//         <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-emerald-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return <p className="text-red-500 mt-2">{error}</p>;
//   }

//   if (!availableDates.length) {
//     return <p className="text-gray-500 mt-2">Không có ngày làm việc nào được cấu hình</p>;
//   }

//   return (
//     <div className="mt-2">
//       <h3 className="text-lg font-semibold">Ngày làm việc có sẵn ({availableDates.length}):</h3>
//       <div className="flex flex-wrap gap-2 mt-2">
//         {availableDates.slice(0, 12).map((date, index) => (
//           <span key={index} className="bg-green-100 px-2 py-1 rounded-full text-sm text-green-800">
//             {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
//           </span>
//         ))}
//         {availableDates.length > 12 && (
//           <span className="text-green-600 text-sm">+{availableDates.length - 12} ngày khác</span>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AvailableDatesPreview; 