import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'

import Swiper from 'react-id-swiper'

const BannerSlide = (props) => {
  const {data} = props
  const history = useHistory()
  
  const [bannerShow, setBannerShow] = useState(true)

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
  // bannerOpen
  const bannerOpen = () => {
    if (bannerShow === false) {
      setBannerShow(true)
    } else {
      setBannerShow(false)
    }
  }

  const openBannerUrl = (value) => {
    history.push(value)
  }

  return (
    <>
      {bannerShow === false ?
        <>
          {data && data.length > 0 &&
            <Swiper {...swiperBanner}>
              {data.map((list,index) => {
                return (
                  <div className='bannerList' key={index}>
                    <img src={list.bannerUrl} data-target-url={list.linkUrl} alt={list.title} />
                  </div>
                )
              })}
            </Swiper>
          }
          <button className="bannerMore" onClick={bannerOpen}></button>
        </>
        :
        <>
          {data.map((list,index) => {
            return (
              <div className='bannerList' key={index}>
                <img src={list.bannerUrl} data-target-url={list.linkUrl} alt={list.title} />
                {index === 0 && 
                  <button className={`bannerMore ${bannerShow === true ? 'isShow': ''}`} onClick={bannerOpen}></button>
                }
              </div>
            )
          })}
        </>
      }
    </>
  )
}

export default BannerSlide
