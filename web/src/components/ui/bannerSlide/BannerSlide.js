import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import Swiper from 'react-id-swiper'
// css
import './bannerSlide.scss'
import {useDispatch} from "react-redux";
import {setHonorTab} from "redux/actions/honor";

const BannerSlide = (props) => {
  const history = useHistory()
  const [bannerList, setBannerList] = useState([])
  const [bannerShow, setBannerShow] = useState(false)
  const dispatch = useDispatch();

  const fetchBannerInfo = (arg) => {
    Api.getBanner({
      params: {
        position: arg
      }
    }).then((res) => {
      if (res.result === 'success') {
        setBannerList(res.data);
      }
    })
  }

  const swiperBanner = {
    slidesPerView: 'auto',
    loop: true,
    slideClass: 'bannerSlide',
    slideActiveClass: 'bannerSlide-active',
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
      clickable: true
    },
    on: {
      click: (s,e) => {
        let evt = e ? e : s; // 스와이프 버전에 따라 달라서 임시 처리
        const {targetUrl} = evt.target.dataset
        if (targetUrl.indexOf("/honor") > -1){
          dispatch(setHonorTab("스페셜DJ"));
        }
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

  useEffect(() => {
    fetchBannerInfo(9)
  },[])

  return (
    <div id="banner">
      {bannerShow === false ?
        <>
          {bannerList && bannerList.length > 0 &&
            <Swiper {...swiperBanner}>
              {bannerList.map((list,index) => {
                return (
                  <div key={index}>
                    <img src={list.bannerUrl} data-target-url={list.linkUrl} alt={list.title} />
                  </div>
                )
              })}
            </Swiper>
          }
          {/* <button className="bannerMore" onClick={bannerOpen}></button> */}
        </>
        :
        <>
          {bannerList.map((list,index) => {
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
    </div>
  )
}

export default BannerSlide