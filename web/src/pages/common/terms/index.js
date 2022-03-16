/**
 * @file terms/index.js
 * @brief 공통 약관 페이지
 * @use context.action.updatePopup('TERMS', '약관종류')
 */
import React, {useEffect, useRef} from 'react'
import styled from 'styled-components'
import {Scrollbars} from 'react-custom-scrollbars'
//context
//component
import Service from './content/service'
import Privacy from './content/privacy'
import YouthProtect from './content/youth-protect'
import Operating from './content/operating'
import Maketing from './content/maketing'
import EventDetail from './content/event_detail'
import EventGiftDetail from './content/event_gift_detail'

import './index.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxVisible} from "redux/actions/globalCtx";
////---------------------------------------------------------------------
export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  //ref
  const termsArea = useRef(null)

  //   레이어팝업컨텐츠
  const makeTermsContents = () => {
    switch (globalState.popup[1]) {
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
      case 'event-detail': {
        return <EventDetail {...props} />
      }
      case 'event-gift-detail': {
        return <EventGiftDetail {...props} />
      }

      default:
        return <div>약관 컨텐츠가 정의되지않음</div>
    }
  }

  const scrollOnUpdate = () => {
    if (document.getElementsByClassName('round')[0]) {
      termsArea.current.children[0].style.top = `30px`
      termsArea.current.children[0].children[0].style.maxHeight = `calc(${
        document.getElementsByClassName('round')[0].offsetHeight
      }px - 41px)`
    }
  }

  //useEffect
  useEffect(() => {
    return () => {
      dispatch(setGlobalCtxVisible(false));
    }
  }, [])

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
  & > div > div:nth-child(2) {
    display: none;
  }
  h2 {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #bdbdbd;
    color: #424242;
    font-size: 24px;
    font-weight: 400;
  }

  h3 {
    margin-top: 20px;
    margin-bottom: 12px;
    font-size: 16px;
    color: #424242;
    font-weight: 600;
  }

  p {
    margin-top: 15px;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.3px;
  }

  li {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.3px;
  }
`
