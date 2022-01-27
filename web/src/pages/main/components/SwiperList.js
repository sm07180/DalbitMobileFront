import React from 'react'

import Swiper from 'react-id-swiper'

// global components
// components
// css
import './swiperList.scss'

const SwiperList = (props) => {
  const {data} = props

  const swiperParams = {
    slidesPerView: 'auto',
  }

  return (
    <>
    {data && data.length > 0 &&
      <Swiper {...swiperParams}>
        {data.map((list,index) => {
          return (
            <div key={index}>
              <div className='listColumn'>
                <div className="photo">
                  <img src={list.profImg.thumb150x150} />
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
