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
          window.location.href = linkUrl
        }
      } else if (customHeader['os'] === OS_TYPE['IOS'] && (customHeader['appBulid'] > 68 || customHeader['appBuild'] > 68)) {
        Hybrid('openUrl', linkUrl)
      } else {
        //window.open(linkUrl, '', 'height=' + screen.height + ',width=' + screen.width + 'fullscreen=yes')
        window.location.href = linkUrl
      }
    } else {
      window.location.href = linkUrl
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
              <button className="moreButton" onClick={() => buttonToogle()}></button>
            </>
          ) : (
            ''
          )}

          <img
            src={bannerUrl}
            alt={title}
            onClick={() => {
              if (linkType === 'popup') {
                window.open(`${linkUrl}`)
              } else {
                history.push(`${linkUrl}`)
              }
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
      clickable: true
    },
    on: {
      click: (e) => {
        const {linkurl, linktype} = e.target.attributes
        goEvent(linkurl.value, linktype.value)
      }
    }
  }

  console.log(`111`, bannerView)

  return (
    <Banner ref={ref}>
      <div className={`slideWrap ${bannerView === false ? '' : 'active'}`}>
        <button className={`moreButton ${bannerView === true ? 'active' : ''}`} onClick={() => buttonToogle()}></button>
        {list && <Swiper {...params}>{createSliderList()}</Swiper>}
      </div>
      <div className={`bannerView ${bannerView === true ? 'active' : ''}`}>{list && basicSliderList()}</div>
    </Banner>
  )
})

const Banner = styled.div`
  margin-bottom: 19px;

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
    background: url('https://image.dalbitlive.com//svg/20200804/arrow_down_g.svg') center no-repeat #fff;

    &.active {
      background: url('https://image.dalbitlive.com//svg/20200804/arrow_down_g_up.svg') center no-repeat #fff;
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
