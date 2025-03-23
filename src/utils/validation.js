export const validateField = (name, value) => {
  switch (name) {
    case 'name':
      return value.length < 2 ? 'Tên phải có ít nhất 2 ký tự' : '';
    case 'username':
      return !/^[a-zA-Z0-9_]{3,20}$/.test(value) ? 'Tên đăng nhập phải từ 3-20 ký tự, chỉ chứa chữ, số và dấu _' : '';
    case 'email':
      return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Email không hợp lệ' : '';
    case 'phone':
      return !/^[0-9]{10}$/.test(value) ? 'Số điện thoại phải có 10 chữ số' : '';
    case 'password':
      return value.length < 6 ? 'Mật khẩu phải có ít nhất 6 ký tự' : '';
    case 'district':
      return !value ? 'Vui lòng chọn quận' : '';
    case 'ward':
      return !value ? 'Vui lòng chọn phường' : '';
    case 'address':
      return value.length < 5 ? 'Địa chỉ phải có ít nhất 5 ký tự' : '';
    default:
      return '';
  }
};

export const DANANG_DISTRICTS = [
  { id: 1, name: "Hải Châu" },
  { id: 2, name: "Thanh Khê" },
  // ... các quận khác
];

export const DANANG_WARDS = {
  "Hải Châu": ["Hải Châu 1", "Hải Châu 2", /* ... */],
  "Thanh Khê": ["Tam Thuận", "Thanh Khê Tây", /* ... */],
  // ... các phường khác
}; 