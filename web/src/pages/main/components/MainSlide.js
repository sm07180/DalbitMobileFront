import React from 'react'
import Swiper from 'react-id-swiper'

// global components
import ListColumn from 'components/ui/listColumn/ListColumn'
import BadgeItems from 'components/ui/badgeItems/BadgeItems'

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
                {list.bannerUrl && list.nickNm === "banner" ?
                  <ListColumn photo={list.bannerUrl} />
                  :
                  <ListColumn photo={list.profImg.thumb500x500}>
                    <div className='info'>
                      <BadgeItems content={list.liveBadgeList} />
                      <span className="title">{list.title}</span>
                      <span className="nick">{list.nickNm}</span>
                    </div>
                  </ListColumn>
                }
              </div>
            )
          })}
        </Swiper>
      }
    </>
  )
}

export default MainSlide
