/**
 * @title 채팅 ui 컴포넌트
 */
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'
import {Scrollbars} from 'react-custom-scrollbars'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

export default props => {
  //---------------------------------------------------------------------
  console.log('메세지 타입 = ' + props)
  switch (props.data.cmd) {
    case 'connect':
      return (
        <>
          <Message className={'guide'}>
            <div>
              <span>
                방송방에 입장하였습니다.
                <br /> 적극적인 방송참여로 방송방의 인싸가 되어보세요!
              </span>
            </div>
          </Message>
          <Message className="enter-exit">
            <div>
              <span>{props.data.msg}</span>
            </div>
          </Message>
        </>
      )
      break
    case 'chat':
      return (
        <Message className="comment" profImg={props.data.user.image}>
          <figure></figure>
          <div>
            <p>{props.data.user.nk}</p>
            <pre>{props.data.msg}</pre>
          </div>
        </Message>
      )
      break
    default:
      break
  }
  // return (
  //   <Content bgImg={roomInfo.bgImg.url}>
  //     <Message className="guide">
  //       <div>
  //         <span>
  //           방송방에 입장하였습니다.
  //           <br /> 적극적인 방송참여로 방송방의 인싸가 되어보세요!
  //         </span>
  //       </div>
  //     </Message>
  //     <Message className="guide">
  //       <div>
  //         <span>[안내] 방송이 시작되었습니다.</span>
  //       </div>
  //     </Message>
  //     {/* 입장 */}
  //     <Message className="enter-exit">
  //       <div>
  //         <span>cherry🍒 님이 입장하셨습니다.</span>
  //       </div>
  //     </Message>
  //     {/* 기본 청취자 메시지 */}
  //     <Message className="comment" profImg={`${IMG_SERVER}/images/api/ti375a8312.jpg`}>
  //       <figure></figure>
  //       <div>
  //         <p>cherry🍒</p>
  //         <pre>목소리 좋으시네요~ 자주 들으러 올게요!</pre>
  //       </div>
  //     </Message>
  //     {/* 퇴장 */}
  //     <Message className="enter-exit">
  //       <div>
  //         <span>cherry🍒 님이 퇴장하셨습니다.</span>
  //       </div>
  //     </Message>
  //     {/* DJ, 매니저, 게스트일 경우 메시지 */}
  //     <Message className="comment" profImg={`${IMG_SERVER}/images/api/tica034j16080551.jpg`}>
  //       <figure></figure>
  //       <div>
  //         <p>
  //           <b className="dj">DJ</b>꿀보이스😍
  //           {/* <b className="manager">매니저</b>꿀매니저😍
  //               <b className="guest">게스트</b>지나가는게스트😍 */}
  //         </p>
  //         <pre>안녕하세요. 내가 바로 DJ입니다.</pre>
  //       </div>
  //     </Message>
  //     {/* 좋아요~ */}
  //     <Message className="like" profImg={`${IMG_SERVER}/images/api/tica034j16080551.jpg`}>
  //       <div>
  //         <span>러브angel~👼 님이 좋아요를 하셨습니다.</span>
  //       </div>
  //     </Message>
  //     <Message className="like" profImg={`${IMG_SERVER}/images/api/tica034j16080551.jpg`}>
  //       <div>
  //         <span>가장 못생긴 오징어🦑 님이 좋아요를 하셨습니다.</span>
  //       </div>
  //     </Message>
  //     {/* 가이드 메시지 */}
  //     <Message className="guide">
  //       <div>
  //         <span>[안내] 방송 종료 시간까지 5분 남았습니다.</span>
  //       </div>
  //     </Message>
  //   </Content>
  // )
}

//---------------------------------------------------------------------
//styled

const Content = styled.section`
  position: relative;
  height: 100%;
  background: #555 url(${props => props.bgImg}) no-repeat center center / cover;
  &:before {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    content: '';
  }
`
const CommentList = styled.div`
  /* overflow-y: scroll; */
  position: absolute;
  bottom: 66px;
  width: 100%;
  height: calc(100% - 240px);
  & > div {
    /* height: 100%; */
    position: absolute !important;
    bottom: 0;
    max-height: 100% !important;
    width: 100%;
  }

  & > div > div:first-child {
    margin-right: -18px !important;
  }
`

const Message = styled.div`
  position: relative;
  margin: 16px;

  figure {
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #fff url(${props => props.profImg}) no-repeat center center / cover;
  }

  div {
    padding-left: 44px;
  }

  &.enter-exit div {
    text-align: center;
    span {
      display: flex;
      width: 100%;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: -0.35px;
      transform: skew(-0.03deg);

      &:before,
      &:after {
        border-top: 1px solid rgba(255, 255, 255, 0.3);
        margin: 0 12px 0 0;
        flex: 1 0 12px;
        content: '';
      }
      &:after {
        margin: 0 0 0 12px;
        flex: 1 0 12px;
      }
    }
  }

  &.like span {
    display: block;
    padding: 7px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 36px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    transform: skew(-0.03deg);
  }

  &.guide span {
    display: inline-block;
    color: #fff;
    font-size: 14px;
    line-height: 1.6;
    transform: skew(-0.03deg);
  }

  p {
    margin: 0 0 8px 4px;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: -0.3px;
    transform: skew(-0.03deg);
    b {
      display: inline-block;
      margin-right: 5px;
      padding: 2px 6px;
      border-radius: 20px;
      font-size: 10px;

      &.dj {
        background: ${COLOR_MAIN};
      }
      &.manager {
        background: ${COLOR_POINT_Y};
      }
      &.guest {
        background: ${COLOR_POINT_P};
      }
    }
  }

  pre {
    display: inline-block;
    padding: 9px 14px;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    font-family: 'NanumSquare';
    font-size: 14px;
    font-weight: 600;
    line-height: 18px;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-word;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
  }
`
