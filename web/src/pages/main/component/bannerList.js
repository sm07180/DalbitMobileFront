import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'

// components
import Swiper from 'react-id-swiper'
import {Context} from 'context'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'

export default props => {
  const globalCtx = useContext(Context)
  const history = useHistory()

  const [list, setList] = useState(false)

  const goEvent = linkUrl => {
    //alert(linkUrl)
    globalCtx.action.updatenoticeIndexNum(linkUrl)
    history.push(linkUrl)
  }

  const createSliderList = () => {
    if (!list) return null
    return list.map((banner, idx) => {
      const {bannerUrl, linkUrl, title} = banner

      return (
        <div
          className="banner"
          key={`banner-${idx}`}
          onClick={() => {
            goEvent(linkUrl)
          }}>
          <img src={bannerUrl} alt={title} />
        </div>
      )
    })
  }

  async function fetchBannerData() {
    const res = await Api.getBanner({
      params: {
        position: '9'
      }
    })
    if (res.result === 'success') {
      if (res.hasOwnProperty('data')) setList(res.data)
    } else {
      console.log(res.result, res.message)
    }
  }

  useEffect(() => {
    fetchBannerData()
  }, [])

  const params = {
    slidesPerColumnFill: 'row',
    resistanceRatio: 0,
    loop: true,
    autoplay: {
      delay: 5000
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    }
  }

  return <Banner>{list && <Swiper {...params}>{createSliderList()}</Swiper>}</Banner>
}

const Banner = styled.div`
  padding: 0 16px;
  margin: 20px 0;
  .swiper-container {
    border-radius: 10px;
    .banner {
      /* overflow: hidden; */

      img {
        width: 100%;
        border-radius: 10px;
      }
    }
    .swiper-pagination-bullet-active {
      background: #ec455f;
    }
  }
  .swiper-pagination-fraction,
  .swiper-pagination-custom,
  .swiper-container-horizontal > .swiper-pagination-bullets {
    width: auto;
    bottom: 3px;
    left: inherit;
    right: 5px;
  }
`
