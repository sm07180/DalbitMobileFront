import React from 'react'

// global components
import NoResult from 'components/ui/noResult/NoResult'
// components
import SocialList from "../../components/SocialList";
import Utility from "components/lib/utility";

const FanboardSection = (props) => {
  const { fanBoardData, isMyProfile, deleteContents, profileData } = props;

  return (
    <div className="fanboardSection">
      <div className="subArea">
        <div className="title">전체 {Utility.addComma(fanBoardData.list.length)}</div>
      </div>
      {fanBoardData.list.length > 0 ?
        <SocialList socialList={fanBoardData.list} isMyProfile={isMyProfile} type="fanBoard" deleteContents={deleteContents} profileData={profileData}/>
        :
        <NoResult />
      }
    </div>
  )
}

export default FanboardSection
