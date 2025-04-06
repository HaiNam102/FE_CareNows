import React from 'react';
// import MainLayout from '../../layouts/MainLayout';
import BookService from '../../layouts/BookService';
import ServiceCards from '../../components/ServiceCards';
import CareNowRegistration from '../../components/CareNowRegistration';



const Home = () => {
    return (
        <>
            {/* <MainLayout> */}
                <BookService />
                <ServiceCards />
                <CareNowRegistration/>
            {/* </MainLayout> */}
        </>
    );
};

export default Home;
