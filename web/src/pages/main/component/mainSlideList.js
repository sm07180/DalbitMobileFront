import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'

import {Context} from 'context'
import Swiper from 'react-id-swiper'

import Room, {RoomJoin} from 'context/room'
import {Hybrid, isHybrid} from 'context/hybrid'

export default (props) => {
  const context = useContext(Context)
  const history = useHistory()
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
            const {bannerUrl, profImg, isAdmin, isNew, isSpecial, nickNm, roomNo, roomType, title} = bannerData

            return (
              <div
                key={index}
                onClick={() => {
                  if (roomNo && roomNo !== undefined) {
                    if (nickNm === 'banner') {
                      if (roomType === 'link') {
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
                      RoomJoin({roomNo: roomNo})
                    }
                  }
                  if (roomType === 'link') {
                    context.action.updatenoticeIndexNum(roomNo)
                    if (roomNo !== '' && !roomNo.startsWith('http')) {
                      history.push(`${roomNo}`)
                    } else if (roomNo !== '' && roomNo.startsWith('http')) {
                      window.location.href = `${roomNo}`
                    }
                  } else {
                    if (isHybrid() && roomNo) {
                      RoomJoin({roomNo: roomNo})
                    }
                  }
                }}>
                <div
                  className={`topSlide__bg ${nickNm !== 'banner' && `broadcast`}`}
                  style={{
                    backgroundImage: `url("${bannerUrl}")`
                  }}>
                  <div className="topSlide__iconWrap">
                    {isAdmin ? <em className="adminIcon">운영자</em> : ''}
                    {!isAdmin && isSpecial ? <em className="specialIcon">스페셜DJ</em> : ''}
                    {nickNm === 'banner' ? <em className="eventIcon">EVENT</em> : ''}
                    {nickNm !== 'banner' && isNew === true ? <em className="newIcon">신입DJ</em> : ''}
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
