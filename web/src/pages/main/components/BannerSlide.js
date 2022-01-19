import React from 'react'
import {useHistory} from 'react-router-dom'

import Swiper from 'react-id-swiper'

const BannerSlide = (props) => {
  const {data} = props
  const history = useHistory()

  const swiperBanner = {
    slidesPerView: 'auto',
    loop: true,
    autoplay: {
      delay: 10000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
      clickable: true
    },
    on: {
      click: (e) => {
        const {targetUrl} = e.target.dataset
        openBannerUrl(targetUrl)
      }
    }
  }

  const openBannerUrl = (value) => {
    history.push(value)
  }

  return (
    <>
      {data && data.length > 0 &&
        <Swiper {...swiperBanner}>
          {data.map((list,index) => {
            return (
              <div key={index}>
                <img src={list.bannerUrl} data-target-url={list.linkUrl} alt={list.title} />
              </div>
            )
          })}
        </Swiper>
      }
    </>
  )
}

export default BannerSlide
