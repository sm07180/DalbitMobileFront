import React from 'react'
import {IMG_SERVER} from 'context/config'

import './totalInfo.scss'

const TotalInfo = (props) => {
  const {data} = props

  return (
    <>
      <div className="badgeInfo">
        <span className='badge'>{data.grade}</span>
        <span className='badge'>뱃지1</span>
        <span className='badge'>뱃지2</span>
        <span className='badge'>뱃지3</span>
      </div>
      <div className="rankInfo">
        <div className="box">
          <div className="title">
            <img src={`${IMG_SERVER}/mypage/dalla/infoTitle-1.png`} />
          </div>
          <div className="photoGroup">
            <div className="photo">
              <img src={data && data.profImg && data.profImg.thumb62x62} alt="" />
              <span className='badge'>1</span>
            </div>
            <div className="photo">
              <img src={data && data.profImg && data.profImg.thumb62x62} alt="" />
              <span className='badge'>2</span>
            </div>
            <div className="photo">
              <img src={data && data.profImg && data.profImg.thumb62x62} alt="" />
              <span className='badge'>3</span>
            </div>
          </div>
        </div>
        <div className="box">
          <div className="title">
            <img src={`${IMG_SERVER}/mypage/dalla/infoTitle-2.png`} />
          </div>
          <div className="photo">
            <img src={data && data.profImg && data.profImg.thumb62x62} alt="" />
          </div>
        </div>
      </div>
      <div className="comment">
        <div className="title">COMMENT</div>
        <div className="text">
          🤍 12/28일 저녁 7시 2021 둘기콘서트 🤍<br/>
          꼭 와서 같이 즐겨주세요 ㅎㅎ😊
        </div>
      </div>
    </>
  )
}

export default TotalInfo
