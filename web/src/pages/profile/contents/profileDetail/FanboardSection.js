import React from 'react'

// global components
import NoResult from 'components/ui/noResult/NoResult';
// components
import CheckList from '../../components/CheckList';
import SocialList from '../../components/SocialList';
import Utility from "components/lib/utility";

const FanboardSection = (props) => {
  const { fanBoardData, isMyProfile, deleteContents, profileData, openBlockReportPop } = props;

  return (
    <div className="fanboardSection">
      <div className="writeWrap">
        <div className="fanboardWrite">
          <textarea rows="7" placeholder="내용을 입력해 주세요." />
          <div className="writeBottom">
            <CheckList text="비공개" />
            <button className="btn">등록</button>
          </div>
        </div>
      </div>
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
