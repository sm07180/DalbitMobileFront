import React from 'react'

// global components
import Swiper from 'react-id-swiper'
import ListRow from 'components/ui/listRow/ListRow'

const CardList = (props) => {
  const {data} = props
  
  // 스와이퍼
  const swiperParams = {
    slidesPerView: 'auto',
    loop: false
  }

  return (
    <React.Fragment>
      {data && data.length > 0 &&    
        <Swiper {...swiperParams}>
            {data.map((list, index) => {
              return (
                <div key={index}>
                  <ListRow photo={list.profImg.thumb292x292}>
                    <div className='rankWrap'>
                      <div className='rank'>{list.rank}</div>
                    </div>
                    <div className='infoWrap'>
                      {list.roomNo && <div className='livetag'>LIVE</div>}
                      <div className='userNick'>{list.nickNm}</div>
                    </div>
                  </ListRow>
                </div>
              )
            })}
        </Swiper>
      }
    </React.Fragment>
  )
}

export default CardList
