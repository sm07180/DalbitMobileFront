import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
import Swiper from 'react-id-swiper'
import Header from '../../../components/ui/header/Header'

import './myprofile.scss'

const Myprofile = () => {
  const history = useHistory()
  //context
  const context = useContext(Context)
  const {token, profile} = context
  
  const [profileInfo, setProfileInfo] = useState()
  
  // 조회 API
  const fetchProfileInfo = (memNo) => {
    Api.profile({params: {memNo: memNo}}).then((res) => {
      if (res.result === 'success') {
        setProfileInfo(res.data)
      }
    })
  }

  // 스와이퍼
  const swiperPicture = {
    slidesPerView: 'auto',
    autoplay: {
      delay: 100000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction'
    }
  }

  useEffect(() => {
    fetchProfileInfo(token.memNo)
  },[token.memNo])

  // 페이지 시작
  return (
    <div id="myprofile">
      <Header title={'프로필'} />
      <section className='topSwiper'>
        <Swiper {...swiperPicture}>
          <div>
            <div className="photo">
              <img src={profileInfo && profileInfo.profImg && profileInfo.profImg.thumb500x500} alt="" />
            </div>
          </div>
          <div>
            <div className="photo">
              <img src={profileInfo && profileInfo.profImg && profileInfo.profImg.thumb500x500} alt="" />
            </div>
          </div>
        </Swiper>
      </section>
      <section className="profileCard">
        <div className="cardWrap">
          <div className="userInfo">
            <div className="photo">
              <img src={profileInfo && profileInfo.profImg && profileInfo.profImg.thumb190x190} alt="" />
              <div className="frame"></div>
            </div>
            <div className="info">
              <div className="item">
                <span className='level'>lv.50</span>
                <span className='gender'>m</span>
                <span className='nick'>세상 아름다운 DJ쩡</span>
              </div>
              <div className="item">
                <span className='userid'>hgehdms9512</span>
              </div>
            </div>
          </div>
          <div className="count">
            <div className="item">
              <span>12,233</span>
              <i>팬</i>
            </div>
            <div className="item">
              <span>12,233</span>
              <i>스타</i>
            </div>
            <div className="item">
              <span>12,233</span>
              <i>좋아요</i>
            </div>
          </div>
          <div className="buttonWrap">
            <button>선물하기</button>
            <button>팬등록</button>
          </div>
        </div>
      </section>
      <section className='totalInfo'>
        <div className="badgeInfo">
          <span className='badge'>112123</span>
          <span className='badge'>112123</span>
          <span className='badge'>112123</span>
        </div>
        <div className="rankInfo">
          <div className="box">
            <i className="title">TOP3</i>
            <div className="photoGroup">
              <div className="photo">
                <img src="" alt="" />
                <span className='badge'>1</span>
              </div>
              <div className="photo">
                <img src="" alt="" />
                <span className='badge'>2</span>
              </div>
              <div className="photo">
                <img src="" alt="" />
                <span className='badge'>3</span>
              </div>
            </div>
          </div>
          <div className="box">
            <i className="title">CUPID</i>
            <div className="photo">
              <img src="" alt="" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Myprofile
