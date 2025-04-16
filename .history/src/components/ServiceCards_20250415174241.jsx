import React from "react";

const ServiceCards = () => {
  const services = [
    {
      title: "Hỗ trợ sinh hoạt, ăn uống, vệ sinh, phục hồi",
      label: "Chăm sóc tại nhà",
      isBottomText: false,
    },
    {
      title: "Theo dõi sức khỏe, hỗ trợ điều dưỡng",
      label: "Chăm sóc bệnh viện",
      isBottomText: true,
    },
    {
      title: "Giám sát và hỗ trợ y tế cơ bản",
      label: "Chăm sóc người cao tuổi",
      isBottomText: false,
    },
    {
      title: "Hỗ trợ thủ tục hành chính tại bệnh viện",
      label: "Hỗ trợ",
      isBottomText: true,
    },
  ];

  return (
    <div className="bg-gray-100 flex justify-center items-center w-full pb-10 border-b">
      <div className="flex flex-wrap justify-center md:justify-between w-full max-w-7xl gap-4 ">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-[#A7BDAF] rounded-lg shadow-md flex flex-col justify-between p-4 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)] h-auto min-h-64 md:h-72 mb-4 md:mb-0"
          >
            {!service.isBottomText && (
              <p className="text-[#1A4942] text-lg md:text-xl lg:text-[23px] font-normal leading-tight md:leading-[28.80px] font-sans md:font-[SVN-Gilroy] text-left border-b pb-1">
                — {service.label}
              </p>
            )}
            <div className="bg-[#D6DCD7] p-4 md:p-6 flex items-center justify-center flex-1 rounded-md mt-2">
              <p className="text-[#1A4942] text-xl md:text-2xl lg:text-[25px] font-bold leading-tight md:leading-[38.40px] font-serif md:font-[Playfair] text-center">
                {service.title}
              </p>
            </div>
            {service.isBottomText && (
              <p className="text-[#1A4942] text-lg md:text-xl lg:text-[24px] font-normal leading-tight md:leading-[28.80px] font-sans md:font-[SVN-Gilroy] text-left border-t pt-1 mt-2">
                — {service.label}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCards;