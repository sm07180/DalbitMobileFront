import React from 'react'

// components
import SocialList from "../../components/socialList";

const FanboardSection = (props) => {
  const { fanBoardData, isMyProfile } = props;

  return (
    <div className="fanboardSection">
      <div className="subArea">
        <div className="title">전체 {fanBoardData.list.length}</div>
      </div>
      <SocialList socialList={fanBoardData.list} isMyProfile={isMyProfile} type="fanBoard" />
    </div>
  )
}

export default FanboardSection
