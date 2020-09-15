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
import ClipEvent from 'pages/common/clip_event'

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
      case 'CLIP_EVENT':
        return (
          <>
            <button
              onClick={() => {
                context.action.updatePopupVisible(false)
              }}>
              팝업닫기
            </button>
            <ClipEvent />
          </>
        )

      case 'CLIP_OPEN':
        return (
          <>
            <button
              onClick={() => {
                context.action.updatePopupVisible(false)
              }}>
              팝업닫기
            </button>
            <ClipOpen />
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
      setLayout('proofShot')
    } else if (context.popup_code[0] == 'CLIP_EVENT') {
      setLayout('clipEvent')
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
  padding-left: 25px;
  padding-right: 25px;
  align-items: center;
  justify-content: center;
  z-index: 100;

  & .logo {
    margin-top: 0;
  }

  @media (max-width: ${WIDTH_MOBILE}) {
    padding: 0;
  }
`
const Wrap = styled.div`
  position: relative;
  width: 520px;
  padding: 50px 40px;
  background: #fff;
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 100%;
    height: 100%;
    padding: 60px 5%;
  }

  &.round {
    width: 500px;
    padding: 16px 0;
    height: 80%;
    max-height: auto;
    border-radius: 10px;
    @media (max-width: ${WIDTH_MOBILE}) {
      height: 100%;
      max-height: 80%;
    }
    &.charge {
      width: 340px;
      max-height: 90%;
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
      &.terms {
        width: 90%;
      }
    }
  }

  &.guidance {
    width: 90%;
    height: 80%;
    max-height: auto;
    padding: 0;
    border-radius: 10px;
    @media (max-width: ${WIDTH_MOBILE}) {
      height: 100%;
      max-height: 80%;
    }

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
    @media (max-width: ${WIDTH_MOBILE}) {
      height: 100%;
      max-height: 240px;
    }

    & > button {
      display: none;
    }
  }

  &.rankPopup {
    width: 90%;
    height: 80%;
    height: fit-content;
    max-height: 450px;
    padding: 0;
    border-radius: 10px;
    @media (max-width: ${WIDTH_MOBILE}) {
      height: fit-content;
      max-height: 310px;
    }
  }

  & > button {
    display: inline-block;
    position: absolute;
    width: 36px;
    height: 36px;
    top: -35px;
    right: 0;
    background: url(${IMG_SERVER}/images/common/ic_close_m@2x.png) no-repeat center center / cover;
    text-indent: -9999px;
    cursor: pointer;
  }

  &.proofShot {
    width: 90%;
    height: 80%;
    max-height: auto;
    padding: 0;
    border-radius: 10px;
    @media (max-width: ${WIDTH_MOBILE}) {
      height: fit-content;
    }
    & > button {
      display: none;
    }
  }

  &.clipopen {
    padding: 16px;
    box-sizing: border-box;
    max-width: 360px;

    max-height: auto;
    padding: 0;
    border-radius: 16px;
    @media (max-width: ${WIDTH_MOBILE}) {
      height: fit-content;
    }
    & > button {
      display: none;
    }
  }

  & > button {
    display: inline-block;
    position: absolute;
    width: 36px;
    height: 36px;
    top: -35px;
    right: 0;
    background: url(${IMG_SERVER}/images/common/ic_close_m@2x.png) no-repeat center center / cover;
    text-indent: -9999px;
    cursor: pointer;
  }

  @media (max-width: ${WIDTH_MOBILE}) {
    &.square {
      & > button {
        top: 18px;
        right: 8px;
        width: 30px;
        height: 30px;
        z-index: 10;
        &:before,
        &:after {
          position: absolute;
          top: 0;
          left: 15px;
          content: ' ';
          height: 30px;
          width: 1px;
          background-color: #959595;
        }
        &:before {
          transform: rotate(45deg);
        }
        &:after {
          transform: rotate(-45deg);
        }
      }
    }
    &.charge {
      & > button {
        top: 15px;
        left: 4%;
        width: 30px;
        height: 30px;
        z-index: 10;
        &:before {
          position: absolute;
          left: 11px;
          top: 8px;
          width: 10px;
          height: 10px;
          border-left: 2px solid #757575;
          border-top: 2px solid #757575;
          transform: rotate(-45deg);
          content: '';
        }
      }
    }
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
  background: rgba(0, 0, 0, 0.8);
  z-index: -1;
`
