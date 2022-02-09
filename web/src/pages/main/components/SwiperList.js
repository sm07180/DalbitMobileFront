import React, {useEffect} from 'react'

import Swiper from 'react-id-swiper'

// global components
// components
// css
import './swiperList.scss'
import {useHistory} from "react-router-dom";

const SwiperList = (props) => {
  const {data, profImgName, type} = props
  const history = useHistory();

  const swiperParams = {
    slidesPerView: 'auto',
  }

  const goProfile = memNo => history.push(`/profile/${memNo}`);

  const onClickAction = (item) => {
    if(type === 'top10' || type === 'myStar') {
      goProfile(item.memNo)
    }else if(type === 'daldungs') {
      // 방송방으로 이동
    }
  }

  useEffect(() => {
    if (data.length > 0) {
      const swiper = document.querySelector('.top10 .swiper-container').swiper;
      swiper.update();
      swiper.slideTo(0);
    }
  }, [data]);

  return (
    <>
    {data.length > 0 &&
      <Swiper {...swiperParams}>
        {data.map((item,index) => {
          return (
            <div key={index}>
              <div className="listColumn" onClick={() => onClickAction(item)}>
                <div className="photo">
                  <img src={item[profImgName].thumb150x150} />
                  {item.rank && <div className={`rank-${item.rank}`}></div>}
                </div>
                <p className='userNick'>{item.nickNm ? item.nickNm : item.bj_nickName}</p>
              </div>
            </div>
          )
        })}
      </Swiper>
    }
    </>
  )
}

export default SwiperList
