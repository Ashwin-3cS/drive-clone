import React, { useEffect } from 'react';
import toast from 'react-hot-toast'; // Import toast

const FileList = ({ data = [], searchTerm }) => {

  useEffect(() => {
    if (searchTerm && data.length > 0) {
      const foundFile = data.find(file => file.fileName.toLowerCase() === searchTerm.toLowerCase());
      if (foundFile) {
        toast.success(`File Found: ${foundFile.fileName}`);
      }
    }
  }, [data, searchTerm]);

  return (
    <div className="search-results">
      {data.length > 0 ? (
        data.map(file => (
          <div key={file._id} className="search-result-item">
          </div>
        ))
      ) : (
        <div>No files found</div>
      )}
    </div>
  );
};

export default FileList;
