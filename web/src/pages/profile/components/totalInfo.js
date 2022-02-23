import React, {useEffect, useState} from 'react'
import {IMG_SERVER} from 'context/config'
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
      <div className={`badgeInfo ${openBadge && 'isOpen'}`}>
        <div className="title">뱃지</div>
        <div className="badgeGroup">
          <span className="badgeItem grade">{data.grade}</span> {/* 무조건 출력되어야함 */}
          <BadgeItems data={data} type="commonBadgeList" />
          <BadgeItems data={data} type="isBadge" />
        </div>
        {badgeTotalCnt > 3 &&
          <button onClick={onOpenBdage}>열기/닫기</button>
        }
      </div>
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
                  <img src="https://photo.dalbitlive.com/profile_3/profile_m_200327.jpg?62x62" alt="" />
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
              <img src="https://devphoto2.dalbitlive.com/profile_0/21187670400/20210825130810973619.jpeg?62x62" alt="" />
            </div>
          }
        </div>
      </div>
      {
        data.profMsg &&
          <div className="comment">
            <div className="title">
              <img src={`${IMG_SERVER}/profile/comment_title.png`} alt="" />
            </div>
            <div className="text" dangerouslySetInnerHTML={{__html: Utility.nl2br(data.profMsg)}} />
          </div>
      }      
    </>
  )
}

export default TotalInfo
