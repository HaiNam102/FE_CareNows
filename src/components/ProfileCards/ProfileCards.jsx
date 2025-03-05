import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProfileCards.css';

const ProfileCards = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 8;

  // Fetch dữ liệu từ API
  const fetchProfiles = async () => {
    try {
      const response = await fetch('http://localhost:5000/profiles');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProfiles(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Phân trang
  const indexOfLastProfile = currentPage * imagesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - imagesPerPage;
  const currentProfiles = profiles.slice(indexOfFirstProfile, indexOfLastProfile);

  // Tổng số trang
  const totalPages = Math.ceil(profiles.length / imagesPerPage);

  // Xử lý thay đổi trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // window.scrollTo(0, 0); // Cuộn lên đầu trang khi thay đổi trang
  };


  if (loading) return <div className="text-center my-5">Loading profiles...</div>;
  if (error) return <div className="text-center my-5 text-danger">Error loading profiles: {error}</div>;

  return (
    <Container fluid className="profile-container p-4">
      <Row>
        {currentProfiles.map((profile) => (
          <Col key={profile.id} lg={3} md={6} sm={12} className="mb-4">
            <Card className="profile-card border-0">
              <div className="profile-image-container"> 
                <Card.Img variant="top" src={profile.imageUrl} className="profile-image" />
              </div>
              <Card.Body className="profile-info">
                <Card.Title className="name">{profile.name}</Card.Title>
                <div className="profile-details">
                  <div className="detail-row">
                    <span>Giới tính: {profile.gender}</span>
                    <span>Tuổi: {profile.age}</span>
                  </div>
                  <p className="description">{profile.description}</p>
                  <p className="price">{profile.price}</p>
                </div>
                <div className="view-details">
                  <span>Xem chi tiết</span>
                  <i className="arrow-icon">→</i>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Phân trang */}
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.Prev 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          
          <Pagination.Next 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
      
    </Container>
  );
};

export default ProfileCards;
