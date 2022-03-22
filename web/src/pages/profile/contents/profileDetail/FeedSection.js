import React from 'react'

import Swiper from 'react-id-swiper'
// global components
import NoResult from 'components/ui/noResult/NoResult'
// components
import SocialList from '../../components/SocialList';
import {useHistory, useParams} from "react-router-dom";

const FeedSection = (props) => {
  const history = useHistory();
  const {memNo} = useParams();
  const { profileData, feedData, openShowSlide, isMyProfile, openBlockReportPop, deleteContents, fetchLikeData, fetchHandleLike } = props;
  //context
  const { feedList, fixedFeedList} = feedData;

  // 스와이퍼
  const swiperParams = {
    slidesPerView: 'auto',
  }

  return (
    <div className="feedSection">
      {/*{fixCnt > 0 &&
      <div className="fixFeed">
        <div className="title">
          <div className="text">{profileData.nickNm}님이 고정함</div>
          <button>더보기</button>
        </div>
        <Swiper {...swiperParams}>
          {fixedFeedList.map((item) => {
            return (
              <div key={item.noticeIdx} onClick={() => history.push(`/profileDetail/${memNo || profileData?.memNo}/feed/${item.noticeIdx}`)}>
                <div className="feedBox">
                  <div className={`text ${item?.photoInfoList?.length > 0 ? 'add' : ''}`}>{item.title}</div>
                  <div className="info">
                    <span className="time">{item.writeDate}</span>
                    {item?.photoInfoList?.length > 0 &&
                      <div className="thumb">
                        <img src={item?.photoInfoList[0]?.imgObj?.thumb292x292} alt="" />
                        {item.photoInfoList.length > 1 &&
                          <span className="count">{`+${item.photoInfoList.length -1}`}</span>
                        }
                      </div>
                    }
                  </div>
                </div>
              </div>
            )
          })}
        </Swiper>
      </div>
      }*/}
      {feedList.length > 0 ?
        <SocialList socialList={feedList} socialFixList={fixedFeedList} openShowSlide={openShowSlide} isMyProfile={isMyProfile} type="feed" fetchHandleLike={fetchHandleLike}
                    openBlockReportPop={openBlockReportPop} deleteContents={deleteContents} profileData={profileData} fetchLikeData={fetchLikeData}
        />
        :
        <NoResult />
      }
    </div>
  )
}

export default FeedSection
