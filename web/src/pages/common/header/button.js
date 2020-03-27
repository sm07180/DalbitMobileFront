/**
 * @file button.js
 * @brief Header영역의 우측 버튼들
 * @todo 반응형으로 처리되어야함
 */

import React, {useMemo, useContext, useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import styled from 'styled-components'
import _ from 'lodash'
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
  //useState
  let isOpen = false
  //history
  let history = useHistory()
  //useMemo
  const isLogin = useMemo(() => {
    return _.hasIn(context, 'token.isLogin') ? context.token.isLogin : false
  })
  function hashchange(event) {
    console.log(context.gnb_state)
    alert('1')
  }
  //---------------------------------------------------------------------

  useEffect(() => {
    //BackButton
    window.onpopstate = function(event) {
      context.action.updateGnbVisible(false)
      //console.log('location: ' + document.location + ', state: ' + JSON.stringify(event.state))
    }
  }, [])
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
      </MobileButton>
      {/* 헤더 우측에 gnb버튼 4가지 고정 */}
      <GnbButton>
        <button
          className="type1"
          onClick={() => {
            if (location.href.indexOf('/search') === -1) {
              context.action.updateGnbState('search')
              history.push(`${history.location.pathname}#gnbOpen`)
            }
          }}>
          검색
        </button>
        {isLogin && (
          <button
            className="type2"
            onClick={() => {
              context.action.updateGnbState('notice')
              history.push(`${history.location.pathname}#gnbOpen`)
            }}>
            알람
          </button>
        )}
        <button
          className="type3"
          onClick={() => {
            context.action.updateGnbState('mypage')
            history.push(`${history.location.pathname}#gnbOpen`)
          }}>
          프로필
        </button>
        <button
          className="type4"
          onClick={() => {
            context.action.updateGnbState('menu')
            history.push(`${history.location.pathname}#gnbOpen`)
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

  button.type1 {
    background: url(${IMG_SERVER}/svg/ic_search_normal.svg) no-repeat center;
  }
  button.type2 {
    background: url(${IMG_SERVER}/svg/ic_alarm.svg) no-repeat center;
  }
  button.type3 {
    background: url(${IMG_SERVER}/svg/ic_user_normal.svg) no-repeat center;
  }
  button.type4 {
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
    button.type1 {
      background: url(${IMG_SERVER}/svg/ic_search_normal_w.svg) no-repeat center / cover;
    }
    button.type2 {
      background: url(${IMG_SERVER}/svg/ic_alarm_w.svg) no-repeat center / cover;
    }
    button.type3 {
      background: url(${IMG_SERVER}/svg/ic_user_normal_w.svg) no-repeat center / cover;
    }
    button.type4 {
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
