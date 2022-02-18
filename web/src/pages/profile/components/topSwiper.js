import React, {useContext, useEffect} from 'react'
import {IMG_SERVER} from 'context/config'

import Swiper from 'react-id-swiper'

import './topSwiper.scss'
import {Context} from "context";
import {RoomValidateFromProfile} from "common/audio/clip_func";
import {useHistory} from "react-router-dom";

const TopSwiper = (props) => {
  const {data, openShowSlide, webview} = props
  const context = useContext(Context);
  const history = useHistory();
  
  const swiperPicture = {
    slidesPerView: 'auto',
    spaceBetween: 8,
    autoplay: {
      delay: 100000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction'
    },
  }

  const roomJoinHandler = () => {
    const params = {
      roomNo: data.roomNo,
      history,
      context,
      nickNm: data.nickNm,
      listenRoomNo: data.listenRoomNo,
      webview
    }
    RoomValidateFromProfile(params);
  }

  useEffect(() => {
    if (data.profImgList.length > 1) {
      const swiper = document.querySelector('.topSwiper>.swiper-container')?.swiper;
      swiper?.update();
      swiper?.slideTo(0);
    }
  }, [data]);

  return (
    <>
      {data.profImgList.length > 1 ?
        <Swiper {...swiperPicture}>
          {data.profImgList.map((item, index) => {
            return (
              <div key={index} onClick={() => {openShowSlide(data.profImgList)}}>
                <div className="photo">
                  <img src={item.profImg.thumb500x500} alt="" />
                </div>
              </div>
            )
          })}
        </Swiper>
        : data.profImgList.length === 1 ?
        <div onClick={() => openShowSlide(data.profImgList)}>
          <div className="photo">
            <img src={data.profImgList[0].profImg.thumb500x500} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="" />
          </div>
        </div>
        :
        <div
          className='swiper-slide'
          style={{
            backgroundImage: `url("${IMG_SERVER}/profile/photoNone.png")`,
            backgroundSize: 'cover'
          }}
        />
      }
      <div className="swiperBottom">
        {data.specialDjCnt > 0 &&
          <div className="specialBdg">
            <img src={`${IMG_SERVER}/profile/profile_specialBdg.png`} alt="" />
            <span>{data.specialDjCnt}회</span>
          </div>
        }
        {webview === '' && (data.roomNo !== "" || data.listenRoomNo !== "") &&
          <div className="liveBdg">
            <img src={`${IMG_SERVER}/profile/profile_liveBdg-1.png`} alt="LIVE" onClick={roomJoinHandler} />
          </div>
        }
      </div>
    </>
  )
}

export default TopSwiper
