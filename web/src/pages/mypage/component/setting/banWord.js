/**
 * @file /mypage/component/banWord.js
 * @brief 마이페이지 방송설정 - 금지어 설정
 **/
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

export default props => {
  //-----------------------------------------------------------------------------
  //contenxt
  const context = useContext(Context)

  //state
  const [showState, setShowState] = useState(false)

  //-----------------------------------------------------------------------------
  //function

  //-----------------------------------------------------------------------------
  return (
    <Content>
      <button
        className="ban-add-btn"
        onClick={() => {
          setShowState(false)
        }}>
        금지어 추가
      </button>
      {/* <div className="input-wrap">
        <input type="text" maxLength="12" />
        <button>삭제</button>
      </div>
      <div className="input-wrap">
        <input type="text" maxLength="12" />
        <button>삭제</button>
      </div> */}
      <p className="info">금지어는 최대 12자 이내로만 등록 가능합니다.</p>
      <p className="info">채팅 금지어 (최대 100개)를 직접 설정 하실 수 있습니다.</p>
      {/* <div className="btn-wrap">
        <button className="white">추가</button>
        <button className="purple">저장</button>
      </div> */}
    </Content>
  )
}

const Content = styled.div`
  margin-top: 16px;

  .input-wrap {
    display: flex;
    input {
      width: calc(100% - 102px);
      padding: 0 12px;
      border: 1px solid #e0e0e0;
      border-right: 0;
      color: #424242;
      line-height: 48px;
    }
    button {
      flex-basis: 102px;
      background: #bdbdbd;
      color: #fff;
      font-size: 16px;
    }
  }
  .input-wrap + .input-wrap {
    margin-top: 20px;
  }

  .ban-add-btn {
    position: relative;
    width: 100%;
    padding: 0 15px;
    border: 1px dashed #e0e0e0;
    color: ${COLOR_MAIN};
    font-size: 14px;
    line-height: 56px;
    text-align: left;
    &:after,
    &:before {
      display: block;
      position: absolute;
      border-radius: 2px;
      background: ${COLOR_MAIN};
      content: '';
    }
    &:before {
      top: 19px;
      right: 24px;
      width: 2px;
      height: 18px;
    }
    &:after {
      top: 27px;
      right: 16px;
      width: 18px;
      height: 2px;
    }
  }

  p.info {
    position: relative;
    margin-top: 40px;
    padding-left: 8px;
    color: #bdbdbd;
    font-size: 14px;
    line-height: 20px;
    transform: skew(-0.03deg);
    &:before {
      display: block;
      position: absolute;
      left: 0px;
      top: 7px;
      width: 4px;
      height: 4px;
      border-radius: 4px;
      background: #dbdbdb;
      content: '';
    }
  }
  p.info + p.info {
    margin-top: 0;
  }

  .btn-wrap {
    margin-top: 20px;
    text-align: center;
    button {
      display: inline-block;
      max-width: 160px;
      width: calc(50% - 4px);
      font-size: 16px;
      line-height: 48px;

      &.white {
        border: 1px solid ${COLOR_MAIN};
        background: #fff;
        color: ${COLOR_MAIN};
      }
      &.purple {
        border: 1px solid ${COLOR_MAIN};
        background: ${COLOR_MAIN};
        color: #fff;
      }
    }

    button + button {
      margin-left: 8px;
    }
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    p.info {
      font-size: 12px;
    }
    .btn-wrap {
      button {
        font-size: 14px;
      }
    }
    .input-wrap {
      input {
        font-size: 14px;
      }
      button {
        font-size: 14px;
      }
    }
  }

  @media (max-width: ${WIDTH_MOBILE}) {
    .btn-wrap {
      button {
        max-width: calc(50% - 4px);
      }
    }
  }
`
