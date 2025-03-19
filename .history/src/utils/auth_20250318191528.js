import { jwtDecode } from 'jwt-decode';

export const getRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.role; // Giả sử role được lưu trong token
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    // Kiểm tra token hết hạn
    if (decoded.exp < Date.now() / 1000) {
      localStorage.removeItem('token');
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}; 