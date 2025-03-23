// ProfilePage.jsx
import React, { useState } from 'react';
import ProfileLayout from '../../layouts/ProfileLayout/ProfileLayout';
import ProfileContent from './ProfileContent';
import TasksAccordion from './TasksAccordion';
import ReviewsSection from './ReviewsSection';
// import ServicesContent from './ServicesContent';
// import ScheduleContent from './ScheduleContent';
// import ReviewsContent from './ReviewsContent';
// import MessagesContent from './MessagesContent';

const ProfilePage = ({ profile = {}, onClose, district, dateRange }) => {
  const [activeTab, setActiveTab] = useState('profile');

  const handleNavigate = (tab, district, dateRange) => {
    setActiveTab(tab);
    // Nếu bạn cần xử lý thêm logic navigation, bạn có thể thêm vào đây
  };

  // Render content dựa trên tab đang active
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileContent profile={profile} />;
      case 'services':
        return <TasksAccordion profile={profile} />;
      // case 'schedule':
      //   return <ReviewsSection profile={profile} />;
      case 'reviews':
        return <ReviewsSection profile={profile} />;
      // case 'messages':
      //   return <MessagesContent profile={profile} />;
      // default:
      //   return <ProfileContent profile={profile} />;
    }
  };

  return (
    <ProfileLayout 
      activeTab={activeTab} 
      onNavigate={handleNavigate} 
      onClose={onClose} 
      district={district} 
      dateRange={dateRange}
    >
      {renderContent()}
    </ProfileLayout>
  );
};

export default ProfilePage;