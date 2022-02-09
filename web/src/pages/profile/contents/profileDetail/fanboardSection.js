import React from 'react'

// global components
import NoResult from 'components/ui/noResult/NoResult'
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
      {fanBoardData.list.length > 0 ?
        <SocialList socialList={fanBoardData.list} isMyProfile={isMyProfile} type="fanBoard" />
        :
        <NoResult />
      }
    </div>
  )
}

export default FanboardSection
