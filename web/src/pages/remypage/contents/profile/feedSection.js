import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Swiper from 'react-id-swiper'
// components
import SocialList from '../../components/socialList'

const FeedSection = (props) => {
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
      <div className="fixFeed">
        <div className="title">
          <div className="text">{data.nickNm}님이 고정함</div>
          <button>더보기</button>
        </div>
        <Swiper {...swiperParams}>
          <div>
            <div className="feedBox">
              <div className="text">하단 thumb이 있을때 두번째 줄까지 말줄임합니다. ㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎ...</div>
              <div className="info">
                <span className="time">3시간 전</span>
                <div className="thumb">
                  <img src={data && data.profImg && data.profImg.thumb50x50} alt="" />
                  <span className="count">+3</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="feedBox">
              <div className={`text ${true ? 'add' : ''}`}>하단 thumb이 없을때 4번째줄까지 나와야합니다. 희희희ㅣㅇ 오늘은 휴방입니다 ㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎ...</div>
              <div className="info">
                <span className="time">3시간 전</span>
              </div>
            </div>
          </div>
          <div>
            <div className="feedBox">
              <div className="text">희희희ㅣㅇ 오늘은 휴방입니다 ㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎ...</div>
              <div className="info">
                <span className="time">3시간 전</span>
                <div className="thumb">
                  <img src={data && data.profImg && data.profImg.thumb50x50} alt="" />
                  <span className="count">+3</span>
                </div>
              </div>
            </div>
          </div>
        </Swiper>
      </div>
      <SocialList data={data} picture={true}/>
    </div>
  )
}

export default FeedSection
