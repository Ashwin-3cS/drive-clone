'use client'
import React, { useState, useEffect } from 'react';
import './MainSection.css';
import Upload from '../UploadComponent/Upload';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import PopupMenu from '@/components/PopupMenu/PopupMenu'; 
import RightNav from '../right-nav/RightNav';

const MainSection = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [showPopup, setShowPopup] = useState(null); 
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchFiles = async () => {
      if (status === 'authenticated') {
        try {
          const userId = session.user.id;
          const response = await axios.get(`http://localhost:3000/api/post/${userId}/get-post`);
          if (response.data.success) {
            setFiles(response.data.posts);
          } else {
            console.error('Failed to fetch files:', response.data.message);
          }
        } catch (error) {
          console.error('Error fetching files:', error);
        }
      }
    };

    fetchFiles();
  }, [status, session]);

  const handleUploadClick = () => {
    setShowUpload(!showUpload);
  };

  const closeUploadPopup = () => {
    setShowUpload(false);
  };

  const handleFileUpload = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`http://localhost:3000/api/post/${session.user.id}/new-post`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        console.log('File uploaded successfully:', response.data.newPost);
        const updatedFiles = await axios.get(`http://localhost:3000/api/post/${session.user.id}/get-post`);
        setFiles(updatedFiles.data.posts);
      } else {
        console.error('File upload failed:', response.data.error);
      }
    } catch (error) {
      console.error('File upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoreOptionsClick = (fileId) => {
    setShowPopup(showPopup === fileId ? null : fileId);
  };

  return (
    <section className="main-section">
      <div className="left-nav">
        <button className="addNewDriveButton" onClick={handleUploadClick}>
          <img src="/assets/images/plus.png" alt="Add New" />
          <h5>New</h5>
        </button>
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
                loading={loading}
              />
            )}
            {files.map(file => (
              <div key={file._id} className="tile">
                <div className="tile-header">
                  <div className="filename">
                    <img
                      src={
                        file.fileType === 'image/png' ? '/assets/images/picture.png' :
                        file.fileType === 'application/pdf' ? '/assets/images/pdf.png' :
                        '/assets/images/text.png'
                      }
                      alt="File Icon"
                    />
                    <span>{file.fileName}</span>
                  </div>
                  <div
                    className="more-options"
                    onClick={() => handleMoreOptionsClick(file._id)}
                  >
                    •••
                  </div>
                  {showPopup === file._id && (
                    <PopupMenu show={true} onClose={() => setShowPopup(null)} postId={file._id} fileLink={file.fileLink} />
                  )}
                </div>
                <div className='image-container'></div>

              </div>
            ))}
          </div>
        </div>
      </div>

      <RightNav/>
    </section>
  );
};

export default MainSection;
