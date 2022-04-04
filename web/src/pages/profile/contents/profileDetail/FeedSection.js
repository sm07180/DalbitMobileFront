import React, {useEffect} from 'react'
// global components
import NoResult from 'components/ui/noResult/NoResult'
// components
import SocialList from '../../components/SocialList';

const FeedSection = (props) => {
  const { profileData, feedData, openShowSlide, isMyProfile, openBlockReportPop, deleteContents, fetchHandleLike } = props;
  //context
  const { feedList, } = feedData;

  return (
    <div className="feedSection">
      {feedList.length > 0 ?
        <SocialList socialList={feedList} openShowSlide={openShowSlide} isMyProfile={isMyProfile} type="feed" fetchHandleLike={fetchHandleLike}
                    openBlockReportPop={openBlockReportPop} deleteContents={deleteContents} profileData={profileData}
        />
        :
        <NoResult />
      }
    </div>
  )
}

export default FeedSection
