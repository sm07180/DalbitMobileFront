/**
 * @file button.js
 * @brief Header영역의 우측 버튼들
 * @todo 반응형으로 처리되어야함
 */

import React, {useContext} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {COLOR_MAIN} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//components
//
import {BroadValidation} from 'pages/common/header/navi'

export default () => {
  //context
  const context = useContext(Context)
  //---------------------------------------------------------------------
  return (
    <Content>
      {/* 모바일 헤더에서만 보이는 방송하기 nav링크 */}
      <MobileButton className="mobilecast">
        <button
          onClick={event => {
            event.preventDefault()
            BroadValidation()
          }}>
          <span>{context.cast_state ? '방송중' : '방송하기'}</span>
        </button>

        {/* <NavLink title="방송하기" to="/broadcast" exact>
          <span>방송하기</span>
        </NavLink> */}
      </MobileButton>
      {/* 헤더 우측에 gnb버튼 4가지 고정 */}
      <GnbButton>
        <button
          onClick={() => {
            context.action.updateGnbState('search')
          }}>
          검색
        </button>
        <button
          onClick={() => {
            context.action.updateGnbState('notice')
          }}>
          알람
        </button>
        <button
          onClick={() => {
            context.action.updateGnbState('mypage')
          }}>
          프로필
        </button>

        <button
          onClick={() => {
            context.action.updateGnbState('menu')
          }}>
          메뉴
        </button>
      </GnbButton>
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
  position: absolute;
  right: 10px;
  top: 18px;
  @media (max-width: ${WIDTH_TABLET_S}) {
    top: 7px;
    right: 8px;
  }
  @media (max-width: ${WIDTH_MOBILE_S}) {
    top: 12px;
  }
`

const GnbButton = styled.div`
  display: inline-block;
  button {
    width: 48px;
    height: 48px;
    margin: 0 10px;
    font-size: 16px;
    text-indent: -9999px;
  }

  button:last-child {
    margin-right: 0;
  }

  button:nth-child(1) {
    background: url(${IMG_SERVER}/svg/ic_search_normal.svg) no-repeat center;
  }
  button:nth-child(2) {
    background: url(${IMG_SERVER}/svg/ic_alarm.svg) no-repeat center;
  }
  button:nth-child(3) {
    background: url(${IMG_SERVER}/svg/ic_user_normal.svg) no-repeat center;
  }
  button:nth-child(4) {
    background: url(${IMG_SERVER}/svg/ic_menu_normal.svg) no-repeat center;
  }

  /* 테블렛사이즈 */
  @media (max-width: ${WIDTH_TABLET}) {
    button {
      margin: 0 3px;
    }
  }

  /* 테블렛 s 사이즈 */
  @media (max-width: ${WIDTH_TABLET_S}) {
    button {
      width: 43px;
      height: 43px;
    }
    button:nth-child(1) {
      background: url(${IMG_SERVER}/svg/ic_search_normal_w.svg) no-repeat center / cover;
    }
    button:nth-child(2) {
      background: url(${IMG_SERVER}/svg/ic_user_normal_w.svg) no-repeat center / cover;
    }
    button:nth-child(3) {
      background: url(${IMG_SERVER}/svg/ic_alarm_w.svg) no-repeat center / cover;
    }
    button:nth-child(4) {
      background: url(${IMG_SERVER}/svg/ic_menu_normal_w.svg) no-repeat center / cover;
    }
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    button {
      width: 40px;
      height: 40px;
      margin: 0;
    }
  }

  @media (max-width: ${WIDTH_MOBILE_S}) {
    button {
      width: 36px;
      height: 36px;
    }
  }
`

const MobileButton = styled.div`
  display: none;
  /* 테블렛 s 사이즈 */
  @media (max-width: ${WIDTH_TABLET_S}) {
    margin: 3px 7px 0 0;
    vertical-align: top;
    button {
      display: inline-block;
      padding: 0 14px;
      border-radius: 36px;
      background: #fff;
      color: ${COLOR_MAIN};
      font-weight: 600;
      line-height: 36px;
      transform: skew(-0.03deg);
    }
  }
  @media (max-width: ${WIDTH_MOBILE_S}) {
    margin: 0 3px 0 0;
    a {
      padding: 0 10px;
      line-height: 32px;
    }
  }
`
