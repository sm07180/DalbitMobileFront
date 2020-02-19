/**
 * @title 채팅 ui 상단 정보들 나타내는 컴포넌트
 */
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'
import {Scrollbars} from 'react-custom-scrollbars'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //state

  //---------------------------------------------------------------------

  //---------------------------------------------------------------------
  return (
    <Content>
      <div className="dj-info">
        <figure>
          <img alt="DJ 프로필 사진" />
        </figure>
        <div>
          <p>DJ김빛나😍</p>
          <p>포근한 아침 라디오 함께해요!</p>
        </div>
        <ul>
          <li>
            <figure>
              <img alt="팬 랭킹 1위 프로필 사진" />
            </figure>
          </li>
          <li>
            <figure>
              <img alt="팬 랭킹 2위 프로필 사진" />
            </figure>
          </li>
          <li>
            <figure>
              <img alt="팬 랭킹 3위 프로필 사진" />
            </figure>
          </li>
          <li>13.5K</li>
        </ul>
      </div>
      <div className="cast-info">
        <ul>
          <li>85</li>
          <li>850</li>
          <li>00:30:00</li>
        </ul>
        <div>
          <button>메시지</button>
          <button>알람</button>
        </div>
      </div>
      <div className="option">
        <ul>
          <li>TOP 12</li>
          <li>추천</li>
          <li>인기</li>
          <li>신입</li>
        </ul>
        <button className="invite">게스트 초대</button>
      </div>
    </Content>
  )
}

//---------------------------------------------------------------------
//styled

const Content = styled.section``
