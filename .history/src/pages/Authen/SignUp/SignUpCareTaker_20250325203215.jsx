import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HoverButton from "../../../components/HoverButton";
import GoogleIcon from "../../../assets/Icon/Google.png";
import { toast } from 'react-toastify';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateField } from '../../../utils/validation';
import FormInput from '../../../components/Form/FormInput';
import { BASIC_CARE_OPTIONS, MEDICAL_SKILLS_OPTIONS } from '../../../constants/careTakerOptions';

const SignUpCareTaker = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    imgProfile: null,
    imgCccd: null,
    experienceYear: "",
    selectedOptionDetailIds: [],
    gender: "",
    dob: "",
    district: "",
    ward: "",
    address: "",
    workType: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    experienceYear: "",
    gender: "",
    dob: ""
  });

  const [selectedOptions, setSelectedOptions] = useState({
    basicCare: [],
    medicalSkills: []
  });

  // State cho checkbox đồng ý khóa học
  const [acceptTraining, setAcceptTraining] = useState(false);
  const [acceptTest, setAcceptTest] = useState(false);

  const validateExperienceYear = (value) => {
    if (value === "") return "Vui lòng nhập số năm kinh nghiệm";
    if (isNaN(value)) return "Số năm kinh nghiệm phải là số";
    if (value < 0) return "Số năm kinh nghiệm không thể âm";
    if (value > 50) return "Số năm kinh nghiệm không hợp lệ";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'experienceYear') {
      const error = validateExperienceYear(value);
      setErrors(prev => ({ ...prev, experienceYear: error }));
    } else {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const handleOptionSelect = (optionType, optionId) => {
    setSelectedOptions(prev => {
      const newSelection = prev[optionType].includes(optionId)
        ? prev[optionType].filter(id => id !== optionId)
        : [...prev[optionType], optionId];
      
      return { ...prev, [optionType]: newSelection };
    });

    // Cập nhật selectedOptionDetailIds trong formData
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        selectedOptionDetailIds: [
          ...selectedOptions.basicCare,
          ...selectedOptions.medicalSkills
        ]
      }));
    }, 0);
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.name || !formData.username || !formData.email || 
          !formData.phone || !formData.password || !formData.experienceYear ||
          !formData.gender || !formData.dob) {
        toast.error('Vui lòng điền đầy đủ thông tin!');
        return;
      }

      if (!formData.imgProfile || !formData.imgCccd) {
        toast.error('Vui lòng tải lên ảnh đại diện và CCCD!');
        return;
      }

      if (!acceptTraining || !acceptTest) {
        toast.error('Vui lòng đồng ý với điều khoản khóa học!');
        return;
      }

      const registerDTO = {
        userName: formData.username,
        password: formData.password,
        email: formData.email,
        phoneNumber: formData.phone,
        nameOfUser: formData.name,
        gender: formData.gender,
        dob: formData.dob,
        city: "Đà Nẵng",
        roleName: "CARE_TAKER",
        experienceYear: parseInt(formData.experienceYear),
        selectedOptionDetailIds: formData.selectedOptionDetailIds
      };

      const formDataToSend = new FormData();
      
      formDataToSend.append('registerDTO', 
        new Blob([JSON.stringify(registerDTO)], { type: 'application/json' })
      );

      formDataToSend.append('imgProfile', formData.imgProfile);
      formDataToSend.append('imgCccd', formData.imgCccd);

      const response = await axios.post(
        'http://localhost:8080/api/auths/register',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response.data.code === 20000) {
        toast.success('Đăng ký thành công!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        throw new Error(response.data.message || 'Đăng ký thất bại');
      }

    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký');
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate step 1
      if (!formData.name || !formData.username || !formData.email || 
          !formData.phone || !formData.password || !formData.gender || 
          !formData.dob || !formData.imgProfile || !formData.imgCccd ||
          !formData.experienceYear) {
        toast.error('Vui lòng điền đầy đủ thông tin!');
        return;
      }
    } else if (currentStep === 2) {
      // Validate step 2
      if (selectedOptions.basicCare.length === 0 && selectedOptions.medicalSkills.length === 0) {
        toast.error('Vui lòng chọn ít nhất một chuyên môn!');
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Typography classes
  const typographyClasses = {
    heading: "text-[24px] font-semibold text-gray-900",
    subheading: "text-[16px] font-medium text-[#8C8C8C]",
    input: "text-[16px] font-['SVN-Gilroy']"
  };

  // Input component styles
  const inputClassName = `w-full h-[52px] px-4 border rounded-[10px] ${typographyClasses.input} focus:outline-none`;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-[1024px] mx-auto pt-[40px] px-6 pb-[40px]">
        {/* Google sign in section - chỉ hiện ở step 1 */}
        {currentStep === 1 && (
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
        )}

        {/* Step 1: Thông tin cơ bản */}
        {currentStep === 1 && (
          <div className="space-y-8">
            {/* Thông tin cá nhân */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-[24px] font-semibold text-gray-900 mb-2">Thông tin cá nhân</h2>
              <p className="text-[16px] font-medium text-[#8C8C8C] mb-6">Hãy cho chúng tôi biết bạn là ai để kết nối tốt hơn!</p>
              <div className="space-y-4">
                <FormInput
                  label="Họ và tên"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên của bạn"
                  error={errors.name}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Ngày sinh"
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    error={errors.dob}
                  />

                  <div>
                    <label className="block text-[14px] font-medium text-gray-700 mb-1">
                      Giới tính
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full h-[52px] px-4 border rounded-[10px] text-[16px] font-['SVN-Gilroy'] focus:outline-none"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[14px] font-medium text-gray-700 mb-1">
                      Ảnh đại diện
                    </label>
                    <input
                      type="file"
                      name="imgProfile"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium text-gray-700 mb-1">
                      Ảnh CCCD
                    </label>
                    <input
                      type="file"
                      name="imgCccd"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin tài khoản */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-[24px] font-semibold text-gray-900 mb-2">Thông tin tài khoản</h2>
              <p className="text-[16px] font-medium text-[#8C8C8C] mb-6">Bảo vệ tài khoản của bạn với thông tin đăng nhập</p>
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

            {/* Thông tin liên hệ */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-[24px] font-semibold text-gray-900 mb-2">Thông tin liên hệ</h2>
              <p className="text-[16px] font-medium text-[#8C8C8C] mb-6">Chúng tôi sẽ liên hệ với bạn qua thông tin này</p>
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

            {/* Tùy chọn công việc */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-[24px] font-semibold text-gray-900 mb-2">Tùy chọn công việc</h2>
              <p className="text-[16px] font-medium text-[#8C8C8C] mb-6">Chọn khu vực làm việc phù hợp với bạn</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[14px] font-medium text-gray-700 mb-1">
                      Quận
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full h-[52px] px-4 border rounded-[10px] text-[16px] font-['SVN-Gilroy'] focus:outline-none"
                    >
                      <option value="">Chọn quận</option>
                      {/* Add district options */}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium text-gray-700 mb-1">
                      Phường
                    </label>
                    <select
                      name="ward"
                      value={formData.ward}
                      onChange={handleChange}
                      className="w-full h-[52px] px-4 border rounded-[10px] text-[16px] font-['SVN-Gilroy'] focus:outline-none"
                    >
                      <option value="">Chọn phường</option>
                      {/* Add ward options */}
                    </select>
                  </div>
                </div>

                <FormInput
                  label="Địa chỉ cụ thể"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ cụ thể"
                />

                <div>
                  <label className="block text-[14px] font-medium text-gray-700 mb-1">
                    Loại hình làm việc mong muốn
                  </label>
                  <select
                    name="workType"
                    value={formData.workType}
                    onChange={handleChange}
                    className="w-full h-[52px] px-4 border rounded-[10px] text-[16px] font-['SVN-Gilroy'] focus:outline-none"
                  >
                    <option value="">Chọn loại hình làm việc</option>
                    {/* Add work type options */}
                  </select>
                </div>

                <FormInput
                  label="Số năm kinh nghiệm"
                  type="number"
                  name="experienceYear"
                  value={formData.experienceYear}
                  onChange={handleChange}
                  placeholder="Nhập số năm kinh nghiệm của bạn"
                  error={errors.experienceYear}
                  min="0"
                  max="50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Chọn các options chuyên môn */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-[24px] font-semibold text-gray-900 mb-2">Thông tin chuyên môn</h2>
            <p className="text-[16px] font-medium text-[#8C8C8C] mb-6">Hãy cho chúng tôi biết về chuyên môn của bạn</p>
            <div className="space-y-4">
              <div>
                <label className="block text-[16px] font-semibold text-gray-900 mb-4">
                  Chuyên môn cơ bản
                </label>
                <div className="space-y-3">
                  {BASIC_CARE_OPTIONS.map(option => (
                    <div key={option.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedOptions.basicCare.includes(option.id)}
                        onChange={() => handleOptionSelect('basicCare', option.id)}
                        className="h-4 w-4 text-teal-600 rounded border-gray-300"
                      />
                      <label className="ml-2 text-[14px] text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[16px] font-semibold text-gray-900 mb-4">
                  Kỹ năng y tế
                </label>
                <div className="space-y-3">
                  {MEDICAL_SKILLS_OPTIONS.map(option => (
                    <div key={option.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedOptions.medicalSkills.includes(option.id)}
                        onChange={() => handleOptionSelect('medicalSkills', option.id)}
                        className="h-4 w-4 text-teal-600 rounded border-gray-300"
                      />
                      <label className="ml-2 text-[14px] text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Cam kết công việc */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-[24px] font-semibold text-gray-900 mb-2">Cam kết công việc</h2>
            <p className="text-[16px] font-medium text-[#8C8C8C] mb-6">
              Hoàn thành các cam kết để trở thành Chuyên viên chăm sóc của CareNow
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={acceptTraining}
                  onChange={(e) => setAcceptTraining(e.target.checked)}
                  className="h-4 w-4 text-teal-600 rounded border-gray-300"
                />
                <label className="ml-2 text-[14px] text-gray-700">
                  Có, tôi đồng ý tham gia khóa đào tạo.
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={acceptTest}
                  onChange={(e) => setAcceptTest(e.target.checked)}
                  className="h-4 w-4 text-teal-600 rounded border-gray-300"
                />
                <label className="ml-2 text-[14px] text-gray-700">
                  Có, tôi cam kết hoàn thành bài kiểm tra sau khóa học.
                </label>
              </div>

              <p className="text-[12px] text-gray-500 italic">
                *Các thông tin chuyên môn của bạn sẽ được admin kiểm duyệt sau khóa đào tạo
              </p>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between w-[900px] mx-auto">
          {currentStep > 1 && (
            <HoverButton 
              text="Quay lại" 
              onClick={handlePrevStep}
              variant="secondary"
              className="w-[160px]"
              showArrow={false}
            />
          )}
          
          {currentStep < 3 ? (
            <HoverButton 
              text="Tiếp tục" 
              onClick={handleNextStep}
              className="w-[160px] ml-auto"
              showArrow={false}
            />
          ) : (
            <HoverButton 
              text="Hoàn thành" 
              onClick={handleSubmit}
              className="w-[160px] ml-auto"
              showArrow={false}
            />
          )}
        </div>

        {/* Progress indicator */}
        <div className="w-[900px] mx-auto mt-6 flex justify-center gap-2">
          {[1, 2, 3].map(step => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full ${
                step === currentStep
                  ? 'bg-teal-500'
                  : step < currentStep
                  ? 'bg-teal-200'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default SignUpCareTaker; 