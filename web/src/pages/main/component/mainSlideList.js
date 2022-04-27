import React from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import Swiper from 'react-id-swiper'

import {RoomJoin} from 'context/room'
import {Hybrid, isHybrid} from 'context/hybrid'
import {OS_TYPE} from 'context/config.js'
import {clipJoinApi} from 'pages/common/clipPlayer/clip_func'

import BadgeList from 'common/badge_list'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxNoticeIndexNum, setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()
  const customHeader = JSON.parse(Api.customHeader)
  const {list} = props

  const swiperParams = {
    loop: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction'
    }
  }

  return (
    <div className="topSlide">
      <Swiper {...swiperParams}>
        {list instanceof Array &&
          list.map((bannerData, index) => {
            const {bannerUrl, profImg, isAdmin, isConDj, isNew, badgeSpecial, nickNm, roomNo, roomType, title, liveBadgeList} =
              bannerData
            let bgImgUrl = bannerUrl
            // if (nickNm !== 'banner' && !bgImgUrl.toLowerCase().endsWith(".gif")) {
            //   bgImgUrl += "?700x700"
            // }
            return (
              <div
                key={index}
                onClick={() => {
                  if (roomNo && roomNo !== undefined) {
                    if (nickNm === 'banner') {
                      const clipUrl = /\/clip\/[0-9]*$/
                      const broadUrl = /\/broadcast\/[0-9]*$/
                      if (roomType === 'link') {
                        dispatch(setGlobalCtxNoticeIndexNum(roomNo));
                        if (roomNo.startsWith('http://') || roomNo.startsWith('https://')) {
                          window.location.href = `${roomNo}`
                        } else if (clipUrl.test(roomNo)) {
                          if (isHybrid()) {
                            const clip_no = roomNo.substring(roomNo.lastIndexOf('/') + 1)
                            clipJoinApi(clip_no)
                          } else {
                            dispatch(setGlobalCtxUpdatePopup({popup: ['APPDOWN', 'appDownAlrt', 4]}));
                          }
                        } else if (broadUrl.test(roomNo)) {
                          if (isHybrid()) {
                            const room_no = roomNo.substring(roomNo.lastIndexOf('/') + 1)
                            RoomJoin({roomNo: room_no})
                          } else {
                            dispatch(setGlobalCtxUpdatePopup({popup: ['APPDOWN', 'appDownAlrt', 4]}));
                          }
                        } else {
                          history.push(`${roomNo}`)
                        }
                      } else {
                        if (clipUrl.test(roomNo)) {
                          if (isHybrid()) {
                            const clip_no = roomNo.substring(roomNo.lastIndexOf('/') + 1)
                            clipJoinApi(clip_no)
                          } else {
                            Hybrid('openUrl', `${roomNo}`)
                          }
                        } else if (broadUrl.test(roomNo)) {
                          if (isHybrid()) {
                            const room_no = roomNo.substring(roomNo.lastIndexOf('/') + 1)
                            RoomJoin({roomNo: room_no})
                          } else {
                            dispatch(setGlobalCtxUpdatePopup({popup: ['APPDOWN', 'appDownAlrt', 4]}));
                          }
                        } else {
                          if (clipUrl.test(roomNo)) {
                            dispatch(setGlobalCtxUpdatePopup({popup: ['APPDOWN', 'appDownAlrt', 4]}));
                          } else {
                            window.open(`${roomNo}`)
                          }
                        }
                      }
                    } else {
                      if (customHeader['os'] === OS_TYPE['Desktop']) {
                        if (globalState.token.isLogin === false) {
                          dispatch(setGlobalCtxMessage({
                            type: "alert",
                            msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                            callback: () => {
                              history.push('/login')
                            }
                          }))
                        } else {
                          dispatch(setGlobalCtxUpdatePopup({popup: ['APPDOWN', 'appDownAlrt', 2]}));
                        }
                      } else {
                        RoomJoin({roomNo: roomNo, nickNm: nickNm})
                      }
                    }
                  }
                }}>
                <div
                  className={`topSlide__bg ${nickNm !== 'banner' && `broadcast`}`}
                  style={{
                    backgroundImage: `url("${bgImgUrl}")`
                  }}>
                  <div className="topSlide__iconWrap">
                    <div className="iconWrapper">
                      {isAdmin ? <em className="adminIcon">운영자</em> : ''}
                      {nickNm !== 'banner' && isNew === true && <em className="icon_wrap icon_newdj">신입DJ</em>}
                      {badgeSpecial > 0 && badgeSpecial === 2 && <em className="icon_wrap icon_bestdj">베스트DJ</em>}
                      {isConDj && <em className="icon_wrap icon_contentsdj">콘텐츠DJ</em>}
                      {badgeSpecial > 0 && badgeSpecial === 1 && <em className="icon_wrap icon_specialdj">스페셜DJ</em>}
                      {liveBadgeList && liveBadgeList.length !== 0 && <BadgeList list={liveBadgeList} />}
                      {nickNm === 'banner' && <em className="icon_wrap icon_event">EVENT</em>}
                    </div>
                  </div>

                  {nickNm !== 'banner' && (
                    <>
                      <span className="icon_wrap icon_live_text">live</span>
                      <div className="topSlide__infoWrap">
                        <img className="thumb" src={profImg.thumb62x62} />
                        <div className="text">
                          <span className="title">{title}</span>
                          <span className="nickname">{nickNm}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })}
      </Swiper>
    </div>
  )
}
