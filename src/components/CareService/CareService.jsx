import React from 'react';
import './CareService.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCalendarAlt, faSearch } from '@fortawesome/free-solid-svg-icons';

const CareService = () => {
  // Sample image URL - replace with your actual image path
  const profileImageUrl = "https://storage.googleapis.com/a1aa/image/9F7GJ-ZukJkjWeLICYc9e9c0_MC_BUarPZtTMMKjpc8.jpg";

  return (
    <div className="care-service-container">
      <div className="position-relative d-flex flex-column align-items-center justify-content-center min-vh-100 p-4">
        {/* Background Images */}
        <img 
          alt="Profile image of a smiling woman" 
          className="position-absolute profile-img top-10 start-10"
          src={profileImageUrl} 
        />
        <img 
          alt="Profile image of a smiling woman" 
          className="position-absolute profile-img top-50 start-0 translate-middle-y"
          src={profileImageUrl} 
        />
        <img 
          alt="Profile image of a smiling woman" 
          className="position-absolute profile-img bottom-10 start-10"
          src={profileImageUrl} 
        />
        <img 
          alt="Profile image of a smiling woman" 
          className="position-absolute profile-img top-10 end-10"
          src={profileImageUrl} 
        />
        <img 
          alt="Profile image of a smiling woman" 
          className="position-absolute profile-img bottom-10 end-10"
          src={profileImageUrl} 
        />

        {/* Main Content */}
        <div className="text-center">
          <h1 className="display-4 fw-bold mb-4">
            Biến sự quan tâm <br />
            <span className="fst-italic">thành sự chăm sóc</span>
          </h1>
          <p className="lead mb-4">
            Tìm bảo mẫu tin cậy, an tâm từng khoảnh khắc!
          </p>
          
          <div className="d-flex justify-content-center mb-4">
            <div className="d-flex bg-white text-dark rounded overflow-hidden">
              <button className="btn btn-teal text-white fw-semibold">
                Chăm sóc tại nhà
              </button>
              <button className="btn text-dark">
                Chăm sóc tại bệnh viện
              </button>
            </div>
          </div>
          
          <div className="bg-white text-dark rounded p-4 search-box">
            <div className="row align-items-center">
              <div className="col-md-4 mb-3 mb-md-0">
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                  <select className="form-select border-0">
                    <option>Thành phố</option>
                  </select>
                </div>
              </div>
              
              <div className="col-md-4 mb-3 mb-md-0">
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                  <input 
                    type="text" 
                    className="form-control border-0" 
                    defaultValue="21:00, 02/03/2025 - 20:00, 03/03/2025"
                  />
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="d-flex align-items-center">
                  <input 
                    type="text" 
                    className="form-control border-0 me-2" 
                    placeholder="Tên bảo mẫu/ID"
                  />
                  <button className="btn btn-teal text-white">
                    <FontAwesomeIcon icon={faSearch} /> Tìm kiếm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareService;