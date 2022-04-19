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
      <div className="teamInfo">
        <img src={`${IMG_SERVER}/profile/teamInfo-title.png`} alt="team" className="title" />
        <div className="teamSymbol">
          <img src={"https://image.dalbitlive.com/team/parts/E/e007.png"} />
          <img src={"https://image.dalbitlive.com/team/parts/B/b009.png"} />
          <img src={"https://image.dalbitlive.com/team/parts/M/m007.png"} />
        </div>
        <div className="teamName">asdfasdfasdfasdfasdj;aj;flaj;dfja;ldjfa</div>
        <button>가입신청</button>
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
