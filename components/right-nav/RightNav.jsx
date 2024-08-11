import React from 'react'
import './RightNav.css'

const RightNav = () => {
  return (
 
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
    
  )
}

export default RightNav