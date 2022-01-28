import React from 'react'
import Swiper from 'react-id-swiper'

// components
import ListColumn from 'components/ui/listColumn/ListColumn'

const SwiperList = (props) => {
  const {data, profImgName} = props

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
              <ListColumn photo={list[profImgName].thumb150x150}>
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
