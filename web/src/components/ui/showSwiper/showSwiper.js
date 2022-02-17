import React, {useEffect} from 'react'

import Swiper from 'react-id-swiper'

import './showSwiper.scss'

const ShowSwiper = (props) => {
  const {imageList, popClose} = props

  const swiperParams = {
    slidesPerView: 'auto',
    // slideClass: '',
    pagination: {
      el: '.showSwiper-pagination',
      type: 'fraction'
    },
  }

  const clickPopClose = (e) => {
    const target = e.target
    if (target.className === 'popClose') {
      popClose(false)
    }
  }

  useEffect(() => {
    if (imageList.length > 1) {
      const swiper = document.querySelector('#popShowSwiper .swiper-container').swiper;
      swiper?.update();
      swiper?.slideTo(0);
    }
  }, [imageList]);

  return (
    <div id="popShowSwiper">
      {imageList.length > 1 ?
        <Swiper {...swiperParams}>
          {imageList.map((item, index) => {
            return (
              <div key={index}>
                <div className="photo">
                  <img src={item.thumb500x500} alt="" />
                </div>
              </div>
            )
          })}
        </Swiper>
        : imageList.length === 1 &&
        (
          <div>
            <div className="photo">
              <img src={imageList[0].thumb500x500} alt="" />
            </div>
          </div>
        )
      }
      <button className='popClose' onClick={clickPopClose} />
    </div>
  )
}

export default ShowSwiper
