import React, {useEffect} from 'react'
import styled from 'styled-components'

// component
import Swiper from 'react-id-swiper'
import RankArrow from '../static/arrow_right_w.svg'
import {RoomJoin} from 'context/room'
import {saveUrlAndRedirect} from 'components/lib/link_control.js'

export default (props) => {
  const {list} = props

  if (list === undefined) {
    return null
  }

  const swiperParams = {
    slidesPerView: 'auto'
  }

  return (
    <StarList>
      <div className="title">
        <div className="txt">
          나의
          <br />
          스타
        </div>
        <img className="icon" src={RankArrow} />
      </div>
      <Swiper {...swiperParams}>
        {list.map((star, idx) => {
          const {memNo, roomNo} = star
          return (
            <div
              className="list"
              key={`star-list${idx}`}
              onClick={() => {
                if (roomNo !== undefined && roomNo !== '') {
                  RoomJoin(roomNo + '')
                } else {
                  saveUrlAndRedirect(`/mypage/${memNo}`)
                }
              }}>
              <div
                className="image"
                style={star['profImg'] ? {backgroundImage: `url(${star['profImg']['thumb150x150']})`} : {}}
              />
              <div className="text">{star['nickNm']}</div>
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
  left: 16px;
  width: calc(100% - 16px);
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;

  .title {
    color: #fff;
    display: flex;
    align-items: center;
    flex-direction: row;
    margin-right: 18px;
    margin-bottom: 18px;

    .txt {
      width: 34px;
      font-size: 16px;
      color: #000;
      font-weight: bold;
    }
    .icon {
      width: 20px;
      margin-left: 4px;
    }
  }

  .swiper-container {
    width: 100%;
    margin: 0;
    padding-right: 16px;
  }

  .list {
    width: 48px;
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
      width: 48px;
      height: 48px;
      border-radius: 12px;
      color: #424242;
      font-size: 16px;
      font-weight: 800;
      letter-spacing: -0.32px;
      background-color: #bbb;
    }

    .text {
      margin: 0 auto;
      margin-top: 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #616161;
      font-size: 12px;
      /* letter-spacing: -0.28px; */
      white-space: nowrap;
      text-align: center;
    }
  }
`
