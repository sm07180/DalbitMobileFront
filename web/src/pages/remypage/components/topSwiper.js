import React from 'react'
import Swiper from 'react-id-swiper'

import './topSwiper.scss'

const TopSwiper = (props) => {
  const {data} = props
  
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
    }
  }

  return (
    <>
      <Swiper {...swiperPicture}>
        <div>
          <div className="photo">
            <img src={data && data.profImg && data.profImg.thumb500x500} alt="" />
          </div>
        </div>
        <div>
          <div className="photo">
            <img src={data && data.profImg && data.profImg.thumb500x500} alt="" />
          </div>
        </div>
      </Swiper>
    </>
  )
}

export default TopSwiper
