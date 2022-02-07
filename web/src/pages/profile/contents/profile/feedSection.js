import React, {useContext} from 'react'
import {Context} from 'context'

import Swiper from 'react-id-swiper'
// components
import SocialList from '../../components/SocialList'

const FeedSection = (props) => {
  const { profileData, feedData } = props;
  const { feedList, fixedFeedList, fixCnt, scrollPaging } = feedData;
  //context
  const context = useContext(Context)
  const {token, profile} = context

  const data = profile

  // 스와이퍼
  const swiperParams = {
    slidesPerView: 'auto',
  }

  return (
    <div className="feedSection">
      {fixCnt > 0 &&
      <div className="fixFeed">
        <div className="title">
          <div className="text">{profileData.nickNm}님이 고정함</div>
          <button>더보기</button>
        </div>
        <Swiper {...swiperParams}>
          {fixedFeedList.map((item) => {
            return (
              <div key={item.noticeIdx}>
                <div className="feedBox">
                  <div className={`text ${item.profImg.isDefaultImg ? 'add' : ''}`}>{item.title}</div>
                  <div className="info">
                    <span className="time">{item.writeDate}</span>
                    {!item.profImg.isDefaultImg &&
                      <div className="thumb">
                        <img src={item.profImg.thumb50x50} alt="" />
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
      }
      <SocialList profileData={profileData} list={feedList} picture={true}/>
    </div>
  )
}

export default FeedSection
