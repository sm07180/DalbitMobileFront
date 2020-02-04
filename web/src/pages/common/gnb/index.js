/**
 * @file gnb/index.js
 * @brief 헤더에 포함되는 총 4가지 타입의 gnb영역 render 처리 부분
 */
import React, {useContext} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
//components
import GnbSearch from './search'
import GnbMypage from './mypage'
import GnbNotice from './notice'
import GnbMenu from './menu'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = new useContext(Context)

  //GNB메뉴 타입 4가지 만들기
  function makeGnbType() {
    switch (context.gnb_state) {
      case 'search': //검색
        return <GnbSearch />
        break
      case 'mypage': //마이페이지
        return <GnbMypage />
        break
      case 'notice': //알람
        return <GnbNotice />
        break
      case 'menu': //기본 메뉴
        return <GnbMenu />
        break
      default:
        break
    }
    return
  }
  //---------------------------------------------------------------------
  return <>{makeGnbType()}</>
}
//---------------------------------------------------------------------
//styled
