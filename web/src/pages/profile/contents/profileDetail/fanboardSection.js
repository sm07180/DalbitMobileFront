import React from 'react'

// components
import SocialList from "../../components/socialList";
import Utility from "components/lib/utility";

const FanboardSection = (props) => {
  const { fanBoardData, isMyProfile } = props;

  return (
    <div className="fanboardSection">
      <div className="subArea">
        <div className="title">전체 {Utility.addComma(fanBoardData.list.length)}</div>
      </div>
      <SocialList socialList={fanBoardData.list} isMyProfile={isMyProfile} type="fanBoard" />
    </div>
  )
}

export default FanboardSection
