import React from 'react'

// global components
import Swiper from 'react-id-swiper'
import GenderItems from 'components/ui/genderItems/GenderItems'
// components
// css
import '../scss/swiperList.scss'

const HotLiveList = (props) => {
  const {data, type} = props

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
              <div className="listColumn">
                <div className="photo">
                  <img src={list.bgImg.thumb150x150} />
                  {list.roomType === '03' && <div className="badgeVideo"></div>}
                </div>
                <p className='nick'>{list.nickNm}</p>
              </div>
            </div>
          )
        })}
      </Swiper>
      }
    </>
  )
}

export default HotLiveList;
