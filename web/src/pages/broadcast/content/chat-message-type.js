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
import {BroadCastStore} from '../store'
import Api from 'context/api'

export default props => {
  const context = useContext(Context)
  const store = useContext(BroadCastStore)

  //팬등록
  async function broad_fan_insert() {
    console.log('팬등록 = ' + store.roomInfo)
    const res = await Api.broad_fan_insert({
      data: {
        memNo: store.roomInfo.bjMemNo,
        roomNo: store.roomInfo.roomNo
      }
    })
    //Error발생시
    if (res.result === 'fail' || res.result === 'success') {
      context.action.alert({
        // 부스트 사용완료 팝업
        callback: () => {
          console.log('callback처리')
        },
        msg: res.message
      })
    }
  }
  // useEffect(() => {
  //   console.log('방정보가 수정 되어 여기에 한번 들어와야 된다. ')
  // }, [store.roomInfo])

  //---------------------------------------------------------------------
  let {cmd, recvMsg, user, reqGiftImg} = props.data
  if (cmd === 'reqBcStart' || cmd === 'reqWelcome' || cmd === 'chatEnd' || cmd === 'bjEnd') {
    return (
      <>
        <Message className="guide">
          <div>
            <span>{recvMsg.msg}</span>
          </div>
        </Message>
      </>
    )
  } else if (cmd === 'connect' || cmd === 'disconnect' || cmd === 'reqKickOut') {
    return (
      <>
        <Message className="enter-exit">
          <div>
            <span>{recvMsg.msg}</span>
          </div>
        </Message>
      </>
    )
  } else if (cmd === 'chat') {
    return (
      <Message className="comment" profImg={user.image}>
        <figure></figure>
        <div>
          <p>
            {user.auth == 3 ? (
              <b className="dj">DJ</b>
            ) : user.auth == 2 ? (
              <b className="guest">게스트</b>
            ) : user.auth == 1 ? (
              <b className="manager">매니저</b>
            ) : (
              <></>
            )}
            {user.nk}
          </p>

          <pre>{recvMsg.msg}</pre>
        </div>
      </Message>
    )
  } else if (cmd === 'reqGood') {
    return (
      <Message className="like">
        <div>
          <span>{recvMsg.msg}</span>
        </div>
      </Message>
    )
  } else if (cmd === 'reqGiftImg') {
    return (
      <Message className="comment present" profImg={user.image} itemImg={reqGiftImg.itemImg}>
        <figure></figure>
        <div>
          <p>
            {user.auth == 3 ? (
              <b className="dj">DJ</b>
            ) : user.auth == 2 ? (
              <b className="guest">게스트</b>
            ) : user.auth == 1 ? (
              <b className="manager">매니저</b>
            ) : (
              <></>
            )}
            {user.nk}
          </p>
          <pre>
            {recvMsg.msg}
            {/* <strong>도넛을 먹는 달덩이 X100</strong> 을<br />
            선물하였습니다. */}
          </pre>
        </div>
      </Message>
    )
  } else if (cmd === 'reqGuest') {
    return (
      <Message className="like guest">
        <div>
          <span>{recvMsg.msg}</span>
        </div>
      </Message>
    )
  } else if (cmd === 'reqGoodFirst') {
    return (
      <Message
        className="comment action"
        profImg={`${IMG_SERVER}/images/api/tica034j16080551.jpg`}
        itemImg={`${IMG_SERVER}/images/api/boost_active@2x.png`}>
        <figure></figure>
        <div>
          <p>
            <b className="dj">DJ</b>BJ라디오
          </p>
          <span>
            {recvMsg.msg}
            {/* 좋아요 감사합니다.
            <br />
            {`${props.rcvData.data.user.nk} 님`}
            <br />
            저의 팬이 되어주시겠어요? */}
            <button onClick={() => broad_fan_insert()}>+팬등록</button>
          </span>
        </div>
      </Message>
    )
  } else {
    return <></>
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
  //      {/* 메시지 날리는 사람이 팬일경우 className fan 추가 */}
  //     <Message className="comment fan" profImg={`${IMG_SERVER}/images/api/ti375a8312.jpg`}>
  //       <figure></figure>
  //       <div>
  //         <p>cherry🍒</p>
  //         <pre>제가 팬입니다. 클래스네임 fan 추가해주세요~ </pre>
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
  //         <span>가장 못생긴 오징어🦑 님이 좋아요를 하셨습니다.</span>
  //       </div>
  //     </Message>
  //     {/* 가이드 메시지 */}
  //     <Message className="guide">
  //       <div>
  //         <span>[안내] 방송 종료 시간까지 5분 남았습니다.</span>
  //       </div>
  //     </Message>
  //     {/* 게스트 참여 */}
  // <Message className="like guest">
  //   <div>
  //     <span>러브angel~👼 님이 게스트 참여를 원합니다. 수락해주세요!</span>
  //   </div>
  // </Message>

  //     {/* 선물 전달 */}
  // <Message className="comment present" profImg={`${IMG_SERVER}/images/api/tica034j16080551.jpg`} itemImg={`${IMG_SERVER}/images/api/boost_active@2x.png`}>
  //   <figure></figure>
  //   <div>
  //     <p>
  //       <b className="manager">DJ</b>꿀매니저😍
  //     </p>
  //     <pre>
  //       <strong>도넛을 먹는 달덩이 X100</strong> 을<br />
  //       선물하였습니다.
  //     </pre>
  //   </div>
  // </Message>

  // 팬등록, 선물주세요
  // <Message className="comment action" profImg={`${IMG_SERVER}/images/api/tica034j16080551.jpg`} itemImg={`${IMG_SERVER}/images/api/boost_active@2x.png`}>
  //           <figure></figure>
  //           <div>
  //             <p>
  //               <b className="dj">DJ</b>BJ라디오
  //             </p>
  //             <span>
  //               좋아요 감사합니다.
  //               <br />
  //               000님
  //               <br />
  //               저의 팬이 되어주시겠어요?
  //               <button>+팬등록</button>
  //             </span>
  //           </div>
  //         </Message>
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

  &.action {
    span {
      display: block;
      overflow: hidden;
      position: relative;
      max-width: 270px;
      padding: 14px;
      padding-bottom: 54px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 14px;
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
      font-size: 14px;
      line-height: 1.6;
      text-align: center;
      transform: skew(-0.03deg);
      button {
        position: absolute;
        bottom: 0;
        left: 0;
        width: calc(100% + 2px);
        padding: 10px 0;
        background: ${COLOR_MAIN};
        color: #fff;
        font-size: 14px;
      }
    }
  }

  &.fan figure:after {
    display: inline-block;
    position: absolute;
    right: -3px;
    bottom: 0;
    padding: 1px 4px;
    border-radius: 50%;
    background: ${COLOR_MAIN};
    font-size: 8px;
    color: #fff;
    content: 'F';
  }

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

  &.present {
    pre {
      overflow: hidden;
      position: relative;
      padding: 16px 14px 16px 65px;
      &:before {
        position: absolute;
        left: 0;
        top: 0;
        width: 54px;
        height: 100%;
        border-radius: 10px;
        background: #fff url(${props => props.itemImg}) no-repeat center center / cover;
        background-size: 48px;
        content: '';
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

  &.like.guest span {
    background: rgba(133, 85, 246, 0.5);
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
    font-size: 14px;
    font-weight: 600;
    line-height: 18px;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-word;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    margin: 12px 10px;
    p {
      margin: 0 0 6px 4px;
    }
    div {
      padding-left: 42px;
      span {
        font-size: 12px;
      }
    }
    &.enter-exit div,
    &.like div {
      padding-left: 0;
    }
    &.enter-exit div {
      span {
        font-size: 12px;
      }
    }
    &.guide {
      span {
        font-size: 12px;
      }
    }
    &.like {
      span {
        font-size: 12px;
      }
    }
    pre {
      padding: 8px 10px;
      font-size: 12px;
    }
  }
`
