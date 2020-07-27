import React, {useEffect} from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'

// component
import Swiper from 'react-id-swiper'

import {saveUrlAndRedirect} from 'components/lib/link_control.js'
import {RoomJoin} from 'context/room'

export default props => {
  const {list} = props

  if (list === undefined) {
    return null
  }

  const swiperParams = {
    slidesPerView: 'auto'
  }

  return (
    <StarList>
      <Swiper {...swiperParams}>

        {list.map((star, idx) => {
          const {memNo, title, roomNo, nickNm} = star
          return (
            <div className="list" key={`star-list${idx}`} onClick={() => {
                if(roomNo === ''){
                  window.location.href = '/mypage/' + memNo
                }else{
                  RoomJoin(roomNo + '')
                }
              }}>
              <div
                className="image"
                style={star['profImg'] ? {backgroundImage: `url(${star['profImg']['thumb150x150']})`} : {}}
              />
              <div className="text">{roomNo === '' ? nickNm : title}</div>
            </div>
          )
        })}
      </Swiper>
    </StarList>
  )
}

const StarList = styled.div`
  position: absolute;
  top: 0;
  left: 96px;
  width: calc(100% - 96px);

  .swiper-container {
    padding-right: 16px;
  }

  .list {
    width: 72px;
    margin: 0 4px;

    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }

    .image {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      background-size: cover;
      width: 72px;
      height: 72px;
      border: 1px solid #e0e0e0;
      border-radius: 26px;
      color: #424242;
      font-size: 16px;
      font-weight: 800;
      letter-spacing: -0.32px;
    }

    .text {
      margin: 0 auto;
      margin-top: 6px;
      width: 56px;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #424242;
      font-size: 11px;
      letter-spacing: -0.28px;
      white-space: nowrap;
    }
  }
`
