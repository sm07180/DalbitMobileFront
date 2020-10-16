import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import {Context} from 'context'
import Swiper from 'react-id-swiper'

import Room, {RoomJoin} from 'context/room'
import {Hybrid, isHybrid} from 'context/hybrid'
import {OS_TYPE} from 'context/config.js'

export default (props) => {
  const context = useContext(Context)
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
            const {bannerUrl, profImg, isAdmin, isNew, isSpecial, nickNm, roomNo, roomType, title, liveBadgeList} = bannerData

            return (
              <div
                key={index}
                onClick={() => {
                  if (roomNo && roomNo !== undefined) {
                    if (nickNm === 'banner') {
                      if (roomType === 'link') {
                        context.action.updatenoticeIndexNum(roomNo)
                        if (roomNo.startsWith('http://') || roomNo.startsWith('https://')) {
                          window.location.href = `${roomNo}`
                        } else {
                          history.push(`${roomNo}`)
                        }
                      } else {
                        if (isHybrid()) {
                          Hybrid('openUrl', `${roomNo}`)
                        } else {
                          window.open(`${roomNo}`)
                        }
                      }
                    } else {
                      if (customHeader['os'] === OS_TYPE['Desktop']) {
                        if (context.token.isLogin === false) {
                          context.action.alert({
                            msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                            callback: () => {
                              history.push('/login')
                            }
                          })
                        } else {
                          context.action.updatePopup('APPDOWN', 'appDownAlrt', 1)
                        }
                      } else {
                        RoomJoin({roomNo: roomNo})
                      }
                    }
                  }
                }}>
                <div
                  className={`topSlide__bg ${nickNm !== 'banner' && `broadcast`}`}
                  style={{
                    backgroundImage: `url("${bannerUrl}")`
                  }}>
                  <div className="topSlide__iconWrap">
                    <div className="iconWrapper">
                      {isAdmin ? <em className="adminIcon">운영자</em> : ''}
                      {nickNm !== 'banner' && isNew === true ? <em className="newIcon">신입DJ</em> : ''}
                      {liveBadgeList &&
                        liveBadgeList.length !== 0 &&
                        liveBadgeList.map((item, idx) => {
                          return (
                            <React.Fragment key={idx + `badge`}>
                              {item.icon !== '' ? (
                                <div
                                  className="badgeIcon topImg"
                                  style={{
                                    background: `linear-gradient(to right, ${item.startColor}, ${item.endColor}`,
                                    marginRight: '4px'
                                  }}>
                                  <img src={item.icon} style={{height: '16px'}} />
                                  {item.text}
                                </div>
                              ) : (
                                <div
                                  style={{background: `linear-gradient(to right, ${item.startColor}, ${item.endColor}`}}
                                  className="badgeIcon text">
                                  {item.text}
                                </div>
                              )}
                            </React.Fragment>
                          )
                        })}
                      {!isAdmin && isSpecial ? <em className="specialIcon">스페셜DJ</em> : ''}
                      {nickNm === 'banner' ? <em className="eventIcon">EVENT</em> : ''}
                    </div>

                    {nickNm !== 'banner' ? <span className="liveIcon">live</span> : ''}
                  </div>

                  {nickNm !== 'banner' && (
                    <div className="topSlide__infoWrap">
                      <img className="thumb" src={profImg.thumb62x62} />
                      <div className="text">
                        <span className="title">{title}</span>
                        <span className="nickname">{nickNm}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
      </Swiper>
    </div>
  )
}
