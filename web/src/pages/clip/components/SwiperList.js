import React from 'react'

import Swiper from 'react-id-swiper'
// global components
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
          {data.map((list, index)=>{
            return(
              <div key={index}>
                <ListColumn photo={list.bgImg.thumb100x100}>
                  <div className="title">{list.title}</div>
                  <div className="nick">{list.nickName}</div>
                </ListColumn>
              </div>
            )
          })}
        </Swiper>
      }
    </>
  )
};

export default SwiperList;
