import React, {useEffect} from 'react'

import Swiper from 'react-id-swiper'

import './showSwiper.scss'

const ShowSwiper = (props) => {
  const {imageList, popClose, imageKeyName, imageParam} = props

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
      swiper.update();
      swiper.slideTo(0);
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
                  <img src={`${item[imageKeyName]}${imageParam}`} alt="" />
                </div>
              </div>
            )
          })}
        </Swiper>
        : imageList.length === 1 &&
        (
          <div>
            <div className="photo">
              <img src={`${imageList[0][imageKeyName]}${imageParam}`} alt="" />
            </div>
          </div>
        )
      }
      <button className='popClose' onClick={clickPopClose} />
    </div>
  )
}

export default ShowSwiper

ShowSwiper.defaultProps = {
  imageKeyName: 'thumb500x500', //imageList 500x500이 없으면 이 값으로 사용 ex) 'url', 'thumb700x500'
  imageParam: '', //이미지 주소 비율 파라미터 ex) ?500x500
}