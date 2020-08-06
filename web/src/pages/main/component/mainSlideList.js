import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'

import {Context} from 'context'
import Swiper from 'react-id-swiper'
import styled from 'styled-components'
import LiveIcon from '../static/live_l@3x.png'

import Room, {RoomJoin} from 'context/room'
import {Hybrid, isHybrid} from 'context/hybrid'

export default (props) => {
  const context = useContext(Context)
  const history = useHistory()
  const {list} = props

  const swiperParams = {
    loop: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction'
    }
  }

  return (
    <TopSlider>
      <Swiper {...swiperParams} className="topSlide">
        {list instanceof Array &&
          list.map((bannerData, index) => {
            const {bannerUrl, profImg, isAdmin, isSpecial, nickNm, roomNo, roomType, title} = bannerData

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
                      RoomJoin(roomNo)
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
                      RoomJoin(roomNo)
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
                    {nickNm !== 'banner' ? <span className="liveIcon">live</span> : ''}
                  </div>

                  {nickNm !== 'banner' && (
                    <div className="topSlide__infoWrap">
                      <img className="thumb" src={profImg.url} />
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
    </TopSlider>
  )
}

const TopSlider = styled.div`
  .topSlide {
    width: 100%;
    height: 220px;
    background: #eee;
    overflow: hidden;
    position: relative;
    margin-top: 40px;

    &__buttonWrap {
      position: absolute;
      top: 24px;
      padding: 0px 20px;
      box-sizing: border-box;
      width: 100%;
      height: 60px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 1;
    }
    &__bg {
      background-size: cover;
      background-position: center;
      cursor: pointer;
      width: 100%;
      height: 220px;
      &.broadcast {
        &::after {
          display: block;
          content: '';
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.3);
        }
      }
    }
    &__itemWrap {
      position: absolute;
      top: 24px;
      width: 100%;
      padding: 0px 20px;
      display: flex;
      z-index: 1;
      box-sizing: border-box;
    }

    &__number {
      display: flex;
      line-height: 25px;
      justify-content: center;
      margin-left: auto;
      width: 58px;
      height: 25px;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      font-size: 14px;
      border-radius: 14px;
    }

    &__iconWrap {
      em {
        position: absolute;
        left: 16px;
        top: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 52px;
        height: 18px;
        margin-right: 4px;
        color: #fff;
        font-style: normal;
        font-size: 11px;
        line-height: 18px;
        border-radius: 20px;
      }
      .eventIcon {
        background: #febd56;
      }

      .specialIcon {
        background: #ec455f;
      }

      .adminIcon {
        background: #3386f2;
      }

      span {
        position: absolute;
        right: 8px;
        top: 8px;
        &.liveIcon {
          width: 42px;
          height: 42px;
          margin: 0;
          font-size: 0;
          background: url(${LiveIcon}) no-repeat 0 0;
          background-size: contain;
        }
      }
    }
    &__infoWrap {
      position: absolute;
      bottom: 10px;
      left: 0;
      display: flex;
      flex-direction: row;
      align-content: center;
      width: 100%;
      padding: 0 16px;

      .thumb {
        display: block;
        width: 48px;
        height: 48px;
        margin-right: 8px;
        border-radius: 50%;
        border: solid 1px rgba(255, 255, 255, 0.5);
      }
      .text {
        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
        font-weight: bold;
        line-height: 1.4;
        .title {
          display: block;
          color: #fff;
        }
        .nickname {
          display: block;
          color: rgb(255, 179, 0);
        }
      }
    }
  }
  .swiper-pagination-fraction {
    bottom: 5px;
    padding-right: 14px;
    text-align: right;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.6);
    span {
      color: rgba(255, 255, 255, 0.6);
    }
    .swiper-pagination-current {
      color: #fff;
    }
  }
`
