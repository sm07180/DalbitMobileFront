import React from 'react'
import {IMG_SERVER} from 'context/config'

import './totalInfo.scss'

const TotalInfo = (props) => {
  const {data, goProfile} = props

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
                  <img src="https://devphoto2.dalbitlive.com/profile_0/21187670400/20210825130810973619.jpeg?62x62" alt="" />
                </div>
              )
            })}
          </div>
        </div>
        <div className="box" onClick={() => goProfile(data.cupidMemNo)}>
          <div className="title">
            <img src={`${IMG_SERVER}/mypage/dalla/infoTitle-2.png`} alt="" />
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
      <div className="comment">
        <div className="title">COMMENT</div>
        <div className="text">
          {data.profMsg}
        </div>
      </div>
    </>
  )
}

export default TotalInfo
