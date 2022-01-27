import React from 'react'

import Swiper from 'react-id-swiper'

// global components
// components
// css
import './swiperList.scss'

const SwiperList = (props) => {
  const {data, profImgName} = props

  const swiperParams = {
    slidesPerView: 'auto',
  }

  return (
    <>
    {data.length > 0 &&
      <Swiper {...swiperParams}>
        {data.map((list,index) => {
          return (
            <div key={index}>
              <ListColumn photo={list[profImgName].thumb150x150}>
                {list.rank && <div className={`rank-${list.rank}`}></div>}
                <p className='userNick'>{list.nickNm}</p>
              </ListColumn>
            </div>
          )
        })}
      </Swiper>
    }
    </>
  )
}

export default SwiperList
