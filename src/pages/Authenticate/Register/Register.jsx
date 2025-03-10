import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserNurse } from '@fortawesome/free-solid-svg-icons';
import styles from './Register.module.css';
import logo from "../../../assets/images/Logo.png";


const Register = () => {
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  return (
    <Container className={styles.container}>
      <header className={styles.header}>
        <img
          alt="CareNow logo" 
          width="100" 
          height="50" 
          className={styles.logo} 
        />
      </header>
      
      <main className={styles.main}>
        <h1 className={styles.title}>
          Tham gia với tư cách khách hàng hoặc chuyên viên chăm sóc
        </h1>
        
        <Row className={styles.roleOptions}>
          <Col md={6} className={styles.optionCol}>
            <div 
              className={`${styles.roleCard} ${selectedRole === 'client' ? styles.selected : ''}`}
              onClick={() => handleRoleChange('client')}
            >
              <div className={styles.roleInfo}>
                <FontAwesomeIcon icon={faUser} className={styles.roleIcon} />
                <p className={styles.roleText}>
                  Tôi là khách hàng, cần thuê chuyên viên chăm sóc
                </p>
              </div>
              <Form.Check 
                type="radio" 
                name="role" 
                checked={selectedRole === 'client'}
                onChange={() => handleRoleChange('client')}
                className={styles.radioInput}
              />
            </div>
          </Col>
          
          <Col md={6} className={styles.optionCol}>
            <div 
              className={`${styles.roleCard} ${selectedRole === 'caregiver' ? styles.selected : ''}`}
              onClick={() => handleRoleChange('caregiver')}
            >
              <div className={styles.roleInfo}>
                <FontAwesomeIcon icon={faUserNurse} className={styles.roleIcon} />
                <p className={styles.roleText}>
                  Tôi muốn trở thành chuyên viên chăm sóc của CareNow
                </p>
              </div>
              <Form.Check 
                type="radio" 
                name="role" 
                checked={selectedRole === 'caregiver'}
                onChange={() => handleRoleChange('caregiver')}
                className={styles.radioInput}
              />
            </div>
          </Col>
        </Row>
        
        <Button variant="light" className={styles.backButton}>
          Quay lại
        </Button>
      </main>
    </Container>
  );
};

export default Register;