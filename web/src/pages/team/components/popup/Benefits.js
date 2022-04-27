import React from 'react';
import Swiper from 'react-id-swiper';
import {IMG_SERVER} from 'context/config';
// global components
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn';

import '../../scss/benefits.scss';

const BenefitsPop = (props) => {
  const {closePopup} = props;

  const slideItem = [{
    imgSrc: `${IMG_SERVER}/team/benefitImg-1.png`
  },
  {
    imgSrc: `${IMG_SERVER}/team/benefitImg-2.png`
  },
  {
    imgSrc: `${IMG_SERVER}/team/benefitImg-3.png`
  },
  {
    imgSrc: `${IMG_SERVER}/team/benefitImg-4.png`
  }];

  const swiperParams = {
    speed: 700,
    pagination: {
      el: '.swiper-pagination'
    }
  };

  // 페이지 시작
  return (
    <>
    {slideItem && slideItem.length > 0 &&
      <Swiper {...swiperParams}>
        {slideItem.map((data,index) => {
          return (
            <div key={index}>
              <img src={data.imgSrc} />
            </div>
          )
        })}
      </Swiper>
    }
    <SubmitBtn text="확인" onClick={closePopup} />
    </>
  )
}

export default BenefitsPop;