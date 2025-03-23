import logo from './logo.svg';
import './App.css';
import Button from './Component/HoverButton';
import HoverButton from './Component/HoverButton';

function App() {
  return (
    // <HoverButton text="Đăng ký ngay" size="medium" showArrow={true} />

    // return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800">Hello, Tailwind CSS!</h1>
          <p className="text-gray-600 mt-2">This is a simple React app using Tailwind CSS.</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Click me
          </button>
        </div>
      </div>
    // );
  
    
  );
}

export default App;
