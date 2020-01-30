/**
 * @file profile.js
 * @brief Header영역의 우측 프로필사진
 * @todo 반응형으로 처리되어야함
 */

import React, {useContext, useEffect} from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE, IMG_SERVER} from 'Context/config'
//context
import {Context} from 'Context'
//hooks
import useClick from 'Components/hooks/useClick'
//components
import Gnb from 'Pages/common/gnb'
//
export default props => {
  //context
  const context = useContext(Context)
  //hooks
  const open = useClick(update, {gnb: true})
  //const
  const url = `${IMG_SERVER}/svg/profile.svg`
  //---------------------------------------------------------------------
  function update(mode) {
    console.log(mode)
    switch (true) {
      case mode.gnb !== undefined: //------------------------GNB열기
        const val = mode.gng
        context.action.updateGnbVisible(true)
        break
      default:
        alert('할당된이벤트없음')
        break
    }
  }
  return (
    <React.Fragment>
      <Profile className={props.type}>
        <button {...open}>
          <img src={url} />
        </button>
      </Profile>
      <Gnb />
    </React.Fragment>
  )
}
//---------------------------------------------------------------------
const Profile = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  box-sizing: border-box;
  /* 모바일사이즈 */
  @media screen and (max-width: ${WIDTH_MOBILE}) {
    top: 0;
    right: 12px;
    /* 스크롤 */
    &.scroll {
      background: #fff;
    }
  }

  /* 버튼영역 */
  button {
    display: inline-block;
    padding: 13px;
    box-sizing: border-box;
    img {
      width: 100%;
      height: auto;
      vertical-align: top;
    }
  }
`
