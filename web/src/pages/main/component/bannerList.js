import React, {useEffect, useState} from 'react'

// components
import Swiper from 'react-id-swiper'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import {Hybrid, isHybrid} from 'context/hybrid'
import {clipJoinApi} from 'pages/common/clipPlayer/clip_func'
import {RoomJoin} from "context/room";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";

export default React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()
  const [bannerView, setBannerView] = useState(false)

  const [list, setList] = useState(false)

  const goEvent = (linkUrl, linkType) => {
    const clipUrl = /\/clip\/[0-9]*$/
    const broadUrl = /\/broadcast\/[0-9]*$/

    if (linkType === 'popup') {
      if (clipUrl.test(linkUrl)) {
        if (isHybrid()) {
          const clip_no = linkUrl.substring(linkUrl.lastIndexOf('/') + 1)
          clipJoinApi(clip_no)
        } else {
          dispatch(setGlobalCtxUpdatePopup({popup: ['APPDOWN', 'appDownAlrt', 4]}));
        }
      } else if (broadUrl.test(linkUrl)) {
        if (isHybrid()) {
          const room_no = linkUrl.substring(linkUrl.lastIndexOf('/') + 1)
          RoomJoin({roomNo: room_no})
        }else{
          dispatch(setGlobalCtxUpdatePopup({popup: ['APPDOWN', 'appDownAlrt', 4]}));
        }
      } else {
        if (isHybrid()) {
          if (linkUrl.startsWith('/')) {
            linkUrl = 'https://' + location.host + linkUrl
          }
          linkUrl += '?webview=new'
          Hybrid('openUrl', linkUrl)
        } else {
          //window.open(linkUrl, '', 'height=' + screen.height + ',width=' + screen.width + 'fullscreen=yes')
          history.push(linkUrl)
        }
      }
    } else {
      if (linkUrl.startsWith('http://') || linkUrl.startsWith('https://')) {
        location.href = linkUrl
      } else {
        if (clipUrl.test(linkUrl)) {
          if (isHybrid()) {
            const clip_no = linkUrl.substring(linkUrl.lastIndexOf('/') + 1)
            clipJoinApi(clip_no)
          } else {
            dispatch(setGlobalCtxUpdatePopup({popup: ['APPDOWN', 'appDownAlrt', 4]}));
          }
        } else if (broadUrl.test(linkUrl)) {
          if (isHybrid()) {
            const room_no = linkUrl.substring(linkUrl.lastIndexOf('/') + 1)
            RoomJoin({roomNo: room_no})
          }else{
            dispatch(setGlobalCtxUpdatePopup({popup: ['APPDOWN', 'appDownAlrt', 4]}));
          }
        } else {
          history.push(linkUrl)
        }
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
    loop: list.length > 1 ? true : false,
    autoplay: {
      delay: 3000
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
      clickable: true
    },
    on: {
      click: (s, e) => {
        const {linkurl, linktype} = e.target.attributes
        goEvent(linkurl.value, linktype.value)
      }
    }
  }

  useEffect(() => {}, [])

  return (
    <>
      {list && list.length > 0 && (
        <div ref={ref} className="bannerWrap">
          <div className={`slideWrap ${bannerView === false ? '' : 'active'}`}>
            <>
              <div className="bannerNumber"></div>
              <button
                className={`moreButton moreButtonT ${bannerView === true ? 'active' : ''}`}
                onClick={() => buttonToogle()}></button>
              <Swiper {...params}>{createSliderList()}</Swiper>
            </>
          </div>
          <div className={`bannerView ${bannerView === true ? 'active' : ''}`}>{list && basicSliderList()}</div>
        </div>
      )}
    </>
  )
})
