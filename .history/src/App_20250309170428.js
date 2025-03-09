import logo from './logo.svg';
import './App.css';
import Button from './Component/HoverButton';
import HoverButton from './Component/HoverButton';

function App() {
  return (
    <HoverButton text="Nhỏ" size="small" />
    <HoverButton text="Trung bình" size="medium" />
    <HoverButton text="Lớn" size="large" />
    
  );
}

export default App;
