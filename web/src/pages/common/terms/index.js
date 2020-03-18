/**
 * @file terms/index.js
 * @brief 공통 약관 페이지
 * @use context.action.updatePopup('TERMS', '약관종류')
 */
import React, {useEffect, useContext, useState, useRef} from 'react'
import styled from 'styled-components'
import {Scrollbars} from 'react-custom-scrollbars'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//component
import Service from './content/service'
import Privacy from './content/privacy'
import YouthProtect from './content/youth-protect'
import Operating from './content/operating'
import Maketing from './content/maketing'

////---------------------------------------------------------------------
export default props => {
  //context
  const context = useContext(Context)
  //ref
  const termsArea = useRef(null)
  //   레이어팝업컨텐츠
  const makeTermsContents = () => {
    switch (context.popup_code[1]) {
      case 'service': //---------------------------------------서비스 이용약관
        return <Service {...props} />
      case 'privacy': //---------------------------------------개인정보 취급방침
        return <Privacy {...props} />
      case 'youthProtect': //---------------------------------------청소년 보호정책
        return <YouthProtect {...props} />
      case 'operating': //---------------------------------------운영정책
        return <Operating {...props} />
      case 'maketing': //---------------------------------------마케팅 수신 동의약관
        return <Maketing {...props} />
      default:
        return <div>약관 컨텐츠가 정의되지않음</div>
    }
  }

  const scrollOnUpdate = () => {
    if (document.getElementsByClassName('round')[0]) {
      termsArea.current.children[0].children[0].style.maxHeight = `calc(${document.getElementsByClassName('round')[0].offsetHeight}px - 41px)`
    }
  }

  //useEffect
  useEffect(() => {}, [])

  //---------------------------------------------------------------------
  return (
    <Terms ref={termsArea}>
      <Scrollbars autoHeight autoHeightMax={'100%'} onUpdate={scrollOnUpdate} autoHide>
        {makeTermsContents()}
      </Scrollbars>
    </Terms>
  )
}

//---------------------------------------------------------------------
//styled
const Terms = styled.div`
  & > div > div > div {
    padding: 10px 25px 35px 25px;

    * {
      text-align: justify;
      color: #424242;
      transform: skew(-0.03deg);
    }
  }
  & > div > div:nth-child(2) {
    display: none;
  }
  h2 {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e0e0e0;
    color: #424242;
    font-size: 24px;
    font-weight: 400;
  }

  h3 {
    margin-top: 30px;
    margin-bottom: 15px;
    font-size: 16px;
    color: #424242;
    font-weight: 600;
  }

  p {
    margin-top: 15px;
    font-size: 14px;
    line-height: 22px;
  }

  li {
    font-size: 14px;
    line-height: 22px;
  }

  @media (max-width: ${WIDTH_MOBILE}) {
    & > div > div > div {
      padding: 5px 20px 30px 20px;
    }
  }
`
