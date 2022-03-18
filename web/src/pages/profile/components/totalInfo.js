import React, {useEffect, useState} from 'react'
import {IMG_SERVER} from 'context/config'
import Swiper from 'react-id-swiper'
// global components
import BadgeItems from 'components/ui/badgeItems/BadgeItems'

import './totalInfo.scss'
import Utility from "components/lib/utility";

const TotalInfo = (props) => {
  const {data, goProfile, openPopLike, isMyProfile} = props
  const [openBadge,setOpenBadge] = useState(false);
  const [badgeTotalCnt,setBadgeTotalCnt] = useState(0);
  // 
  const onOpenBdage = () => {
    setOpenBadge(!openBadge)
  }

  const openPopAction = (e) => {
    const tabState = {
      titleTab: 0,
      subTab: 0,
      subTabType: isMyProfile ? 'fanRank' : ''
    }
    openPopLike(e, tabState)
  }
  
  // 스와이퍼
  const swiperParams = {
    slidesPerView: 'auto',
  }

  useEffect(() => {
    let badgeLength = 0;
    if(data.badgeSpecial > 0) {
      badgeLength++
      setBadgeTotalCnt(badgeLength)
    }
    if(data.isSpecial) {
      badgeLength++
      setBadgeTotalCnt(badgeLength)
    }
    if(data.commonBadgeList.length > 0) {
      for(let i = 0; i < data.commonBadgeList.length; i++){
        badgeLength++
        setBadgeTotalCnt(badgeLength)
      }
    }
  },[data])

  return (
    <>
      {badgeTotalCnt !== 0 &&
        <div className={`badgeInfo ${openBadge && 'isOpen'}`}>
          <div className="title">뱃지</div>
          <div className="badgeGroup">
            <BadgeItems data={data} type="commonBadgeList" />
            <BadgeItems data={data} type="isBadge" />
          </div>
          {badgeTotalCnt > 3 &&
            <button onClick={onOpenBdage}>열기/닫기</button>
          }
        </div>
      }
      <div className="rankInfo">
        <div className="box">
          <div className="title" style={{cursor: 'pointer'}}
               onClick={openPopAction}>
            <img src={`${IMG_SERVER}/profile/infoTitle-1.png`} />
          </div>
          <div className="photoGroup">
            {data.fanRank.map((item, index) => {
              return (
                <div className="photo" key={index} onClick={() => goProfile(item.memNo)}>
                  <img src={item.profImg.thumb62x62} alt="" />
                  <span className='badge'>{index+1}</span>
                </div>
              )
            })}
            {[...Array(3 - data.fanRank.length)].map((item, index) => {
              return (
                <div className="photo" key={index}>
                  <img src={`${IMG_SERVER}/common/photoNone-2.png`} alt="기본 이미지" />
                </div>
              )
            })}
          </div>
        </div>
        <div className="box" onClick={() => goProfile(data.cupidMemNo)}>
          <div className="title" style={{cursor: 'pointer'}} onClick={openPopLike}>
            <img src={`${IMG_SERVER}/profile/infoTitle-2.png`} alt="" />
          </div>
          {data.cupidProfImg && data.cupidProfImg.path ?
            <div className="photo">
              <img src={data.cupidProfImg.thumb62x62} alt=""/>
            </div>
            :
            <div className="photo">
              <img src={`${IMG_SERVER}/common/photoNone-2.png`} alt="기본 이미지" />
            </div>
          }
        </div>
      </div>
      {data.profMsg &&
        <div className="comment">
          <div className="title">코멘트</div>
          <div className="text" dangerouslySetInnerHTML={{__html: Utility.nl2br(data.profMsg)}} />
        </div>
      }
      <div className="broadcastNotice">
        <div className="title">방송공지</div>
        <Swiper {...swiperParams}>
          <div>
            <div className="feedBox">
              <div className="badge">Notice</div>
              <div className="text">세아의 팬닉입니다. 닉변은 피해줘요!
              다른 방을 청취하고 선물하는 것은 세아의 팬닉입니다. 닉변은 피해줘요!
              다른 방을 청취하고 선물하는 것은</div>
              <div className="info">
                <i className="like">156</i>
                <i className="cmt">123</i>
              </div>
            </div>
          </div>
          <div>
            <div className="feedBox">
              <div className="badge">Notice</div>
              <div className="text">세아의 팬닉입니다. 닉변은 피해줘요!
              다른 방을 청취하고 선물하는 것은 세아의 팬닉입니다. 닉변은 피해줘요!
              다른 방을 청취하고 선물하는 것은</div>
              <div className="info">Notice</div>
            </div>
          </div>
          <div>
            <div className="feedBox">
              <div className="badge">Notice</div>
              <div className="text">세아의 팬닉입니다. 닉변은 피해줘요!
              다른 방을 청취하고 선물하는 것은...</div>
              <div className="info">Notice</div>
            </div>
          </div>
          <div>
            <div className="feedBox">
              <div className="badge">Notice</div>
              <div className="text">세아의 팬닉입니다. 닉변은 피해줘요!
              다른 방을 청취하고 선물하는 것은...</div>
              <div className="info">Notice</div>
            </div>
          </div>
          <div>
            <div className="feedBox">
              <div className="badge">Notice</div>
              <div className="text">세아의 팬닉입니다. 닉변은 피해줘요!
              다른 방을 청취하고 선물하는 것은...</div>
              <div className="info">Notice</div>
            </div>
          </div>
          <div>
            <div className="feedBox">
              <div className="badge">Notice</div>
              <div className="text">세아의 팬닉입니다. 닉변은 피해줘요!
              다른 방을 청취하고 선물하는 것은...</div>
              <div className="info">Notice</div>
            </div>
          </div>
          <div>
            <div className="feedBox">
              <div className="badge">Notice</div>
              <div className="text">세아의 팬닉입니다. 닉변은 피해줘요!
              다른 방을 청취하고 선물하는 것은...</div>
              <div className="info">Notice</div>
            </div>
          </div>
        </Swiper>
      </div>
    </>
  )
}

export default TotalInfo
