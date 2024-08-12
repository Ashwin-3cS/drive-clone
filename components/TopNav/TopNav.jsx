'use client'

import React, { useState, useEffect } from 'react';
import "./TopNav.css";
import axios from "axios";
import { signOut, useSession } from 'next-auth/react';
import FileList from './FileList';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 

const TopNav = () => {
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [files, setFiles] = useState([]);
  const [searchedResults, setSearchedResults] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter(); // 

  useEffect(() => {
    const fetchFiles = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          const userId = session.user.id;
          console.log("User ID:", userId);

          const response = await axios.get(`/api/post/${userId}/get-post`);
          console.log("Received GET request");

          const data = response.data.posts; 
          console.log("Fetched Files:", data);

          if (Array.isArray(data)) {
            setFiles(data);
          } else {
            console.error("Fetched data.posts is not an array:", data);
          }
        } catch (error) {
          console.error("Error fetching files:", error);
        }
      }
    };

    fetchFiles();
  }, [session, status]);

  const filterFiles = (searchText) => {
    const regex = new RegExp(searchText, "i");
    return files.filter((file) => regex.test(file.fileName));
  };

  const handleInputChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterFiles(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false }); // Prevent default redirect
      router.push('/'); // Navigate to homepage
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <section className="top-nav">
      <div className="icon-container">
        <img src="/assets/images/GooglDrive.png" id="productIcon" alt="Drive Icon" />
        <h1>Drive</h1>
      </div>
      <div className="search-container">
        <img src="/assets/images/search.png" id="search" alt="Search Icon" />
        <input 
          placeholder="Search in Drive" 
          value={searchText} 
          onChange={handleInputChange} 
        />
        <img src="/assets/images/SearchEdit.png" id="advancedSearch" alt="Advanced Search Icon" />
      </div>
      <div className="action-icon-container">
        <img src="/assets/images/question.png" alt="Help Icon" />
        <img src="/assets/images/settings.png" alt="Settings Icon" />
        <img src="/assets/images/dots.png" alt="Options Icon" />
        <Image
          src={session?.user.image}
          width={50}
          height={50}
          alt='profile-image'
          className='rounded-badge profile-image'
        />
        <div tabIndex={0} role="button" className="btn btn-outline btn-error p-1" onClick={handleSignOut}>LogOut</div>
      </div>

      {/* Display the search results */}
      <FileList data={searchText ? searchedResults : files} searchTerm={searchText} />
    </section>
  );
};

export default TopNav;
