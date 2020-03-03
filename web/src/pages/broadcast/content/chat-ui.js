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

const sc = require('context/socketCluster')
import MessageType from './chat-message-type'
//component
import InfoContainer from './chat-info-container'
import InputComment from './chat-input-comment'

export default props => {
  //---------------------------------------------------------------------
  const context = useContext(Context)
  //state
  const [comments, setComments] = useState([]) //기본 채팅창에 들어가는 메시지들
  const [top1Msg, setTop1Msg] = useState([]) // 채팅창 상단 top1메시지
  const [top2Msg, setTop2Msg] = useState([]) // 채팅창 상단 top2메시지
  const [roomInfo, setRoomInfo] = useState({...props.location.state})
  const [checkMove, setCheckMove] = useState(false) // 채팅창 스크롤이 생긴 후 최초로 스크롤 움직였는지 감지
  const [child, setChild] = useState() // 메세지 children
  //ref
  const chatArea = useRef(null) // 채팅창 스크롤 영역 선택자
  const scrollbars = useRef(null) // 채팅창 스크롤 영역 선택자

  //---------------------------------------------------------------------
  //function
  const postMessageChange = e => {
    //context
    if (e.target.value && e.key == 'Enter') {
      if (context.token.isLogin) {
        sc.SendMessageChat({...props.location.state, msg: e.target.value})
        e.target.value = ''
      } else {
        e.target.value = ''
        alert('비회원은 채팅에 참여 하실수 없습니다.')
      }
    }
  }

  //스크롤
  const handleOnWheel = e => {
    const top = scrollbars.current.getValues().top
    if (top < 1) {
      // 스크롤 위로 작동
      setCheckMove(true)
    } else if (top == 1 || top == 0) {
      // 스크롤 없거나 바텀 찍었음
      setCheckMove(false)
    }
  }

  //채팅창 리스트가 업데이트 되었을때
  const scrollOnUpdate = e => {
    chatArea.current.children[0].children[0].style.maxHeight = `calc(${chatArea.current.offsetHeight}px + 17px)`
    setChild(scrollbars.current.props.children)
  }

  let msgData = []
  const getRecvChatData = data => {
    console.log('메시지데이터', data)

    msgData = msgData.concat(data)

    const resulte = msgData.map((item, index) => {
      return <MessageType {...item} key={index} rcvData={data}></MessageType>
    })

    setComments(resulte)
  }

  //top 메시지 부분.. top1, top2 나누어져있음

  let top2Data = []
  const getRecvTopData = data => {
    const recvTopData = data.detail.data.recvMsg
    if (recvTopData.position === 'top1') {
      const resulte = (
        <div className="system-msg top1">
          <span>{recvTopData.msg}</span>
        </div>
      )
      setTop1Msg(resulte)
    } else {
      top2Data = topData.concat(data)
      const resulte = top2Data.map((item, index) => {
        return (
          <div className={`system-msg top2 ${item.level == 4 ? 'tip' : ''}`} key={index} level={item.level}>
            <span>{item.msg}</span>
          </div>
        )
      })
      setTop2Msg(resulte)
    }
  }

  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {
    const res = document.addEventListener('socketSendData', data => {
      const recvMsg = data.detail.data.recvMsg
      console.log('recvMsgrecvMsgrecvMsgrecvMsgrecvMsg', recvMsg)
      if (data && data.detail) {
        if (recvMsg.position === 'chat') {
          getRecvChatData(data.detail)
        } else {
          getRecvTopData(data.detail)
        }
      }
      //settopTipMessageData(data.detail)
      return () => document.removeEventListener('socketSendData')
    })

    //임시 테스트값
    // setTop1Msg([
    //   <div className="system-msg top1">
    //     <span>마이크OFF</span>
    //   </div>
    // ])
    // setTop2Msg([
    //   <div className="system-msg top2">
    //     <span>긴급입니다!! 긴급입니다!!</span>
    //   </div>,
    //   <div className="system-msg top2">
    //     <span>운영정책 위반사항으로 채팅창 사용이 금지됩니다.</span>
    //   </div>,
    //   <div className="system-msg top2">
    //     <span>[안내] 방송 종료까지 5분 남았습니다.</span>
    //   </div>,
    //   <div className={`system-msg top2 ${3 == 3 ? 'tip' : ''}`}>
    //     <span>누군가 팬이 되어 고마움을 표현하세요 ! 서로 행복해집니다^_^</span>
    //   </div>
    // ])
  }, [])

  useEffect(() => {
    if (!checkMove) {
      scrollbars.current.scrollToBottom()
    }
  }, [child])

  //---------------------------------------------------------------------
  return (
    <Content bgImg={roomInfo.bgImg.url}>
      {/* 상단 정보 영역 */}
      <InfoContainer {...roomInfo} top1Msg={top1Msg} top2Msg={top2Msg} />
      <CommentList className="scroll" ref={chatArea}>
        <Scrollbars ref={scrollbars} autoHeight autoHeightMax={'100%'} onUpdate={scrollOnUpdate} onScrollStop={handleOnWheel} autoHide>
          {comments}
        </Scrollbars>
      </CommentList>
      <InputComment {...roomInfo} onKeyPress={postMessageChange} />
    </Content>
  )
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

  &.present {
    pre {
      overflow: hidden;
      position: relative;
      padding-left: 65px;
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
