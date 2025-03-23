import HoverButton from "./HoverButton";

const ToRegister=() =>{
  return (
    <div className="w-full h-full relative">
      <div className="w-full h-[424px] left-0 top-0 absolute bg-[#00A37D]" />
      
      <div className="pl-14 pr-14 left-[60px] top-[141px] absolute flex justify-start items-end gap-[378px]">
        <div className="w-[652px] text-white text-[64px] font-['SVN-Gilroy'] font-semibold leading-[76.8px]">
          Liên hệ ngay, và cùng chăm sóc tận tâm.
        </div>
        
        <HoverButton text="Đăng ký ngay" size="large" showArrow={true} />
      </div>
      
      <div className="w-[95px] left-[120px] top-[103px] absolute flex justify-between items-center">
        <div className="w-[22px] h-[22px] bg-[#FCFBFB]" />
        <div className="text-white text-base font-['SVN-Gilroy'] font-medium leading-[19.2px]">
          Let's talk
        </div>
      </div>
    </div>
  );
}

export default ToRegister;