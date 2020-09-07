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
    spaceBetween: 8
  }

  return (
    <>
      {ctx.token.isLogin === true ? (
        <div className="title" onClick={() => (window.location.href = `/mypage/${ctx.profile.memNo}/edit_star`)}>
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
                // if (roomNo !== undefined && roomNo !== '') {
                //   if (ctx.adminChecker === true) {
                //     ctx.action.confirm_admin({
                //       //콜백처리
                //       callback: () => {
                //         RoomJoin({
                //           roomNo: roomNo + '',
                //           shadow: 1
                //         })
                //       },
                //       //캔슬콜백처리
                //       cancelCallback: () => {
                //         RoomJoin({
                //           roomNo: roomNo + '',
                //           shadow: 0
                //         })
                //       },
                //       msg: '관리자로 입장하시겠습니까?'
                //     })
                //   } else {
                //     RoomJoin({
                //       roomNo: roomNo + ''
                //     })
                //   }
                // } else {
                //   saveUrlAndRedirect(`/mypage/${memNo}`)
                // }
                // 20.08.25
                saveUrlAndRedirect(`/mypage/${memNo}`)
              }}>
              <div className="image" style={star['profImg'] ? {backgroundImage: `url(${star['profImg']['thumb150x150']})`} : {}}>
                {roomNo !== undefined && roomNo !== '' && (
                  <span className="liveIcon">
                    <img src={LiveIcon} alt="라이브중" />
                  </span>
                )}
              </div>
              <div className="text">{star['nickNm']}</div>
            </div>
          )
        })}
      </Swiper>
    </>
  )
}

const StarList = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`
