import React, {useEffect, useContext} from 'react'
import styled from 'styled-components'

// component
import Swiper from 'react-id-swiper'
import {RoomJoin} from 'context/room'
import {saveUrlAndRedirect} from 'components/lib/link_control.js'

import RankArrow from '../static/arrow_right_w.svg'
import LiveIcon from '../static/ic_live.svg'
import {Context} from 'context'
export default (props) => {
  const {list} = props
  const ctx = useContext(Context)

  if (list === undefined) {
    return null
  }

  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 12
  }

  return (
    <StarList>
      {ctx.token.isLogin === true ? (
        <div className="title" onClick={() => (window.location.href = `/mypage/${ctx.profile.memNo}/edite_star`)}>
          <div className="txt">
            나의
            <br />
            스타
          </div>
          <img className="icon" src={RankArrow} />
        </div>
      ) : (
        <div className="title">
          <div className="txt">
            나의
            <br />
            스타
          </div>
          <img className="icon" src={RankArrow} />
        </div>
      )}

      <Swiper {...swiperParams}>
        {list.map((star, idx) => {
          const {memNo, roomNo} = star
          return (
            <div
              className="list"
              key={`star-list${idx}`}
              onClick={() => {
                if (roomNo !== undefined && roomNo !== '') {
                  if (ctx.adminChecker === true) {
                    ctx.action.confirm_admin({
                      //콜백처리
                      callback: () => {
                        RoomJoin({
                          roomNo: roomNo + '',
                          shadow: 1
                        })
                      },
                      //캔슬콜백처리
                      cancelCallback: () => {
                        RoomJoin({
                          roomNo: roomNo + '',
                          shadow: 0
                        })
                      },
                      msg: '관리자로 입장하시겠습니까?'
                    })
                  } else {
                    RoomJoin({
                      roomNo: roomNo + ''
                    })
                  }
                } else {
                  saveUrlAndRedirect(`/mypage/${memNo}`)
                }
              }}>
              <div className="image" style={star['profImg'] ? {backgroundImage: `url(${star['profImg']['thumb150x150']})`} : {}}>
                {roomNo !== undefined && roomNo !== '' && (
                  <span className="live">
                    <img src={LiveIcon} alt="라이브중" />
                  </span>
                )}
              </div>
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
    cursor: pointer;

    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }

    .image {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      background-size: cover;
      width: 52px;
      height: 52px;
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
    .live {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 20px;
      height: 20px;
      img {
        width: 100%;
      }
    }
  }
`
