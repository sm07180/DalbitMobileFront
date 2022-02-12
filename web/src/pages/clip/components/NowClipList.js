import React from 'react'

import Swiper from 'react-id-swiper'
// global components
import ListRow from 'components/ui/listRow/ListRow'

const NowClipList = (props) => {
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
                <div className='listWrap' style={{backgroundImage:`url('${list.bgImg.thumb500x500}')`}}>
                  <ListRow photo={list.bgImg.thumb50x50}>
                    <div className='listContent'>
                      <span className='title'>{list.title}</span>
                      <span className='nick'>{list.nickName}</span>
                    </div>
                  </ListRow>
                </div>
                <div className='listWrap' style={{backgroundImage:`url('${list.bgImg.thumb500x500}')`}}>
                  <ListRow photo={list.bgImg.thumb50x50}>
                    <div className='listContent'>
                      <span className='title'>{list.title}</span>
                      <span className='nick'>{list.nickName}</span>
                    </div>
                  </ListRow>
                </div>
                <div className='listWrap' style={{backgroundImage:`url('${list.bgImg.thumb500x500}')`}}>
                  <ListRow photo={list.bgImg.thumb50x50}>
                    <div className='listContent'>
                      <span className='title'>{list.title}</span>
                      <span className='nick'>{list.nickName}</span>
                    </div>
                  </ListRow>
                </div>
              </div>
            )
          })}
        </Swiper>
      }
    </>
  )
}

export default NowClipList
