/**
 * @file popup/index.js
 * @brief 공통 팝업
 * @use context.action.updatePopup('CHARGE')
 */
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
//context
import {IMG_SERVER, WIDTH_MOBILE} from 'context/config'
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

import SpecialdjGoodsDetail from 'pages/common/specialdjGoodsDetail'
import SpecialdjStarting from 'pages/common/specialdjStarting'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxVisible} from "redux/actions/globalCtx";

//
export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  //state
  const [layout, setLayout] = useState('')

  //   레이어팝업컨텐츠
  const makePopupContents = () => {
    switch (globalState.popup_code[0]) {
      case 'TERMS': //---------------------------------------이용약관
        return (
          <>
            <button
              onClick={() => {
                dispatch(setGlobalCtxVisible(false))
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
                dispatch(setGlobalCtxVisible(false))
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
                dispatch(setGlobalCtxVisible(false))
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
                dispatch(setGlobalCtxVisible(false))
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
                dispatch(setGlobalCtxVisible(false))
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
                dispatch(setGlobalCtxVisible(false))
              }}>
              팝업닫기
            </button>
            <AppDownAlrt />
          </>
        )

      case 'SPECIAL_DJ_GOODS_DETAIL':
        return (
          <>
            <button
              onClick={() => {
                dispatch(setGlobalCtxVisible(false))
              }}>
              팝업닫기
            </button>
            <SpecialdjGoodsDetail />
          </>
        )

      case 'SPECIAL_DJ_STARTING':
        return (
          <>
            <button
              onClick={() => {
                dispatch(setGlobalCtxVisible(false))
              }}>
              팝업닫기
            </button>
            <SpecialdjStarting />
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
                dispatch(setGlobalCtxVisible(false))
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
    globalState.popup_visible ? document.body.classList.add('popup-open') : document.body.classList.remove('popup-open')
  }, [globalState.popup_visible])

  useEffect(() => {
    if (globalState.popup_code[0] == 'TERMS') {
      setLayout('round terms')
    } else if (globalState.popup_code[0] == 'CHARGE') {
      setLayout('round charge')
    } else if (globalState.popup_code[0] === 'GUIDANCE') {
      setLayout('guidance')
    } else if (globalState.popup_code[0] === 'AGREEDETAIL') {
      setLayout('agreeDetail')
    } else if (globalState.popup_code[0] == 'RANK_POP' || globalState.popup_code[0] == 'ALARM') {
      setLayout('rankPopup')
    } else if (globalState.popup_code[0] == 'PROOF_SHOT') {
      setLayout('clipOpen')
    } else if (globalState.popup_code[0] == 'SPECIAL_DJ_GOODS_DETAIL') {
      setLayout('clipOpen')
    } else if (globalState.popup_code[0] == 'SPECIAL_DJ_STARTING') {
      setLayout('clipOpen')
    } else if (globalState.popup_code[0] == 'CLIP_OPEN') {
      setLayout('clipOpen')
    } else {
      setLayout('square')
    }
  }, [globalState.popup_code])

  //---------------------------------------------------------------------
  return (
    <Popup>
      {globalState.popup_visible && (
        <Container>
          <Wrap className={layout}>{makePopupContents()}</Wrap>
          <Background
            onClick={() => {
              dispatch(setGlobalCtxVisible(false))
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
    /* max-height: 446px; */
    /* background: #abc; */
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
