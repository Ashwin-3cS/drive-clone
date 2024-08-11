import React from 'react'
import "./TopNav.css"

const TopNav = () => {
  return (
    <section className="top-nav">
      <div className="icon-container">
        <img src="/assets/images/GooglDrive.png" id="productIcon" alt="Drive Icon" />
        <h1>Drive</h1>
      </div>
      <div className="search-container">
        <img src="/assets/images/search.png" id="search" alt="Search Icon" />
        <input placeholder="Search in Drive" />
        <img src="/assets/images/SearchEdit.png" id="advancedSearch" alt="Advanced Search Icon" />
      </div>
      <div className="action-icon-container">
        <img src="/assets/images/question.png" alt="Help Icon" />
        <img src="/assets/images/settings.png" alt="Settings Icon" />
        <img src="/assets/images/dots.png" alt="Options Icon" />
        <img src="/assets/images/account.png" alt="Account Icon" />
      </div>
    </section>
  )
}

export default TopNav;
