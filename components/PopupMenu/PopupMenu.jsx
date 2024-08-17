'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './PopupMenu.css';

const PopupMenu = ({ show, onClose, postId, fileLink , onDelete , onRename }) => {
  const [isRenamePopupVisible, setRenamePopupVisible] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const menuRef = useRef(null);
  const renamePopupRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target) &&
        (!renamePopupRef.current || !renamePopupRef.current.contains(event.target))
      ) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [onClose]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`/api/post/${postId}/delete-post`);
      if (response.status === 200) {
        toast.success('File Deleted successfully!');
        onDelete(postId);
        onClose();
      } else {
        console.error('Deletion Error:', response.data.error);
        toast.error('Failed to delete post.');
      }
    } catch (error) {
      console.error('Deletion Request Failed:', error);
      toast.error('Failed to delete post.');
    } finally {
      setLoading(false);
    }
  };

  const handleRename = () => {
    setRenamePopupVisible(true);
  };

  const handleRenameSubmit = async () => {
    try {
      const response = await axios.put(`/api/post/${postId}/edit-post`, { newFileName });
      // const changedName = (response.data.post.fileName);
      if (response.status === 200) {
        toast.success('File renamed successfully!');
        onRename(postId, newFileName);  // Update the file name in MainSection
        setRenamePopupVisible(false);
        onClose();
      } else {
        console.error('Rename Error:', response.data.error);
        toast.error('Failed to rename file.');
      }
    } catch (error) {
      console.error('Rename Request Failed:', error);
      toast.error('Failed to rename file.');
    }
  };

  const handleShare = () => {
    if (fileLink) {
      navigator.clipboard.writeText(fileLink).then(() => {
        toast.success('Link copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy link:', err);
        toast.error('Failed to copy link.');
      });
    } else {
      toast.error('No link available to copy.')
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="popup-menu show" ref={menuRef}>
        <ul>
          <li className="menu-item" onClick={() => console.log("Open with triggered")}>
            <img src="/assets/images/cursor.png" alt="Open with" className="menu-icon" />
            Open with
            <img src="/assets/images/right-arrow.png" alt="Arrow" className="arrow-icon" />
          </li>
          <li><div className="separator"></div></li>
          <li className="menu-item" onClick={() => console.log("Download triggered")}>
            <img src="/assets/images/downloads.png" alt="Download" className="menu-icon" />
            Download
          </li>
          <li className="menu-item" onClick={handleRename}>
            <img src="/assets/images/edit.png" alt="Rename" className="menu-icon" />
            Rename
          </li>
          <li className="menu-item" onClick={() => console.log("Make a Copy triggered")}>
            <img src="/assets/images/copy.png" alt="Copy" className="menu-icon" />
            Make a Copy
          </li>
          <li><div className="separator"></div></li>
          <li className="menu-item" onClick={handleShare}>
            <img src="/assets/images/sharing.png" alt="Share" className="menu-icon" />
            Share
            <img src="/assets/images/right-arrow.png" alt="Arrow" className="arrow-icon" />
          </li>
          <li className="menu-item" onClick={() => console.log("Organize triggered")}>
            <img src="/assets/images/open-folder.png" alt="Organize" className="menu-icon" />
            Organize
            <img src="/assets/images/right-arrow.png" alt="Arrow" className="arrow-icon" />
          </li>
          <li className="menu-item" onClick={() => console.log("File Information triggered")}>
            <img src="/assets/images/information.png" alt="File Information" className="menu-icon" />
            File Information
            <img src="/assets/images/right-arrow.png" alt="Arrow" className="arrow-icon" />
          </li>
          <li className="menu-item" onClick={() => console.log("Make available offline triggered")}>
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

      {loading && (
        <div className="flex flex-col items-center justify-center ml-2">
          <p className='text-black'>Processing...</p>
          <span className="loading loading-spinner loading-lg bg-black"></span>
        </div>
      )}  

      {isRenamePopupVisible && (
        <div className="rename-popup rounded-md" ref={renamePopupRef}>
          <div className="rename-popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>Rename File</h3>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="New Filename"
            />
            <button onClick={handleRenameSubmit} className='btn'>Submit</button>
            <button onClick={() => setRenamePopupVisible(false)} className='btn'>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupMenu;
