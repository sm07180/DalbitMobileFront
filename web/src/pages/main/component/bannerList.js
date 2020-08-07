import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'

// components
import Swiper from 'react-id-swiper'
import {Context} from 'context'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import {OS_TYPE} from '../../../context/config'
import {Hybrid} from 'context/hybrid'

export default React.forwardRef((props, ref) => {
  const globalCtx = useContext(Context)
  const history = useHistory()
  const [bannerView, setBannerView] = useState(false)
  const customHeader = JSON.parse(Api.customHeader)

  const [list, setList] = useState(false)

  const goEvent = (linkUrl, linkType) => {
    if (linkType === 'popup') {
      if (customHeader['os'] === OS_TYPE['Android']) {
        try {
          //Hybrid('openUrl', {"url": linkUrl})
          window.android.openUrl(JSON.stringify({url: linkUrl}))
        } catch (e) {
          history.push(linkUrl)
        }
      } else if (customHeader['os'] === OS_TYPE['IOS'] && (customHeader['appBulid'] > 68 || customHeader['appBuild'] > 68)) {
        Hybrid('openUrl', linkUrl)
      } else {
        //window.open(linkUrl, '', 'height=' + screen.height + ',width=' + screen.width + 'fullscreen=yes')
        history.push(linkUrl)
      }
    } else {
      if(linkUrl.startsWith('http://') || linkUrl.startsWith('https://')){
        location.href = linkUrl
      }else{
        history.push(linkUrl)
      }
    }
  }

  const buttonToogle = () => {
    if (bannerView === false) {
      setBannerView(true)
    } else {
      setBannerView(false)
    }
  }

  const createSliderList = () => {
    if (!list) return null
    return list.map((banner, idx) => {
      const {bannerUrl, linkUrl, title, linkType} = banner

      return (
        <div className="banner" key={`banner-${idx}`}>
          <img src={bannerUrl} alt={title} linkurl={linkUrl} linktype={linkType} />
        </div>
      )
    })
  }

  const basicSliderList = () => {
    if (!list) return null
    return list.map((banner, idx) => {
      const {bannerUrl, linkUrl, title, linkType} = banner

      return (
        <div className="basicBanner" key={`banner-${idx}`}>
          {idx === 0 ? (
            <>
              <button className={`moreButton ${bannerView === true ? 'active' : ''}`} onClick={() => buttonToogle()}></button>
            </>
          ) : (
            ''
          )}

          <img
            src={bannerUrl}
            alt={title}
            onClick={() => {
              goEvent(linkUrl, linkType)
            }}
          />
        </div>
      )
    })
  }

  async function fetchBannerData() {
    const res = await Api.getBanner({
      params: {
        position: props.bannerPosition
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
      type: 'fraction',
      clickable: true
    },
    on: {
      click: (e) => {
        const {linkurl, linktype} = e.target.attributes
        goEvent(linkurl.value, linktype.value)
      }
    }
  }

  useEffect(() => {}, [])

  return (
    <Banner ref={ref}>
      <div className={`slideWrap ${bannerView === false ? '' : 'active'}`}>
        <div className="bannerNumber"></div>
        <button className={`moreButton ${bannerView === true ? 'active' : ''}`} onClick={() => buttonToogle()}></button>
        {list && <Swiper {...params}>{createSliderList()}</Swiper>}
      </div>
      <div className={`bannerView ${bannerView === true ? 'active' : ''}`}>{list && basicSliderList()}</div>
    </Banner>
  )
})

const Banner = styled.div`
  div.swiper-pagination-fraction {
    display: flex !important;
    bottom: 0px;
    left: 0px;
    background-color: rgba(0, 0, 0, 0.5);
    width: 45px;
    justify-content: center;
    letter-spacing: 3px;
    color: white;
    font-size: 12px;
    height: 18px;
    align-items: center;

    .swiper-pagination-total {
      opacity: 0.5;
    }
  }

  .bannerNumber {
    border: solid 1px;
    position: absolute;
    left: 0px;
    bottom: 0px;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    width: 45px;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    p {
      opacity: 0.5;
    }
  }

  .slideWrap {
    position: relative;

    &.active {
      display: none;
    }
  }
  .bannerView {
    display: none;
    img {
      width: 100%;
    }
    &.active {
      display: block;
    }
  }

  .moreButton {
    width: 24px;
    height: 24px;
    position: absolute;
    right: 0px;
    bottom: 0px;
    z-index: 2;
    background: url('https://image.dalbitlive.com//svg/20200804/arrow_down_g_up.svg') center no-repeat #fff;

    &.active {
      background: url('https://image.dalbitlive.com//svg/20200804/arrow_down_g.svg') center no-repeat #fff;
    }
  }

  .basicBanner {
    margin-bottom: 10px;
    position: relative;
  }

  .swiper-container {
    height: auto;
    .banner {
      img {
        width: 100%;
      }
    }
    .swiper-pagination-bullet-active {
      background: #ec455f;
    }
    .swiper-pagination {
      display: none;
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
