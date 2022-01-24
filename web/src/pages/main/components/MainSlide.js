import React from 'react'
import Swiper from 'react-id-swiper'

// components
import ListColumn from 'components/ui/listColumn/ListColumn'

const MainSlide = (props) => {
  const {data} = props

  const swiperParams = {
    loop: true,
    autoplay: {
      delay: 10000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction'
    }
  }

  return (
    <>
      {data && data.length > 0 &&
        <Swiper {...swiperParams}>
          {data.map((list, index) => {
            return (
              <div key={index}>
                <ListColumn list={list}>
                  {list.nickNm !== 'banner' &&
                    <div className='info'>
                      {/* <Badge content={list} /> */}
                      <span className="title">{list.title}</span>
                      <span className="nick">{list.nickNm}</span>
                    </div>
                  }
                </ListColumn>
              </div>
            )
          })}
        </Swiper>
      }
    </>
  )
}

export default MainSlide
