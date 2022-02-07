import React, {useEffect} from 'react'

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
    },
  }

  const clickPopClose = (e) => {
    const target = e.target
    if (target.className === 'popClose') {
      popClose({open: false})
    }
  }

  useEffect(() => {
    if (data.profImgList.length > 1) {
      const swiper = document.querySelector('#popShowSwiper .swiper-container').swiper;
      swiper.update();
      swiper.slideTo(0);
    }
  }, [data]);

  return (
    <div id="popShowSwiper">
      {data.profImgList.length > 1 ?
        <Swiper {...swiperParams}>
          {data.profImgList.map((item, index) => {
            return (
              <div key={index}>
                <div className="photo">
                  <img src={item.profImg.thumb500x500} alt="" />
                </div>
              </div>
            )
          })}
        </Swiper>
        : data.profImgList.length === 1 &&
        (
          <div>
            <div className="photo">
              <img src={data.profImgList[0].profImg.thumb500x500} alt="" />
            </div>
          </div>
        )
      }
      <button className='popClose' onClick={clickPopClose} />
    </div>
  )
}

export default ShowSwiper