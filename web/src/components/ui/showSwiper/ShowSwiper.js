import React, {useEffect, useState} from 'react'

import Swiper from 'react-id-swiper'

import './showSwiper.scss'

const ShowSwiper = (props) => {
  const {imageList, popClose, imageKeyName, imageParam, initialSlide,
    showTopOptionSection, readerButtonAction, deleteButtonAction} = props

  const [swiper, setSwiper] = useState();

  const swiperParams = {
    slidesPerView: 'auto',
    // slideClass: '',
    pagination: {
      el: '.showSwiper-pagination',
      type: 'fraction'
    },
    on: {
      init: (a) => setSwiper(a)
    }
  }

  const clickPopClose = (e) => {
    const target = e.target
    if (target.className === 'popClose') {
      popClose(false)
    }
  }

  useEffect(() => {
    if (imageList.length > 1) {
      const swiper = document.querySelector('#popShowSwiper .swiper-container')?.swiper;
      swiper?.update();
      swiper?.slideTo(initialSlide);
    }
  }, [imageList]);

  return (
    <div id="popShowSwiper">
      <div className="showWrapper">
        {showTopOptionSection &&
        <div className="buttonGroup">
          <button onClick={() => readerButtonAction(imageList[imageList.length>1 ? swiper?.activeIndex: 0]?.idx) }>대표 사진</button>
          <button onClick={() => deleteButtonAction(imageList[imageList.length>1 ? swiper?.activeIndex: 0]?.idx) }>삭제</button>
        </div>
        }
        {imageList.length > 1 ?
          <Swiper {...swiperParams}>
            {imageList.map((item, index) => {
              return (
                <div key={index}>
                  {/*프로필 편집에서 사용하는 영역*/}
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
      </div>
      <button className='popClose' onClick={clickPopClose} />
    </div>
  )
}

export default ShowSwiper

ShowSwiper.defaultProps = {
  imageKeyName: 'thumb500x500', //imageList 500x500이 없으면 이 값으로 사용 ex) 'url', 'thumb700x500'
  imageParam: '', //이미지 주소 비율 파라미터 ex) ?500x500
  initialSlide : 0,
  showTopOptionSection: false, // 대표 이미지버튼, 삭제 버튼 노출 여부
  readerButtonAction: ()=>{}, // 대표 이미지 버튼 클릭이벤트
  deleteButtonAction: ()=>{}, // 삭제 이미지 버튼 클릭이벤트
}