import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HoverButton from "../../../components/HoverButton";
import GoogleIcon from "../../../assets/Icon/Google.png"
import { toast } from 'react-toastify';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateField } from '../../../utils/validation';
import { DANANG_DISTRICTS, DANANG_WARDS } from '../../../constants/locations';
import FormInput from '../../../components/Form/FormInput';
import FormSelect from '../../../components/Form/FormSelect';




const SignUpClient = () => {
  const navigate = useNavigate();
  
  // Thêm state cho districts
  const [availableDistricts, setAvailableDistricts] = useState([]);
  
  // State hiện tại
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    district: "",
    ward: "",
    address: "",
    password: "",
    imgProfile: null,
    imgCccd: null,
    careRecipient: {
      name: "",
      gender: "",
      phoneNumber: "",
      yearOld: "",
      specialDetail: ""
    }
  });

  // Thêm state để track lỗi
  const [errors, setErrors] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    district: "",
    ward: "",
    address: "",
    password: "",
    careRecipient: {
      name: "",
      gender: "",
      phoneNumber: "",
      yearOld: "",
      specialDetail: ""
    }
  });

  // Thêm state để lưu danh sách phường theo quận
  const [availableWards, setAvailableWards] = useState([]);

  // Thêm state cho checkbox
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Thêm state để theo dõi trạng thái kết nối server
  const [isServerConnected, setIsServerConnected] = useState(false);

  // Thay đổi BASE_URL
  const BASE_URL = 'http://localhost:8080/api';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'district') {
      setFormData(prev => ({ ...prev, ward: '' }));
      // Lấy danh sách phường dựa trên quận được chọn
      const wardsList = DANANG_WARDS[value] || [];
      setAvailableWards(wardsList);
    }
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleCareRecipientChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      careRecipient: {
        ...prev.careRecipient,
        [name]: value
      }
    }));
  };

  // Hàm xử lý đăng ký
  const handleSubmit = async () => {
    try {
      // Validation
      if (!formData.name || !formData.username || !formData.email || 
          !formData.phone || !formData.district || !formData.password ||
          !formData.careRecipient.name || !formData.careRecipient.gender ||
          !formData.careRecipient.yearOld) {
        toast.error('Vui lòng điền đầy đủ thông tin!');
        return;
      }

      // Tạo registerDTO với thông tin care recipient
      const registerDTO = {
        userName: formData.username,
        password: formData.password,
        email: formData.email,
        phoneNumber: formData.phone,
        nameOfUser: formData.name,
        city: "Đà Nẵng",
        district: formData.district,
        ward: formData.ward,
        address: formData.address,
        roleName: "Customer",
        experienceYear: 0,
        // Thêm thông tin care recipient
        careRecipient: {
          name: formData.careRecipient.name,
          gender: formData.careRecipient.gender,
          yearOld: parseInt(formData.careRecipient.yearOld),
          specialDetail: formData.careRecipient.specialDetail || "",
          phoneNumber: formData.careRecipient.phoneNumber || ""
        }
      };

      // Tạo FormData để gửi file
      const formDataToSend = new FormData();
      
      // Thêm registerDTO dưới dạng JSON Blob
      formDataToSend.append('registerDTO', 
        new Blob([JSON.stringify(registerDTO)], { type: 'application/json' })
      );

      // Thêm các file nếu có
      if (formData.imgProfile) {
        formDataToSend.append('imgProfile', formData.imgProfile);
      }
      if (formData.imgCccd) {
        formDataToSend.append('imgCccd', formData.imgCccd);
      }

      // Gửi request với Content-Type: multipart/form-data
      const response = await axios.post(
        'http://localhost:8080/api/auths/register',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      console.log("Server Response:", response.data);

      if (response.data.code === 20000) {
        // Sau khi đăng ký customer thành công, gửi thông tin care recipient
        const customerId = response.data.customerId; // Giả sử server trả về customerId
        
        if (customerId) {
          // Thêm customerId vào careRecipientDTO
          careRecipientDTO.customerId = customerId;
          
          // Gửi request thứ 2 để tạo care recipient
          const careRecipientResponse = await axios.post(
            'http://localhost:8080/api/care-recipients/create',
            careRecipientDTO
          );
          
          console.log("Care Recipient Response:", careRecipientResponse.data);
        }

        toast.success('Đăng ký thành công!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        throw new Error(response.data.message || 'Đăng ký thất bại');
      }

    } catch (error) {
      console.error('Registration error:', error);
      console.log('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký');
    }
  };

  // Thêm xử lý file upload
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  // Disable nút Hoàn thành khi không có kết nối server
  const isSubmitDisabled = !isServerConnected || Object.values(errors).some(Boolean);

  // Style function cho input dựa trên trạng thái validation
  const getInputClassName = (fieldName) => {
    const baseStyle = "w-full h-[52px] px-4 border rounded-[10px] text-[16px] font-['SVN-Gilroy'] focus:outline-none";

    // Thêm class cho autofill dựa trên validation
    const autofillClass = !formData[fieldName] 
      ? 'autofill-white' 
      : errors[fieldName] 
        ? 'autofill-red' 
        : 'autofill-green';

    if (!formData[fieldName]) {
      return `${baseStyle} border-[#E6E6E6] ${autofillClass}`;
    }
    
    if (errors[fieldName]) {
      return `${baseStyle} border-red-500 !bg-red-50 ${autofillClass}`;
    }

    return `${baseStyle} border-[#60BAA1] !bg-[#E7FFF9] ${autofillClass}`;
  };

  // Cập nhật style global cho autofill
  const globalStyles = `
    <style>
      /* Style cho trường rỗng */
      .autofill-white:-webkit-autofill,
      .autofill-white:-webkit-autofill:hover,
      .autofill-white:-webkit-autofill:focus,
      .autofill-white:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px white inset !important;
        transition: background-color 5000s ease-in-out 0s;
      }

      /* Style cho trường có lỗi */
      .autofill-red:-webkit-autofill,
      .autofill-red:-webkit-autofill:hover,
      .autofill-red:-webkit-autofill:focus,
      .autofill-red:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px #FEF2F2 inset !important;
        transition: background-color 5000s ease-in-out 0s;
      }

      /* Style cho trường hợp lệ */
      .autofill-green:-webkit-autofill,
      .autofill-green:-webkit-autofill:hover,
      .autofill-green:-webkit-autofill:focus,
      .autofill-green:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px #E7FFF9 inset !important;
        transition: background-color 5000s ease-in-out 0s;
      }
    </style>
  `;

  // Thêm style global vào head
  useEffect(() => {
    document.head.insertAdjacentHTML('beforeend', globalStyles);
    return () => {
      const style = document.head.lastElementChild;
      if (style?.tagName === 'STYLE') {
        style.remove();
      }
    };
  }, []);


  // Thêm useEffect để load districts
  useEffect(() => {
    // Lấy danh sách quận từ constants
    const districtNames = DANANG_DISTRICTS.map(district => district.name);
    setAvailableDistricts(districtNames);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-[1024px] mx-auto pt-[40px] px-6 pb-[40px]">
        

        <div className="flex flex-col items-center mb-6">
          <button className="inline-flex items-center justify-center gap-2 h-[44px] px-8 bg-[#4285F4] text-white rounded-[60px] font-['SVN-Gilroy'] hover:bg-[#3367D6] transition-colors w-full max-w-[360px]">
            <img src={GoogleIcon} alt="Google" className="w-6 h-6" />
            Đăng nhập bằng google
          </button>
          
          <div className="flex items-center w-full max-w-[400px] my-6">
            <div className="flex-1 h-[1px] bg-[#E6E6E6]"></div> 
            <span className="px-4 text-[14px] font-['SVN-Gilroy'] text-[#60BAA1]">hoặc</span>
            <div className="flex-1 h-[1px] bg-[#E6E6E6]"></div>
          </div>
        </div>

        <div className="mb-8 bg-white rounded-lg p-8 shadow-sm w-[900px] mx-auto">
          <h2 className="text-[24px] font-semibold text-gray-900 mb-2">Thông tin cá nhân</h2>
          <p className="text-[16px] font-medium text-[#8c8c8c] mb-6">Hãy cho chúng tôi biết bạn là ai để kết nối tốt hơn!</p>
          
          <FormInput
            label="Tên của bạn"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập họ và tên của bạn"
            error={errors.name}
          />
        </div>

        <div className="mb-8 bg-white rounded-lg p-8 shadow-sm w-[900px] mx-auto">
          <h2 className="text-[24px] font-semibold text-gray-900 mb-2">Thông tin tài khoản</h2>
          <p className="text-[16px] font-medium text-[#8c8c8c] mb-6">Bảo vệ tài khoản của bạn với một tên đăng nhập và mật khẩu an toàn</p>
          
          <div className="space-y-4">
            <FormInput
              label="Tên đăng nhập"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập"
              error={errors.username}
            />

            <FormInput
              label="Mật khẩu"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              error={errors.password}
            />
          </div>
        </div>

        <div className="mb-8 bg-white rounded-lg p-8 shadow-sm w-[900px] mx-auto">
          <h2 className="text-[24px] font-semibold text-gray-900 mb-2">Thông tin liên hệ</h2>
          <p className="text-[16px] font-medium text-[#8c8c8c] mb-6">Chúng tôi sẽ liên hệ với bạn qua email hoặc số điện thoại này</p>
          
          <div className="space-y-4">
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              error={errors.email}
            />

            <FormInput
              label="Số điện thoại"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              error={errors.phone}
            />
          </div>
        </div>

        <div className="mb-8 bg-white rounded-lg p-8 shadow-sm w-[900px] mx-auto">
          <h2 className="text-[24px] font-semibold text-gray-900 mb-2">Địa chỉ nhà</h2>
          <p className="text-[16px] font-medium text-[#8c8c8c] mb-6">Ngôi nhà là nơi hành trình bắt đầu – hãy nhập địa chỉ của bạn chính xác!</p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                label="Quận"
                name="district"
                value={formData.district}
                onChange={handleChange}
                options={availableDistricts}
                placeholder="Chọn quận"
                error={errors.district}
              />

              <FormSelect
                label="Phường"
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                options={availableWards}
                placeholder="Chọn phường"
                error={errors.ward}
                disabled={!formData.district}
              />
            </div>

            <FormInput
              label="Địa chỉ cụ thể"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Số nhà, tên đường..."
              error={errors.address}
            />
          </div>
        </div>

        <div className="mb-8 bg-white rounded-lg p-8 shadow-sm w-[900px] mx-auto">
          <h2 className="text-[24px] font-semibold text-gray-900 mb-2">Thông tin người cần chăm sóc</h2>
          <p className="text-[16px] font-medium text-[#8c8c8c] mb-6">
            Vui lòng cung cấp thông tin về người cần được chăm sóc
          </p>
          
          <div className="space-y-4">
            <FormInput
              label="Họ và tên người cần chăm sóc"
              type="text"
              name="name"
              value={formData.careRecipient.name}
              onChange={handleCareRecipientChange}
              placeholder="Nhập họ và tên"
              error={errors.careRecipient.name}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                label="Giới tính"
                name="gender"
                value={formData.careRecipient.gender}
                onChange={handleCareRecipientChange}
                options={[
                  { value: "MALE", label: "Nam" },
                  { value: "FEMALE", label: "Nữ" }
                ]}
                placeholder="Chọn giới tính"
                error={errors.careRecipient.gender}
              />

              <FormInput
                label="Tuổi"
                type="number"
                name="yearOld"
                value={formData.careRecipient.yearOld}
                onChange={handleCareRecipientChange}
                placeholder="Nhập tuổi"
                error={errors.careRecipient.yearOld}
              />
            </div>

            <FormInput
              label="Số điện thoại"
              type="tel"
              name="phoneNumber"
              value={formData.careRecipient.phoneNumber}
              onChange={handleCareRecipientChange}
              placeholder="Nhập số điện thoại"
              error={errors.careRecipient.phoneNumber}
            />

            <div>
              <label className="block text-[14px] font-medium text-gray-700 mb-1">
                Chi tiết đặc biệt
              </label>
              <textarea
                name="specialDetail"
                value={formData.careRecipient.specialDetail}
                onChange={handleCareRecipientChange}
                placeholder="Nhập các thông tin đặc biệt cần lưu ý (bệnh lý, thói quen, ...)"
                className="w-full px-4 py-2 border rounded-[10px] min-h-[100px]"
              />
            </div>
          </div>
        </div>

        <div className="mb-6 w-[900px] mx-auto">
          <div className="flex items-start gap-2 mb-6">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1.5 h-4 w-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
            />
            <p className="text-[14px] font-['SVN-Gilroy'] text-[#4D4D4D]">
              Tôi hiểu và đồng ý với Điều khoản Dịch vụ của{" "}
              <span className="text-teal-500">CareNow</span>, bao gồm{" "}
              <span className="text-teal-500">Thỏa thuận Người dùng</span> và{" "}
              <span className="text-teal-500">Chính sách Quyền riêng tư</span>.
            </p>
          </div>

          <div className="flex justify-between">
            <HoverButton 
              text="Quay lại" 
              size="medium" 
              showArrow={false} 
              onClick={() => navigate(-1)}
              variant="secondary"
              className="w-[160px]"
            />
            <HoverButton 
              text="Hoàn thành" 
              size="medium" 
              showArrow={false} 
              onClick={handleSubmit}
              className="w-[160px]"
              disabled={isSubmitDisabled}
            />
          </div>
        </div>
        
        <ToastContainer />
      </div>
    </div>
  );
};

export default SignUpClient;
