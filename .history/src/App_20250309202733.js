import logo from './logo.svg';
import './App.css';
import Button from './Component/HoverButton';
import HoverButton from './Component/HoverButton';

function App() {
  return (
    // <HoverButton text="Đăng ký ngay" size="medium" showArrow={true} />

    // return (
      <div className="flex items-center justify-center min-h-screen bg-[#89BEF4]">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-[#1580EB]">
        <h1 className="text-2xl font-bold text-[#00B0AB]">Hello, Tailwind CSS!</h1>
        <p className="text-[#1580EB] mt-2">This is a simple React app using Tailwind CSS.</p>
        <button className="mt-4 px-4 py-2 bg-[#00B0AB] text-white rounded-lg hover:bg-[#1580EB] transition">
          Click me
        </button>
      </div>
    </div>
    // );
  
    
  );
}

export default App;
