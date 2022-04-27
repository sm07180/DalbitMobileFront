import React, {useContext, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import Swiper from 'react-id-swiper'
// css
import './bannerSlide.scss'
import {useDispatch, useSelector} from "react-redux";
import {setHonorTab} from "redux/actions/honor";
import UtilityCommon from "common/utility/utilityCommon";

const BannerSlide = (props) => {
  const { type } = props;
  const history = useHistory()
  const [bannerList, setBannerList] = useState([])
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

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
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
      clickable: true
    },
    on: {
      click: (evt) => {
        const {targetUrl} = evt.target.dataset
        if (targetUrl.indexOf("/honor") > -1){
          dispatch(setHonorTab(UtilityCommon.eventDateCheck("20220501") ? "스타DJ" : "스페셜DJ"));
          openBannerUrl(targetUrl)
        } else if (targetUrl.indexOf("/starDj") > -1 && globalState.token.isLogin === false) {
            history.push("/login");
        } else {
          openBannerUrl(targetUrl)
        }
      }
    }
  }

  const openBannerUrl = (value) => {
    if(value.includes('notice')) {
      history.push({
        pathname: value,
        state: value.split('/')[2]
      })
    }else {
      history.push(value)
    }
  }

  useEffect(() => {
    fetchBannerInfo(type)
  },[])

  return (
    <div id="banner">
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
    </div>
  )
}

BannerSlide.defaultProps = {
  type: 9, // main slide 기본값으로 설정함.
};

export default BannerSlide;
