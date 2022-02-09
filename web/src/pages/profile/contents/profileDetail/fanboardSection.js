import React from 'react'

// components
import FanSocialList from '../../components/FanSocialList'

const FanboardSection = (props) => {
  const { profileData, fanBoardData, isMyProfile } = props;

  return (
    <div className="fanboardSection">
      <div className="subArea">
        <div className="title">전체 {fanBoardData.list.length}</div>
      </div>
      <FanSocialList profileData={profileData} list={fanBoardData.list} isMyProfile={isMyProfile} />
    </div>
  )
}

export default FanboardSection
