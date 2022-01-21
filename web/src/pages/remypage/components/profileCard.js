import React from 'react'

import FrameItems from 'components/ui/frameItems/FrameItems'

import './profileCard.scss'

const ProfileCard = (props) => {
  const {data} = props

  return (
    <div className="cardWrap">
      <div className="userInfo">
        <div className="photo">
          <img src={data && data.profImg && data.profImg.thumb500x500} alt="" />
          <FrameItems content={data} />
        </div>
        <div className="info">
          <div className="item">
            <span className='level'>lv.{data.level}</span>
            <span className='gender'>{data.gender}</span>
            <span className='nick'>{data.nickNm}</span>
          </div>
          <div className="item">
            <span className='userid'>{data.memId}</span>
          </div>
        </div>
      </div>
      <div className="count">
        <div className="item">
          <span>{data.fanCnt}</span>
          <i>팬</i>
        </div>
        <div className="item">
          <span>{data.starCnt}</span>
          <i>스타</i>
        </div>
        <div className="item">
          <span>{data.likeTotCnt}</span>
          <i>좋아요</i>
        </div>
      </div>
      <div className="buttonWrap">
        <button>선물하기</button>
        <button className='addFan'>팬등록</button>
      </div>
    </div>
  )
}

export default ProfileCard
