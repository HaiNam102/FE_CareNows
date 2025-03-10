import React from "react";
import styles from "./Header.module.css"; // Import CSS Module
import logo from "../../assets/images/Logo.png"; // Import logo từ thư mục assets

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoWrapper}>
          <img src={logo} alt="CareNow" className={styles.logoImage} />
        </div>
        <nav className={styles.navMenu}>
          <a href="#" className={styles.active}>Trang chủ</a>
          <a href="#">Lịch của tôi</a>
          <a href="#">Về CareNow</a>
        </nav>
        <div className={styles.authButtons}>
          <button className={`${styles.button} ${styles.login}`}>Đăng nhập</button>
          <button className={`${styles.button} ${styles.signup}`}>Đăng ký ngay</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
