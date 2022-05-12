import React, {useEffect} from 'react'
// global components
import NoResult from 'components/ui/noResult/NoResult'
// components
import SocialList from '../../components/SocialList';

const FeedSection = (props) => {
  const { profileData, feedData, openShowSlide, isMyProfile, openSlidePop, deleteContents, fetchHandleLike, showImagePopUp} = props;
  //context
  const { feedList } = feedData;

  return (
    <div className="feedSection">
      {feedList.length > 0 ?
        <SocialList socialList={feedList} openShowSlide={openShowSlide} isMyProfile={isMyProfile} type="feed" fetchHandleLike={fetchHandleLike}
        openSlidePop={openSlidePop} deleteContents={deleteContents} profileData={profileData} showImagePopUp={showImagePopUp}
        />
        :
        <NoResult img={'common/listNone/listNone-profile.png'} ment={'팬들과 나누고싶은 이야기를\n적어보세요!'}/>
      }
    </div>
  )
}

export default FeedSection
