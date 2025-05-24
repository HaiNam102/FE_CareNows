import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HoverButton from "../../../components/HoverButton";
import GoogleIcon from "../../../assets/Icon/Google.png";
import { toast } from 'react-toastify';
import api from '../../../services/api';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateField } from '../../../utils/validation';
import FormInput from '../../../components/Form/FormInput';
import { BASIC_CARE_OPTIONS, MEDICAL_SKILLS_OPTIONS } from '../../../constants/careTakerOptions';
import { DANANG_DISTRICTS, DANANG_WARDS } from '../../../constants/locations';

const SignUpCareTaker = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    imgProfile: null,
    imgCccd: null,
    experienceYear: "",
    selectedOptionDetailIds: [],
    district: "",
    ward: "",
    workableArea: "",
    introduceYourself: "",
    servicePrice: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    experienceYear: "",
    gender: "",
    dob: "",
    district: "",
    ward: "",
    workableArea: "",
    introduceYourself: "",
    servicePrice: ""
  });

  const [imagePreviews, setImagePreviews] = useState({
    imgProfile: null,
    imgCccd: null
  });

  const [selectedOptions, setSelectedOptions] = useState({
    basicCare: [],
    medicalSkills: []
  });

  const [acceptTraining, setAcceptTraining] = useState(false);
  const [acceptTest, setAcceptTest] = useState(false);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return () => {
      // Clean up preview URLs on unmount
      if (imagePreviews.imgProfile) {
        URL.revokeObjectURL(imagePreviews.imgProfile);
      }
      if (imagePreviews.imgCccd) {
        URL.revokeObjectURL(imagePreviews.imgCccd);
      }
    };
  }, []);

  const validateExperienceYear = (value) => {
    if (value === "") return "Vui lòng nhập số năm kinh nghiệm";
    if (isNaN(value)) return "Số năm kinh nghiệm phải là số";
    if (value < 0) return "Số năm kinh nghiệm không thể âm";
    if (value > 50) return "Số năm kinh nghiệm không hợp lệ";
    return "";
  };

  const validateDistrict = (value) => {
    if (!value) return "Vui lòng chọn quận/huyện";
    return "";
  };

  const validateWard = (value) => {
    if (!value) return "Vui lòng chọn phường/xã";
    return "";
  };

  const validateWorkableArea = (value) => {
    if (!value) return "Vui lòng nhập địa chỉ cụ thể";
    if (value.length < 5) return "Địa chỉ phải dài ít nhất 5 ký tự";
    if (value.length > 100) return "Địa chỉ không được vượt quá 100 ký tự";
    return "";
  };

  const validateIntroduceYourself = (value) => {
    if (!value) return "Vui lòng nhập thông tin giới thiệu";
    if (value.length < 10) return "Thông tin giới thiệu phải dài ít nhất 10 ký tự";
    if (value.length > 500) return "Thông tin giới thiệu không được vượt quá 500 ký tự";
    return "";
  };

  const validateServicePrice = (value) => {
    if (!value) return "Vui lòng nhập giá dịch vụ";
    if (isNaN(value)) return "Giá dịch vụ phải là số";
    if (value < 50000) return "Giá dịch vụ phải từ 50,000 VND trở lên";
    if (value > 500000) return "Giá dịch vụ không được vượt quá 500,000 VND";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'experienceYear') {
      const error = validateExperienceYear(value);
      setErrors(prev => ({ ...prev, experienceYear: error }));
    } else if (name === 'district') {
      const error = validateDistrict(value);
      setErrors(prev => ({ ...prev, district: error }));
      setFormData(prev => ({ ...prev, ward: "" })); // Reset ward when district changes
    } else if (name === 'ward') {
      const error = validateWard(value);
      setErrors(prev => ({ ...prev, ward: error }));
    } else if (name === 'workableArea') {
      const error = validateWorkableArea(value);
      setErrors(prev => ({ ...prev, workableArea: error }));
    } else if (name === 'introduceYourself') {
      const error = validateIntroduceYourself(value);
      setErrors(prev => ({ ...prev, introduceYourself: error }));
    } else if (name === 'servicePrice') {
      const error = validateServicePrice(value);
      setErrors(prev => ({ ...prev, servicePrice: error }));
    } else {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      // Revoke previous URL to prevent memory leak
      setImagePreviews(prev => {
        if (prev[name]) {
          URL.revokeObjectURL(prev[name]);
        }
        return {
          ...prev,
          [name]: URL.createObjectURL(files[0])
        };
      });
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
      if (!formData.username || !formData.email || 
          !formData.phone || !formData.password || !formData.experienceYear ||
          !formData.district || !formData.ward || !formData.workableArea ||
          !formData.introduceYourself || !formData.servicePrice) {
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

      setLoading(true);
      setProgress(10);

      const progressInterval = setInterval(() => {
        setProgress((old) => (old < 90 ? old + 10 : old));
      }, 400);

      const registerDTO = {
        userName: formData.username,
        password: formData.password,
        email: formData.email,
        phoneNumber: formData.phone,
        nameOfUser: formData.name,
        gender: formData.gender,
        dob: formData.dob,
        city: "Đà Nẵng",
        district: formData.district,
        ward: formData.ward,
        workableArea: formData.workableArea,
        introduceYourself: formData.introduceYourself,
        servicePrice: parseInt(formData.servicePrice),
        roleName: "CARE_TAKER",
        experienceYear: parseInt(formData.experienceYear),
        selectedOptionDetailIds: formData.selectedOptionDetailIds
      };

      const formDataToSend = new FormData();
      
      formDataToSend.append('registerDTO', new Blob([JSON.stringify(registerDTO)], { type: 'application/json' }));
      formDataToSend.append('imgProfile', formData.imgProfile);
      formDataToSend.append('imgCccd', formData.imgCccd);

      console.log('registerDTO:', registerDTO);
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0]+ ', ' + pair[1]);
      }

      const response = await api.post('/auths/register', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.data.code === 20000) {
        toast.success('Đăng ký thành công!');
        setTimeout(() => {
          setLoading(false);
          navigate('/login');
        }, 1000);
      } else {
        setLoading(false);
        throw new Error(response.data.message || 'Đăng ký thất bại');
      }

    } catch (error) {
      setLoading(false);
      console.error('Registration error:', error, error.response);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký');
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.username || !formData.email || 
          !formData.phone || !formData.password || !formData.experienceYear ||
          !formData.district || !formData.ward || !formData.workableArea ||
          !formData.introduceYourself || !formData.servicePrice) {
        toast.error('Vui lòng điền đầy đủ thông tin!');
        return;
      }
    } else if (currentStep === 2) {
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

  const typographyClasses = {
    heading: "text-[24px] font-semibold text-gray-900",
    subheading: "text-[16px] font-medium text-[#8C8C8C]",
    input: "text-[16px] font-['SVN-Gilroy']"
  };

  const inputClassName = `w-full h-[52px] px-4 border rounded-[10px] ${typographyClasses.input} focus:outline-none`;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-[1024px] mx-auto pt-[40px] px-6 pb-[40px]">
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

        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-[24px] font-semibold text-gray-900 mb-2">Thông tin cá nhân</h2>
              <p className="text-[16px] font-medium text-[#8C8C8C] mb-6">Hãy cho chúng tôi biết bạn là ai để kết nối tốt hơn!</p>
              <div className="space-y-4">
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
                    {imagePreviews.imgProfile && (
                      <img
                        src={imagePreviews.imgProfile}
                        alt="Ảnh đại diện preview"
                        className="mt-2 w-32 h-32 object-cover rounded-md"
                      />
                    )}
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
                    {imagePreviews.imgCccd && (
                      <img
                        src={imagePreviews.imgCccd}
                        alt="Ảnh CCCD preview"
                        className="mt-2 w-32 h-32 object-cover rounded-md"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

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

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-[24px] font-semibold text-gray-900 mb-2">Thông tin làm việc</h2>
              <p className="text-[16px] font-medium text-[#8C8C8C] mb-6">Hãy cho chúng tôi biết địa điểm làm việc của bạn</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-[14px] font-medium text-gray-700 mb-1">
                    Quận/Huyện
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className={inputClassName}
                  >
                    <option value="">Chọn quận/huyện</option>
                    {DANANG_DISTRICTS.map(district => (
                      <option key={district.id} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                  {errors.district && <p className="text-red-500 text-[12px] mt-1">{errors.district}</p>}
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-gray-700 mb-1">
                    Phường/Xã
                  </label>
                  <select
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    className={inputClassName}
                    disabled={!formData.district}
                  >
                    <option value="">Chọn phường/xã</option>
                    {formData.district && DANANG_WARDS[formData.district]?.map(ward => (
                      <option key={ward} value={ward}>
                        {ward}
                      </option>
                    ))}
                  </select>
                  {errors.ward && <p className="text-red-500 text-[12px] mt-1">{errors.ward}</p>}
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-gray-700 mb-1">
                    Địa chỉ cụ thể
                  </label>
                  <input
                    type="text"
                    name="workableArea"
                    value={formData.workableArea}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ cụ thể (ví dụ: 123 Đường Lê Lợi)"
                    className={inputClassName}
                  />
                  {errors.workableArea && <p className="text-red-500 text-[12px] mt-1">{errors.workableArea}</p>}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-[24px] font-semibold text-gray-900 mb-2">Giới thiệu và Giá dịch vụ</h2>
              <p className="text-[16px] font-medium text-[#8C8C8C] mb-6">Hãy giới thiệu bản thân và mức giá dịch vụ của bạn</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-[14px] font-medium text-gray-700 mb-1">
                    Giới thiệu bản thân
                  </label>
                  <textarea
                    name="introduceYourself"
                    value={formData.introduceYourself}
                    onChange={handleChange}
                    placeholder="Giới thiệu ngắn gọn về bản thân và kinh nghiệm của bạn"
                    className="w-full h-[100px] px-4 py-2 border rounded-[10px] text-[16px] font-['SVN-Gilroy'] focus:outline-none"
                  />
                  {errors.introduceYourself && <p className="text-red-500 text-[12px] mt-1">{errors.introduceYourself}</p>}
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-gray-700 mb-1">
                    Giá dịch vụ mong muốn (VND)
                  </label>
                  <p className="block text-[10px] font-medium text-gray-700 mb-1">Hãy chọn một mức giá hợp lí với kinh nghiệm của mình (mức giá sẽ được điều chỉnh để hợp lí) </p>
                  <input
                    type="number"
                    name="servicePrice"
                    value={formData.servicePrice}
                    onChange={handleChange}
                    placeholder="Nhập giá dịch vụ (50,000 - 500,000 VND)"
                    className={inputClassName}
                    min="50000"
                    max="500000"
                    step="1000"
                  />
                  {errors.servicePrice && <p className="text-red-500 text-[12px] mt-1">{errors.servicePrice}</p>}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-[24px] font-semibold text-gray-900 mb-2">Tùy chọn công việc</h2>
              <p className="text-[16px] font-medium text-[#8C8C8C] mb-6">Chọn khu vực làm việc phù hợp với bạn</p>
              <div className="space-y-4">
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
                  Có, tôi đồng ý tham gia khóa đào___

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

        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-300"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                  />
                  <circle
                    className="text-teal-500"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 45}
                    strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-2xl font-bold text-teal-600">{progress}%</span>
              </div>
              <div className="mt-6 text-lg font-medium text-white bg-teal-500 px-6 py-2 rounded-full shadow-lg">
                Chúng tôi đang tiến hành xác thực căn cước công dân của bạn...
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default SignUpCareTaker;