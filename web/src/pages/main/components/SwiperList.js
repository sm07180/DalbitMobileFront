import React from 'react'
import Swiper from 'react-id-swiper'

// components
import ListColumn from 'components/ui/listColumn/ListColumn'

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
              <ListColumn list={list} key={index} />
            </div>
          )
        })}
      </Swiper>
    }
    </>
  )
}

export default SwiperList
