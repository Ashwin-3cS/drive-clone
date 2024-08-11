'use client'


import React, { useState } from 'react';
import './MainSection.css';
import Upload from '../UploadComponent/Upload';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const MainSection = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession(); 

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session || !session.user || !session.user.id) {
    return <p>Please log in to upload files.</p>;
  }

  const userId = session.user.id;

  const handleUploadClick = () => {
    setShowUpload(!showUpload);
  };

  const closeUploadPopup = () => {
    setShowUpload(false);
  };

  const handleFileUpload = async (file) => {
    setLoading(true); // Start loading when file upload starts
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`http://localhost:3000/api/post/${userId}/new-post`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        console.log('File uploaded successfully:', response.data.newPost);
      } else {
        console.error('File upload failed:', response.data.error);
      }
    } catch (error) {
      console.error('File upload error:', error);
    } finally {
      setLoading(false); // Stop loading when file upload completes
    }
  };

  return (
    <section className="main-section">
      <div className="left-nav">
        <button className="addNewDriveButton" onClick={handleUploadClick}>
          <img src="/assets/images/plus.png" alt="Add New" />
          <h5>New</h5>
        </button>
        {/* Other navigation items */}
        <div>
          <div>
            <img src="/assets/images/Home.png" alt="Home" />
            <h4>Home</h4>
          </div>
          <div>
            <img src="/assets/images/My Drive.png" alt="My Drive" />
            <h4>My Drive</h4>
          </div>
          <div>
            <img src="/assets/images/Computer.png" alt="Computers" />
            <h4>Computers</h4>
          </div>
        </div>
        {/* Add other sections here */}
      </div>

      <div className="main-content-outer-container">
        <div className="main-content-inner-container">
          <div className="myDrive">
            <p>My Drive</p>
            <img src="/assets/images/DownArrow.png" alt="Dropdown" />
          </div>
          <div className="sorting-container">
            <div>
              <h5>Type</h5>
              <img src="/assets/images/DownArrow.png" alt="Sort by Type" />
            </div>
            <div>
              <h5>People</h5>
              <img src="/assets/images/DownArrow.png" alt="Sort by People" />
            </div>
            <div>
              <h5>Modified</h5>
              <img src="/assets/images/DownArrow.png" alt="Sort by Modified" />
            </div>
          </div>
          <div className="content-section" id="content-section">
            {showUpload && (
              <Upload
                closePopup={closeUploadPopup}
                handleFileUpload={handleFileUpload}
                loading={loading} // Pass loading state to Upload component
              />
            )}
          </div>
        </div>
      </div>

      <div className="right-nav">
        <div className="otherProductGateway">
          <img src="/assets/images/GoogleCalender.png" alt="Google Calendar" />
          <img src="/assets/images/Light.png" alt="Keep Notes" />
          <img src="/assets/images/verified.png" alt="Verified" />
          <img src="/assets/images/people.png" alt="Contacts" />
        </div>
        <div className="plusRightNav">
          <img src="/assets/images/plusRightNav.png" alt="Add" />
        </div>
        <div className="rightArrow">
          <img src="/assets/images/RightArrow.png" alt="Expand" />
        </div>
      </div>
    </section>
  );
};

export default MainSection;




