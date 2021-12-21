import React, {useEffect} from 'react';
import Swiper from 'react-id-swiper';
import {IMG_SERVER} from 'context/config';
import './popup.scss';

const PopupNotice = (props) => {
  const {onClose} = props

  const swiperParams = {
    pagination: {
      el: '.swiper-pagination'
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, []);

  return (
    <div id="popup">
      <div className="wrapper">
        <Swiper {...swiperParams}>
          <div>
            <img src={`${IMG_SERVER}/event/tree/slideImg-1.png`} />
          </div>
          <div>
            <img src={`${IMG_SERVER}/event/tree/slideImg-2.png`} />
          </div>
        </Swiper>
        <button className="closeBtn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  )
};

export default PopupNotice;