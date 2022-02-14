import React, {useEffect} from 'react'
import {IMG_SERVER} from 'context/config'

import Swiper from 'react-id-swiper'

import './topSwiper.scss'

const TopSwiper = (props) => {
  const {data, openShowSlide} = props
  
  const swiperPicture = {
    slidesPerView: 'auto',
    spaceBetween: 8,
    autoplay: {
      delay: 100000,
      disableOnInteraction: false
    },
    // pagination: {
    //   el: '.swiper-pagination',
    //   type: 'fraction'
    // },
  }

  useEffect(() => {
    if (data.profImgList.length > 1) {
      const swiper = document.querySelector('.topSwiper>.swiper-container').swiper;
      swiper.update();
      swiper.slideTo(0);
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
            <img src={data.profImgList[0].profImg.thumb500x500} style={{width:'100%', height:'360px'}} alt="" />
          </div>
        </div>
        :
        <div
          className='swiper-slide'
          style={{
            backgroundImage: `url("https://devphoto2.dalbitlive.com/profile_3/profile_m_200327.jpg")`,
            backgroundSize: 'cover'
          }}
        />
      }
      <div className="swiperBottom">
        {data.specialDjCnt > 0 || true &&
          <div className="specialBdg">
            <img src={`${IMG_SERVER}/profile/profile_specialBdg.png`} alt="" />
            <span>{data.specialDjCnt}회</span>
          </div>
        }
        {data.roomNo !== "" || data.listenRoomNo !== "" || true &&
          <div className="liveBdg">
            <img src={`${IMG_SERVER}/profile/profile_liveBdg-1.png`} alt="LIVE" />
          </div>
        }
        <div className="pagination">
          1/{data.profImgList.length}
        </div>
      </div>
    </>
  )
}

export default TopSwiper
