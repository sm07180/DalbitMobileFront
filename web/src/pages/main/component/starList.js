import React, {useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import styled from 'styled-components'

// component
import Swiper from 'react-id-swiper'
import {RoomJoin} from 'context/room'
import {saveUrlAndRedirect} from 'components/lib/link_control.js'

import RankArrow from '../static/arrow_right_w.svg'
const LiveIcon = 'https://image.dalbitlive.com/svg/ic_live.svg'
export default (props) => {
  const history = useHistory()
  const {list} = props

  if (list === undefined) {
    return null
  }

  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 8
  }

  return (
    <React.Fragment>
      <Swiper {...swiperParams}>
        {list.map((star, idx) => {
          const {memNo, roomNo} = star
          return (
            <div
              className="list"
              key={`star-list${idx}`}
              onClick={() => {
                history.push(`/profile/${memNo}`)
              }}>
              <div className="image" style={star['profImg'] ? {backgroundImage: `url(${star['profImg']['thumb62x62']})`} : {}}>
                {roomNo !== undefined && roomNo !== '' && <em className="icon_wrap icon_live icon_live_star">라이브중</em>}
              </div>
              <div className="text">{star['nickNm']}</div>
            </div>
          )
        })}
      </Swiper>
    </React.Fragment>
  )
}

const StarList = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`
