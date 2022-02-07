import React from 'react'

import Swiper from 'react-id-swiper'

// global components
// components
// css
import './swiperList.scss'
import {useHistory} from "react-router-dom";

const SwiperList = (props) => {
  const {data, profImgName} = props
  const history = useHistory();

  const swiperParams = {
    slidesPerView: 'auto',
  }

  const goProfile = memNo => history.push(`/profile/${memNo}`);

  return (
    <>
    {data.length > 0 &&
      <Swiper {...swiperParams}>
        {data.map((list,index) => {
          return (
            <div key={index}>
              <div className="listColumn" onClick={() => goProfile(list.memNo)}>
                <div className="photo">
                  <img src={list[profImgName].thumb150x150} />
                  {list.rank && <div className={`rank-${list.rank}`}></div>}
                </div>
                <p className='userNick'>{list.nickNm}</p>
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
