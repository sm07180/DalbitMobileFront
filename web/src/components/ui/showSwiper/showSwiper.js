import React from 'react'

import Swiper from 'react-id-swiper'

import './showSwiper.scss'

const ShowSwiper = (props) => {
  const {data, popClose} = props

  const swiperParams = {
    slidesPerView: 'auto',
    // slideClass: '',
    pagination: {
      el: '.showSwiper-pagination',
      type: 'fraction'
    }
  }

  const clickPopClose = (e) => {
    const target = e.target
    if (target.className === 'popClose') {
      popClose({open: false})
    }
  }

  return (
    <div id="popShowSwiper">
      <div className="buttonGroup">
        <button>대표 사진</button>
        <button>삭제</button>
      </div>
      <Swiper {...swiperParams}>
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
      <button className='popClose' onClick={clickPopClose}></button>
    </div>
  )
}

export default ShowSwiper