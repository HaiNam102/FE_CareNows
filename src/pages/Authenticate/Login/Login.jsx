import React, { useState } from "react";
import styles from "./Login.module.css";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
// Import the background image
import loginBg from "../../../assets/images/Login.png";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Data:", formData);
  };

  return (
    <Container fluid className={styles.pageContainer}>
      <Container className={styles.wrapperContainer}>
        <Row className={styles.loginRow}>
          {/* Form Đăng Nhập */}
          <Col md={6} className={styles.formCol}>
            <div className={styles.loginForm}>
              <Button variant="primary" className={styles.googleBtn}>
                <span className={styles.googleIcon}><FcGoogle/></span> Đăng nhập bằng google
              </Button>

              <div className={styles.divider}>
                <span>hoặc</span>
              </div>

              <Form onSubmit={handleSubmit} className={styles.form}>
                <Form.Group className="mb-3">
                  <Form.Label className={styles.formLabel}>Tên đăng nhập</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={styles.formControl}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className={styles.formLabel}>Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={styles.formControl}
                    required
                  />
                </Form.Group>

                <Button variant="success" type="submit" className={styles.loginBtn}>
                  Đăng nhập
                </Button>
              </Form>
            </div>
          </Col>

          {/* Image Background */}
          <Col md={6} className={styles.imageCol} style={{ backgroundImage: `url(${loginBg})` }}>
            {/* The image is set as a background in CSS */}
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Login;