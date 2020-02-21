/**
 * @title 채팅 ui 하단 input 영역을 나타내는 컴포넌트
 */
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'
//context
import Api from 'context/api'
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //state
  //const

  //---------------------------------------------------------------------
  //map

  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {}, [])
  //---------------------------------------------------------------------
  return (
    <Content>
      <button className="present" title="선물하기">
        선물하기
      </button>
      <input type="text" placeholder="대화를 입력해주세요." onKeyPress={props.onKeyPress} />
      <div>
        <button className="like" title="좋아요~">
          좋아요
        </button>
        <button className="volume" title="볼륨조정">
          볼륨조정
        </button>
        <ul className="volume-box">
          <li>인사</li>
        </ul>
        <button className="quick" title="빠른말">
          빠른말
        </button>
        <ul className="quick-box">
          <li>인사</li>
          <li>박수</li>
          <li>감사</li>
          <li>세팅</li>
        </ul>
        <button className="menu" title="기타메뉴">
          기타메뉴
        </button>
        <ul className="menu-box">
          <li className="modify">수정하기</li>
          <li className="share">공유하기</li>
          <li className="exit">방송종료</li>
        </ul>
      </div>
    </Content>
  )
}

//---------------------------------------------------------------------
//styled

const Content = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 66px;
  padding: 15px;
  background: #212121;

  input {
    flex: 0 auto;
    width: 100%;
    margin: 0 10px;
    border: 0;
    border-radius: 36px;
    line-height: 36px;
    text-indent: 18px;
  }

  button {
    width: 36px;
    height: 36px;
    text-indent: -9999px;
    &.present {
      flex: 0 0 36px;
      background: url(${IMG_SERVER}/images/chat/ic_gift.png) no-repeat center center / cover;
    }
    &.like {
      background: url(${IMG_SERVER}/images/chat/ic_heart_i.png) no-repeat center center / cover;
    }
    &.volume {
      background: url(${IMG_SERVER}/images/chat/ic_volume.png) no-repeat center center / cover;
    }
    &.quick {
      background: url(${IMG_SERVER}/images/chat/ic_message.png) no-repeat center center / cover;
    }
    &.menu {
      background: url(${IMG_SERVER}/images/chat/ic_more.png) no-repeat center center / cover;
    }
  }

  div {
    flex: 0 0 160px;
    button + button {
      margin-left: 8px;
    }
    ul {
      display: none;
    }
  }
`
