import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

const SignUpRoleSelection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto pt-16 px-6">
        
        {/* Heading */}
        <h1 className="text-5xl font-['SVN-Gilroy'] font-semibold text-center mb-16">
          Tham gia với tư cách khách hàng<br />
          hoặc chuyên viên chăm sóc
        </h1>
        
        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Client Option */}
          <div 
            className="w-[408px] h-[175px] px-5 py-3 border border-gray-200 rounded-xl cursor-pointer hover:border-teal-500 transition-all"
            onClick={() => navigate("/signup-client")}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <Users className="text-gray-500 w-8 h-8" />
                <div className="w-5 h-5 rounded-full border border-teal-500"></div>
              </div>
              <p className="text-2xl font-['SVN-Gilroy'] font-normal text-gray-800">
                Tôi là khách hàng, cần thuê chuyên viên chăm sóc
              </p>
            </div>
          </div>
          
          {/* Caregiver Option */}
          <div 
            className="w-[408px] h-[175px] px-5 py-3 border border-gray-200 rounded-xl cursor-pointer hover:border-teal-500 transition-all"
            onClick={() => navigate("/signup-care-taker")}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <div className="text-gray-500">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3.41421 20.5858C2.63316 19.8047 2 18.6639 2 17C2 13.6863 4.68629 11 8 11H16C19.3137 11 22 13.6863 22 17C22 18.6639 21.3668 19.8047 20.5858 20.5858C19.8047 21.3668 18.6639 22 17 22H7C5.33608 22 4.19526 21.3668 3.41421 20.5858Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div className="w-5 h-5 rounded-full border border-teal-500"></div>
              </div>
              <p className="text-2xl font-['SVN-Gilroy'] font-normal text-gray-800">
                Tôi muốn trở thành chuyên viên chăm sóc của CareNow
              </p>
            </div>
          </div>
        </div>
        
        {/* Back Button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="w-[92px] h-[40px] flex items-center justify-center text-[16px] font-['SVN-Gilroy'] font-medium text-[#7F798F] border border-[#7F798F] rounded-[10px] hover:bg-gray-50 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpRoleSelection;