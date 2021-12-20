/**
 * @file /components/ui/gganbu.js
 * @brief 깐부 이벤트 팝업
 */

import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'

//context
import {IMG_SERVER} from 'context/config'
import _ from 'lodash'
export default (props) => {
  const {msg} = props
  const [text, setText] = useState('조회 된 결과가')
  const [brText, setBrText] = useState('없습니다.')

  useEffect(() => {
    if (_.hasIn(props, 'text')) {
      setText(props.text)
    }
  }, [])
  return (
    <GganbuPop className={props.className}>
      <div className="contentWrap">
        <div className="title">깐부게임 보상</div>
        <h1>구슬 지급</h1>
        <p>
          방송 누적 2시간 달성하여
          <br />
          구슬 2개가 지급되었습니다.
        </p>
        <div className="statusMarble">
          <div className="marble">
            <img src="" alt="" />1
          </div>
          <div className="marble">
            <img src="" alt="" />1
          </div>
          <div className="marble">
            <img src="" alt="" />1
          </div>
          <div className="marble">
            <img src="" alt="" />1
          </div>
        </div>
        <h1>구슬 주머니 지급</h1>
        <p>
          달 1만개 선물 받으신 보상으로
          <br />
          구슬 주머니 1개가 지급되었습니다.
        </p>
        <div className="statusMarble">
          <div className="pocket">
            <img src="" alt="" />1
          </div>
        </div>
        {msg ? (
          msg
        ) : (
          <>
            <span>{text}</span>
            <span className="line">{brText}</span>
          </>
        )}
      </div>
    </GganbuPop>
  )
}

//---------------------------------------------------------------------
//styled

const GganbuPop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  box-sizing: border-box;
  z-index: 60;

  .contentWrap {
    position: relative;
    width: calc(100% - 32px);
    max-width: 390px;
    padding: 25px 15px 30px;
    border-radius: 15px;
    background-color: #fff;
    .title {
      margin-bottom: 18px;
      font-size: 21px;
      font-weight: 900;
      text-align: center;
      font-family: 'NanumSquare', sans-serif;
      letter-space: -1px;
      color: #000000;
    }
    ul {
      font-size: 13px;
      padding-left: 12px;
      li {
        position: relative;
        margin-bottom: 12px;
        letter-spacing: -1.5px;
        &:before {
          position: absolute;
          left: -8px;
          content: '-';
        }
        &.red {
          color: #ff5151;
        }
        em {
          font-style: normal;
          color: #6820a8;
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    .close {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 53px;
      height: 53px;
      cursor: pointer;
      img {
        width: 22px;
        height: 22px;
      }
    }
  }
`
