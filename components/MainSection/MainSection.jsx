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
          const response = await axios.get(`/api/post/${userId}/get-post`);
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
      const response = await axios.post(`/api/post/${session.user.id}/new-post`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        console.log('File uploaded successfully:', response.data.newPost);
        const updatedFiles = await axios.get(`api/post/${session.user.id}/get-post`);
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

  const handleDeleteFile = (deletedFileId) => {
    setFiles((prevFiles) => prevFiles.filter(file => file._id !== deletedFileId));
  };

  const handleRenameFile = (fileId, newFileName) => {
    setFiles((prevFiles) =>
      prevFiles.map(file =>
        file._id === fileId ? { ...file, fileName: newFileName } : file
      )
  );
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
          <div>
            <img src="/assets/images/shared.png" alt="Share PNG" />
            <h4>Shared with me</h4>
          </div>
          <div>
            <img src="/assets/images/recent.png" alt="recent" />
            <h4>Recent</h4>
          </div>
          <div>
            <img src="/assets/images/stared.png" alt="stared" />
            <h4>Starred</h4>
          </div>
          <div>
            <img src="/assets/images/spam.png" alt="spam" />
            <h4>Spam</h4>
          </div>
          <div>
            <img src="/assets/images/trash.png" alt="trash" />
            <h4>Trash</h4>
          </div>
          <div>
            <img src="/assets/images/StorageIcon.png" alt="spam" />
            <h4>Storage</h4><span className='ml-2'>(0.02% full)</span>
          </div>    
          <section className="storage-outer-limit"><div className="storage-inner-limit"></div></section>
          <section className="get-more-storage-button"><h4>Get more storage</h4></section>
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
                    <PopupMenu 
                      show={true}
                      onClose={() => setShowPopup(null)}
                      postId={file._id} fileLink={file.fileLink}
                      onDelete={handleDeleteFile}
                      onRename={handleRenameFile}
                    />
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
