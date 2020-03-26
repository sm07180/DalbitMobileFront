/**
 * @file use.js
 * @brief 설정 이용약관 컨텐츠
 *
 */
import React, {useState, useRef, useContext} from 'react'
import {Context} from 'context'
//swiper
//styled-component
import styled from 'styled-components'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

export default props => {
  const context = useContext(Context)
  //--------------------------------------------------------------------------
  return (
    <>
      <Wrap>
        <div className="btn-wrap">
          <div>서비스 이용약관</div>
          <button
            onClick={() => {
              context.action.updatePopup('TERMS', 'service')
            }}>
            [전문보기]
          </button>
        </div>
        <div className="btn-wrap">
          <div>개인정보 취급방침</div>
          <button
            onClick={() => {
              context.action.updatePopup('TERMS', 'privacy')
            }}>
            [전문보기]
          </button>
        </div>
        <div className="btn-wrap">
          <div>청소년 보호정책</div>
          <button
            onClick={() => {
              context.action.updatePopup('TERMS', 'youthProtect')
            }}>
            [전문보기]
          </button>
        </div>
        <div className="btn-wrap">
          <div>운영정책</div>
          <button
            onClick={() => {
              context.action.updatePopup('TERMS', 'operating')
            }}>
            [전문보기]
          </button>
        </div>
        <div className="btn-wrap">
          <div>마케팅 수신동의</div>
          <button
            onClick={() => {
              context.action.updatePopup('TERMS', 'maketing')
            }}>
            [전문보기]
          </button>
        </div>
      </Wrap>
    </>
  )
}
//style
//----------------------------------------------------------------------------
const Wrap = styled.div`
  & .btn-wrap {
    position: relative;
    padding: 21px 18px;
    font-size: 16px;
    color: #616161;
    letter-spacing: -0.4px;
    transform: skew(-0.03deg);
    & button {
      position: absolute;
      top: calc(50% - 9px);
      right: 10px;
      transform: translateY(-50%);
      font-size: 14px;
      color: #bdbdbd;
      letter-spacing: -0.35px;
      transform: skew(-0.03deg);
    }
  }
`
