import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faHeart } from '@fortawesome/free-solid-svg-icons';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image1 from "../assets/images/imageService1.png";
import Image2 from "../assets/images/imageService2.png";
import Image3 from "../assets/images/imageService3.png";

const CareNowRegistration = () => {
  useEffect(() => {
    // Khởi tạo AOS sau khi component được mount
    AOS.init({
      duration: 750,      // Thời gian mặc định cho animation (ms)
      once: false,         // Đặt thành true nếu bạn chỉ muốn animation chạy một lần
      mirror: true,        // Animation sẽ được mirror khi scroll lên
      offset: 100,         // Offset (tính bằng px) từ trigger point
      delay: 0,            // Giá trị delay mặc định
      easing: 'ease-in-out', // Kiểu easing
    });

    // Re-initialize AOS khi window resize
    window.addEventListener('resize', () => {
      AOS.refresh();
    });
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 text-gray-800 font-['SVN-Gilroy']">
      <div className="w-full px-4 py-8">
        <div className="border-b pb-4 mb-8" data-aos="fade-down">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => scrollToSection('professional-team')}
          >
            <div>
              <h1 className=" text-[25px] font-bold  font-[400]">Tại sao chọn CareNow?</h1>
              <p className="text-[20px]">Dịch vụ chăm sóc được đào tạo chuyên môn bởi các bác sĩ điều ngành.</p>
            </div>
            <FontAwesomeIcon icon={faChevronDown} className="text-gray-500" />
          </div>
        </div>

        <div className="border-b pb-4 mb-8" data-aos="fade-down" data-aos-delay="200">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => scrollToSection('registration-steps')}
          >
            <div>
              <h1 className=" font-bold text-[24px]">Cách đăng ký bảo mẫu?</h1>
              <p className=" text-[20px]">
                Đăng ký nhanh, làm việc linh hoạt.
                <FontAwesomeIcon icon={faHeart} className="animate-pulse" />
              </p>
            </div>
            <FontAwesomeIcon icon={faChevronDown} className="text-gray-500" />
          </div>
        </div>

        {/* Hiệu ứng bậc thang - lưu ý mỗi div có margin-top khác nhau */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div id="professional-team" className="text-center md:mt-0" data-aos="fade-up">
            <img
              src={Image1}
              alt="A professional nurse smiling in a white coat"
              className="mb-4"
              data-aos="zoom-in"
              data-aos-delay="300"
              width={300}
              height={400}
            />
            <h2 className="text-xl text-left font-bold mb-2 text-[25px]">Đội ngũ chuyên nghiệp, được đào tạo bài bản</h2>
            <ul className="text-left list-disc list-inside text-[20px]">
              <li data-aos="fade-left" data-aos-delay="400">Những bảo mẫu của CareNow đều trải qua các khóa đào tạo sát hạch và kiểm tra kỹ năng định kỳ.</li>
              <li data-aos="fade-left" data-aos-delay="600">Đảm bảo khả năng chăm sóc tối ưu bản đến các trường hợp đặc biệt.</li>
            </ul>
          </div>

          <div className="text-center md:mt-24" data-aos="fade-up" data-aos-delay="200">
            <img
              src={Image2}
              alt="A nurse providing care to a patient"
              className="mb-4"
              data-aos="zoom-in"
              data-aos-delay="500"
              width={300}
              height={400}
            />
            <h2 className="text-xl text-left font-bold mb-2 text-[25px]">Dịch vụ linh hoạt</h2>
            <ul className="text-left list-disc list-inside text-[20px]">
              <li data-aos="fade-left" data-aos-delay="600">Bạn có thể đặt lịch chăm sóc người thân bất cứ lúc nào 24/24.</li>
              <li data-aos="fade-left" data-aos-delay="800">Đội ngũ chuyên viên chăm sóc đa dạng, được phổ biến đào tạo từ các bác sĩ điều ngành.</li>
            </ul>
          </div>

          <div className="text-center md:mt-48" data-aos="fade-up" data-aos-delay="400">
            <img
              // src="https://storage.googleapis.com/a1aa/image/cFQzbxrtvUIUATGUN7vmMZmgx7zLpaG71FLDSIn18Y8.jpg" 
              src={Image3}
              alt="An elderly person enjoying a cup of tea"
              className="mb-4"
              data-aos="zoom-in"
              data-aos-delay="700"
              width={300}
              height={400}
            />
            <h2 className="text-xl text-left font-bold mb-2 text-[25px]">Trải nghiệm người dùng tối ưu</h2>
            <ul className="text-left list-disc list-inside text-[20px]">
              <li data-aos="fade-left" data-aos-delay="800">Ứng dụng dễ sử dụng.</li>
              <li data-aos="fade-left" data-aos-delay="1000">Đội ngũ hỗ trợ luôn sẵn sàng giải đáp thắc mắc của bạn.</li>
            </ul>
          </div>
        </div>

        <div id="registration-steps" className="w-full mb-16" data-aos="fade-in" data-aos-duration="1500">
          <h2 className="text-2xl font-bold mb-8  text-[42px]" data-aos="fade-up" data-aos-duration="1000">Cách thức đăng ký trở thành bảo mẫu trên CareNow</h2>
          <div className="space-y-8">
          <div className="flex items-start justify-end" data-aos="fade-right" data-aos-duration="1200">
  <div className="flex flex-col items-center">
    <div className="text-3xl font-bold text-[#00DBA8]" data-aos="bounce" data-aos-delay="200">
      01
    </div>
    <div className="h-80 w-0.5 bg-[#00DBA8] mt-2"></div> {/* Tăng h-40 lên h-80 */}
  </div>

  <div className="w-1/2 pl-5">
    <h3 className="text-xl font-bold mb-2 text-[25px]">Đăng ký tài khoản</h3>
    <p className="mb-2 text-[20px]">Truy cập website hoặc tải ứng dụng CareNow, sau đó chọn "Đăng ký bảo mẫu" để bắt đầu. Bạn cần cung cấp:</p>
    <ul className="list-disc list-inside text-[20px]">
      <li data-aos="fade-up" data-aos-delay="300">Thông tin cá nhân: Họ tên, ngày sinh, số điện thoại, email.</li>
      <li data-aos="fade-up" data-aos-delay="400">Khu vực làm việc: Chọn tỉnh/thành phố nơi bạn muốn nhận việc.</li>
      <li data-aos="fade-up" data-aos-delay="500">Loại dịch vụ: Chăm sóc tại nhà, tại bệnh viện, hỗ trợ, chăm sóc đặc biệt,...</li>
    </ul>
  </div>
</div>

<div className="flex items-start justify-start" data-aos="fade-left" data-aos-duration="1200">
  <div className="flex flex-col items-center">
    <div className="text-3xl font-bold text-[#00DBA8]" data-aos="bounce" data-aos-delay="200">02</div>
    <div className="h-80 w-0.5 bg-[#00DBA8] mt-2"></div> 
  </div>

  <div className="w-1/2 pl-5">
    <h3 className="text-xl font-bold mb-2 text-[25px]">Hoàn thiện hồ sơ cá nhân</h3>
    <p className="mb-2 text-[20px]">Sau khi tạo tài khoản, bạn cần bổ sung các giấy tờ và thông tin cần thiết để xác thực danh tính và chuyên môn. Các giấy tờ cần có:</p>
    <ul className="list-disc list-inside text-[20px]">
      <li data-aos="fade-up" data-aos-delay="300">CMND/CCCD hoặc hộ chiếu (Còn hiệu lực).</li>
      <li data-aos="fade-up" data-aos-delay="400">Ảnh chân dung rõ mặt (Để tạo hồ sơ chuyên nghiệp).</li>
      <li data-aos="fade-up" data-aos-delay="500">Bằng cấp/chứng nhận chuyên môn (Nếu có, ví dụ: chứng chỉ điều dưỡng, hộ lý, y tá...).</li>
      <li data-aos="fade-up" data-aos-delay="600">Kinh nghiệm làm việc: Số năm kinh nghiệm, nơi từng làm việc, kỹ năng đặc biệt.</li>
    </ul>
  </div>
</div>

<div className="flex items-start justify-end" data-aos="fade-right" data-aos-duration="1200">
  <div className="flex flex-col items-center">
    <div className="text-3xl font-bold text-[#00DBA8]" data-aos="bounce" data-aos-delay="200">03</div>
    <div className="h-80 w-0.5 bg-[#00DBA8] mt-2"></div> 
  </div>

  <div className="w-1/2 pl-5">
    <h3 className="text-xl font-bold mb-2 text-[25px]">Kiểm duyệt & Đào tạo</h3>
    <p className="mb-2 text-[20px]">CareNow sẽ xem xét hồ sơ của bạn trong 1-3 ngày làm việc. Nếu hồ sơ đạt yêu cầu, bạn sẽ nhận được thông báo qua email/SMS.</p>
    <p className="mb-2 text-[20px]">Nếu cần bổ sung, đội ngũ CareNow sẽ hướng dẫn bạn cập nhật hồ sơ nhanh chóng.</p>
    <p className="mb-2 text-[20px]">Khóa đào tạo chuyên môn:</p>
    <ul className="list-disc list-inside text-[20px]">
      <li data-aos="fade-up" data-aos-delay="300">Cung cấp kiến thức về chăm sóc bệnh nhân, xử lý tình huống, giao tiếp chuyên nghiệp.</li>
      <li data-aos="fade-up" data-aos-delay="400">Hướng dẫn thực hành các kỹ năng cần thiết.</li>
      <li data-aos="fade-up" data-aos-delay="500">Kiểm tra đánh giá để đảm bảo chất lượng bảo mẫu.</li>
    </ul>
  </div>
</div>

<div className="flex items-start justify-start" data-aos="fade-left" data-aos-duration="1200">
  <div className="flex flex-col items-center">
    <div className="text-3xl font-bold text-[#00DBA8]" data-aos="bounce" data-aos-delay="200">04</div>
    <div className="h-60 w-0.5 bg-[#00DBA8] mt-2"></div> 
  </div>

  <div className="w-1/2 pl-5">
    <h3 className="text-xl font-bold mb-2 text-[25px]">Bắt đầu nhận việc & kiếm thu nhập</h3>
    <p className="mb-2 text-[20px]">Sau khi được duyệt, bạn có thể:</p>
    <ul className="list-disc list-inside text-[20px]">
      <li data-aos="fade-up" data-aos-delay="300">Chủ động nhận đơn hàng từ khách hàng trong khu vực.</li>
      <li data-aos="fade-up" data-aos-delay="400">Xem lịch làm việc & sắp xếp ca trực linh hoạt theo thời gian rảnh.</li>
      <li data-aos="fade-up" data-aos-delay="500">Nhận thanh toán minh bạch & theo dõi thu nhập ngay trên ứng dụng.</li>
    </ul>
  </div>
</div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CareNowRegistration;