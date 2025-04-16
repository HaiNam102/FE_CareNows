import React from 'react';
// import MainLayout from '../../layouts/MainLayout';
import BookService from '../../layouts/BookService';
import ServiceCards from '../../components/ServiceCards';
import CareNowRegistration from '../../components/CareNowRegistration';
import ServiceHighlights from '../../components/ServiceHighlights';

const Home = () => {
    return (
        <>
            {/* <MainLayout> */}
                <BookService />
                <ServiceCards />
                <ServiceHighlights />
                <CareNowRegistration/>
            {/* </MainLayout> */}
        </>
    );
};

export default Home;
