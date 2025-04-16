import React from "react";

const ServiceHighlights = () => {
  const highlights = [
    {
      image: "/images/professional-team.jpg",
      title: "Đội ngũ chuyên nghiệp, được đào tạo bài bản",
      description: [
        "Những bảo mẫu của CareNow đều trải qua các khóa đào tạo nội bộ và kiểm tra kỹ năng định kì",
        "Đảm bảo khả năng chăm sóc từ cơ bản đến các trường hợp đặc biệt."
      ]
    },
    {
      image: "/images/flexible-service.jpg",
      title: "Dịch vụ linh hoạt",
      description: [
        "Bạn có thể đặt lịch chăm sóc người thân bất cứ lúc nào 24/24",
        "Tất cả các chuyên viên chăm sóc đều được phải trải qua đào tạo từ các Bác sĩ đầu ngành."
      ]
    },
    {
      image: "/images/user-experience.jpg",
      title: "Trải nghiệm người dùng tối ưu",
      description: [
        "Giao diện dễ sử dụng",
        "Bộ lọc thông minh giúp bạn nhanh chóng tìm ra bảo mẫu phù hợp dựa trên chuyên môn, kinh nghiệm, khu vực làm việc và trạng thái trực."
      ]
    }
  ];

  return (
    <div className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-[170px]">
          {highlights.map((item, index) => (
            <div key={index} className="flex flex-col items-start">
              <div className="w-full aspect-square mb-6 overflow-hidden rounded-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-[#1A4942] text-xl md:text-2xl font-bold mb-4 font-serif">
                {item.title}
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                {item.description.map((desc, idx) => (
                  <li key={idx} className="text-gray-700 text-base">
                    {desc}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceHighlights; 