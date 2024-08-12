'use client'

import React, { useState, useEffect } from 'react';
import "./TopNav.css";
import axios from "axios";
import { useSession } from 'next-auth/react';

const TopNav = () => {
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [files, setFiles] = useState([]);
  const [searchedResults, setSearchedResults] = useState([]);
  const { data: session, status } = useSession();

  // Fetch the files when the session is ready
  useEffect(() => {
    const fetchFiles = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          const userId = session.user.id;
          console.log("User ID:", userId); // Log the user ID
          console.log("Session Data:", session); // Log the session data

          const response = await axios.get(`http://localhost:3000/api/post/${userId}/get-post`);
          console.log("Received GET request");

          // Ensure that the data is an array
          const data = Array.isArray(response.data) ? response.data : [];
          console.log("Fetched Files:", data); // Log the fetched files

          setFiles(data);
        } catch (error) {
          console.error("Error fetching files:", error);
        }
      }
    };

    fetchFiles();
  }, [session, status]);

  // Function to filter files based on search input
  const filterFiles = (searchText) => {
    const regex = new RegExp(searchText, "i"); // Case-insensitive search
    return files.filter((file) => regex.test(file.fileName));
  };

  // Handle input change and debounce the search
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

  if (status === 'loading') {
    return <div>Loading...</div>; // Show a loading state while the session is being fetched
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
        <img src="/assets/images/account.png" alt="Account Icon" />
      </div>

      {/* Display the search results */}
      {searchText && (
        <div className="search-results">
          {searchedResults.length > 0 ? (
            searchedResults.map((file) => (
              <div key={file._id} className="search-result-item">
                {file.fileName}
              </div>
            ))
          ) : (
            <div>No files found</div>
          )}
        </div>
      )}
    </section>
  );
};

export default TopNav;
