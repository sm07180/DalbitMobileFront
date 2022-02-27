import React from 'react'

import Swiper from 'react-id-swiper'
// global components
import ListColumn from 'components/ui/listColumn/ListColumn'

const SwiperList = (props) => {
  const {data, playAction} = props
  
  const swiperParams = {
    slidesPerView: 'auto',
  }

  return (
    <>
      {(data && data.length > 0) ?
        <Swiper {...swiperParams}>
          {data.map((list, index)=>{
            return(
              <div key={index} data-clip-no={list.clipNo} onClick={playAction}>
                <ListColumn photo={list.bgImg.thumb292x292}>
                  <div className="title">{list.title}</div>
                  <div className="nick">{list.nickName}</div>
                </ListColumn>
              </div>
            )
          })}
        </Swiper>
        :
        <div className="empty">데이터가 없습니다.</div>
      }

    </>
  )
};

export default SwiperList;
