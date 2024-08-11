'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './PopupMenu.css'; // Create this CSS file for styling the PopupMenu

const PopupMenu = ({ show, onClose, postId, fileLink }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [onClose]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/post/${postId}/delete-post`);

      if (response.status === 200) {
        toast.success('Post deleted successfully!'); // Add success toast
        onClose(); // Close the menu after deletion
      } else {
        console.error('Deletion Error:', response.data.error);
        toast.error('Failed to delete post.'); // Add error toast
      }
    } catch (error) {
      console.error('Deletion Request Failed:', error);
      toast.error('Failed to delete post.'); // Add error toast
    }
  };

  const handleOpenWith = () => {
    // Handle 'Open with' action
    console.log('Open with action triggered');
  };

  const handleDownload = () => {
    // Handle 'Download' action
    console.log('Download action triggered');
  };

  const handleRename = () => {
    // Handle 'Rename' action
    console.log('Rename action triggered');
  };

  const handleMakeCopy = () => {
    // Handle 'Make a Copy' action
    console.log('Make a Copy action triggered');
  };

  const handleShare = () => {
    // Handle 'Share' action
    if (fileLink) {
      navigator.clipboard.writeText(fileLink).then(() => {
        toast.success('Link copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy link:', err);
        toast.error('Failed to copy link.');
      });
    } else {
      toast.error('No link available to copy.');
    }
  };

  const handleOrganize = () => {
    // Handle 'Organize' action
    console.log('Organize action triggered');
  };

  const handleFileInformation = () => {
    // Handle 'File Information' action
    console.log('File Information action triggered');
  };

  const handleOffline = () => {
    // Handle 'Make available offline' action
    console.log('Make available offline action triggered');
  };

  if (!show) return null;

  return (
    <div className="popup-menu show" ref={menuRef}>
      <ul>
        <li className="menu-item" onClick={handleOpenWith}>
          <img src="/assets/images/cursor.png" alt="Open with" className="menu-icon" />
          Open with
          <img src="/assets/images/right-arrow.png" alt="Arrow" className="arrow-icon" />
        </li>
        <li><div className="separator"></div></li>
        <li className="menu-item" onClick={handleDownload}>
          <img src="/assets/images/downloads.png" alt="Download" className="menu-icon" />
          Download
        </li>
        <li className="menu-item" onClick={handleRename}>
          <img src="/assets/images/edit.png" alt="Rename" className="menu-icon" />
          Rename
        </li>
        <li className="menu-item" onClick={handleMakeCopy}>
          <img src="/assets/images/copy.png" alt="Copy" className="menu-icon" />
          Make a Copy
        </li>
        <li><div className="separator"></div></li>
        <li className="menu-item" onClick={handleShare}>
          <img src="/assets/images/sharing.png" alt="Share" className="menu-icon" />
          Share
          <img src="/assets/images/right-arrow.png" alt="Arrow" className="arrow-icon" />
        </li>
        <li className="menu-item" onClick={handleOrganize}>
          <img src="/assets/images/open-folder.png" alt="Organize" className="menu-icon" />
          Organize
          <img src="/assets/images/right-arrow.png" alt="Arrow" className="arrow-icon" />
        </li>
        <li className="menu-item" onClick={handleFileInformation}>
          <img src="/assets/images/information.png" alt="File Information" className="menu-icon" />
          File Information
          <img src="/assets/images/right-arrow.png" alt="Arrow" className="arrow-icon" />
        </li>
        <li className="menu-item" onClick={handleOffline}>
          <img src="/assets/images/offline.png" alt="Offline" className="menu-icon" />
          Make available offline
        </li>
        <li><div className="separator"></div></li>
        <li className="menu-item" onClick={handleDelete}>
          <img src="/assets/images/trash.png" alt="Trash" className="menu-icon" />
          Move to trash
        </li>
      </ul>
    </div>
  );
};

export default PopupMenu;
