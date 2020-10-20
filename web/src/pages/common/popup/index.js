/**
 * @file popup/index.js
 * @brief 공통 팝업
 * @use context.action.updatePopup('CHARGE')
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//components

//contents
import Terms from 'pages/common/terms'
import Guidance from 'pages/common/guidance'
import AgreeDetail from 'pages/common/agree_detail'
import RankPopup from 'pages/common/rank_popup'
import ProofShot from 'pages/common/proofshot_popup'
import AlarmPop from 'pages/common/alarm_pop'
import ClipOpen from 'pages/common/clip_open'
import ClipInfo from 'pages/common/myclip_info'
import ClipEvent from 'pages/common/clip_event'
import AppDownAlrt from 'pages/common/appDownAlrt'

//
export default (props) => {
  //state
  const [layout, setLayout] = useState('')
  //context
  const context = useContext(Context)

  //   레이어팝업컨텐츠
  const makePopupContents = () => {
    switch (context.popup_code[0]) {
      case 'TERMS': //---------------------------------------이용약관
        return (
          <>
            <button
              onClick={() => {
                context.action.updatePopupVisible(false)
              }}>
              팝업닫기
            </button>
            <Terms {...props} />
          </>
        )
      case 'GUIDANCE':
        return (
          <>
            <button
              onClick={() => {
                context.action.updatePopupVisible(false)
              }}>
              팝업닫기
            </button>
            <Guidance />
          </>
        )
      case 'AGREEDETAIL':
        return (
          <>
            <button
              onClick={() => {
                context.action.updatePopupVisible(false)
              }}>
              팝업닫기
            </button>
            <AgreeDetail />
          </>
        )
      case 'RANK_POP':
        return (
          <>
            <button
              onClick={() => {
                context.action.updatePopupVisible(false)
              }}>
              팝업닫기
            </button>
            <RankPopup />
          </>
        )
      case 'PROOF_SHOT':
        return (
          <>
            <button
              onClick={() => {
                context.action.updatePopupVisible(false)
              }}>
              팝업닫기
            </button>
            <ProofShot />
          </>
        )
      case 'APPDOWN':
        return (
          <>
            <button
              onClick={() => {
                context.action.updatePopupVisible(false)
              }}>
              팝업닫기
            </button>
            <AppDownAlrt />
          </>
        )

      case 'CLIP_EVENT':
        return (
          <>
            <ClipEvent />
          </>
        )

      case 'CLIP_OPEN':
        return (
          <>
            <ClipOpen />
          </>
        )
      case 'MYCLIP':
        return (
          <>
            <ClipInfo />
          </>
        )
      case 'ALARM':
        return (
          <>
            <button
              onClick={() => {
                context.action.updatePopupVisible(false)
              }}>
              팝업닫기
            </button>
            <AlarmPop />
          </>
        )
      default:
        return <div>팝업 컨텐츠가 정의되지않음</div>
    }
  }
  //useEffect
  useEffect(() => {
    context.popup_visible ? document.body.classList.add('popup-open') : document.body.classList.remove('popup-open')
  }, [context.popup_visible])

  useEffect(() => {
    if (context.popup_code[0] == 'TERMS') {
      setLayout('round terms')
    } else if (context.popup_code[0] == 'CHARGE') {
      setLayout('round charge')
    } else if (context.popup_code[0] === 'GUIDANCE') {
      setLayout('guidance')
    } else if (context.popup_code[0] === 'AGREEDETAIL') {
      setLayout('agreeDetail')
    } else if (context.popup_code[0] == 'RANK_POP' || context.popup_code[0] == 'ALARM') {
      setLayout('rankPopup')
    } else if (context.popup_code[0] == 'PROOF_SHOT') {
      setLayout('clipOpen')
    } else if (context.popup_code[0] == 'CLIP_OPEN') {
      setLayout('clipOpen')
    } else {
      setLayout('square')
    }
  }, [context.popup_code])

  //---------------------------------------------------------------------
  return (
    <Popup>
      {context.popup_visible && (
        <Container>
          <Wrap className={layout}>{makePopupContents()}</Wrap>
          <Background
            onClick={() => {
              context.action.updatePopupVisible(false)
            }}
          />
        </Container>
      )}
    </Popup>
  )
}

//---------------------------------------------------------------------
const Popup = styled.section``
const Container = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  z-index: 100;
  box-sizing: border-box;
  margin: 0px 16px;

  & .logo {
    margin-top: 0;
  }
`
const Wrap = styled.div`
  border-radius: 20px;
  width: 100%;
  max-width: 328px;
  position: relative;
  background: #fff;
  &.round {
    max-width: 328px;
    max-height: 446px;
    max-height: auto;
    border-radius: 12px;
    height: 100%;
    max-height: 446px;

    &.charge {
      width: 340px;
      max-height: 446px;
      padding: 0;
      height: auto;
    }

    @media (max-width: ${WIDTH_MOBILE}) {
      &.charge {
        width: 100%;
        height: 100%;
        max-height: 100%;
        border-radius: 0;
      }
    }
  }

  &.guidance {
    width: 90%;
    height: 80%;
    max-height: auto;
    padding: 0;
    border-radius: 10px;
    height: 100%;
    max-height: 446px;

    & > button {
      display: none;
    }
  }

  &.agreeDetail {
    width: 90%;
    height: 80%;
    max-height: auto;
    padding: 0;
    border-radius: 10px;

    height: 100%;
    max-height: 446px;

    & > button {
      display: none;
    }
  }

  &.rankPopup {
    width: 90%;
    height: fit-content;
    max-height: 446px;
    padding: 0;
    border-radius: 10px;
    height: 100%;
    height: fit-content;
    max-height: 446px;
  }

  & > button {
    display: inline-block;
    position: absolute;
    width: 32px;
    height: 32px;
    top: -40px;
    right: 0;
    background: url(${IMG_SERVER}/images/api/close_w_l.svg) no-repeat center;
    text-indent: -9999px;
    cursor: pointer;
  }
`
const Background = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background: rgba(0, 0, 0, 0.8);
  z-index: -1;
`
