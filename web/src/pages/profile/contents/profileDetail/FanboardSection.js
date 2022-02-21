import React from 'react'

// global components
import NoResult from 'components/ui/noResult/NoResult'
// components
import SocialList from '../../components/SocialList';
import Utility from "components/lib/utility";

const FanboardSection = (props) => {
  const { fanBoardData, isMyProfile, deleteContents, profileData, openBlockReportPop } = props;

  return (
    <div className="fanboardSection">
      {fanBoardData.list.length > 0 ?
        <SocialList socialList={fanBoardData.list} isMyProfile={isMyProfile} type="fanBoard"
                    deleteContents={deleteContents} profileData={profileData} openBlockReportPop={openBlockReportPop} />
        :
        <NoResult />
      }
    </div>
  )
}

export default FanboardSection
