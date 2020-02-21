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

//component
import InfoContainer from './chat-info-container'
import InputComment from './chat-input-comment'

export const getTest = data => {
  //console.log(JSON.stringify(data))
  const resulte = (
    <Message key={0}>
      <figure></figure>
      <div>
        <p>{data.event}</p>
        <pre>{data.event}</pre>
      </div>
    </Message>
  )
  //return data
  //console.log('메세지 날려라')

  //setComments([comments, resulte])
}

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //state
  const [comments, setComments] = useState([])
  const [roomInfo, setRoomInfo] = useState({...props.location.state})
  const [checkMove, setCheckMove] = useState(false) // 채팅창 스크롤이 생긴 후 최초로 스크롤 움직였는지 감지
  //ref
  const chatArea = useRef(null) // 채팅창 스크롤 영역 선택자
  const scrollbars = useRef(null) // 채팅창 스크롤 영역 선택자
  const wrap = useRef(null)

  //---------------------------------------------------------------------
  //function
  //Sconst wrap =

  //채팅 입력시(input KeyPress)
  const handleCommentKeyPress = e => {
    if (e.target.value && e.key == 'Enter') {
      //setComments(...comments, e.target.value)
      const resulte = (
        <Message key={0}>
          <figure></figure>
          <div>
            <p>닉네임</p>
            <pre>{e.target.value}</pre>
          </div>
        </Message>
      )
      //const resulte = `<pre>${e.target.value}</pre>`

      console.log('메세지 날려라')
      //wrap.current.append(resulte)

      setComments([comments, resulte])
      sc.SendMessageChat({...props.location.state, msg: e.target.value})
      // objSendInfo.roomNo = props.location.state.roomNo
      // objSendInfo.message = e.target.value

      //sc.SendMessageChat(props)
      e.target.value = ''
    }
  }

  //채팅창 마우스 휠 작동시
  const handleOnWheel = () => {
    setCheckMove(true)
  }

  //채팅창 리스트가 업데이트 되었을때
  const scrollOnUpdate = e => {
    //스크롤영역 height 고정해주기, 윈도우 리사이즈시에도 동작
    chatArea.current.children[0].children[0].style.maxHeight = `calc(${chatArea.current.offsetHeight}px + 17px)`
    if (!checkMove) {
      scrollbars.current.scrollToBottom()
    }
  }

  // document.addEventListener('socket-receiveMessageData', scRecvData => {
  //   console.log(scRecvData.detail.data.data.msg)
  //   // const resulte = (
  //   //   <Message key={0}>
  //   //     <figure></figure>
  //   //     <div>
  //   //       <p>{scRecvData.detail.data.data.user.nk}</p>
  //   //       <pre>{scRecvData.detail.data.data.msg}</pre>
  //   //     </div>
  //   //   </Message>
  //   // )
  //   // setComments([comments, resulte])
  // })
  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {
    console.log('나이스')
  }, [])

  //useEffect(() => {}, [comments])

  //---------------------------------------------------------------------
  return (
    <Content bgImg={roomInfo.bgImg.url}>
      {/* 상단 정보 영역 */}
      <InfoContainer {...roomInfo} />
      <CommentList className="scroll" onWheel={handleOnWheel} ref={chatArea}>
        <Scrollbars ref={scrollbars} autoHeight autoHeightMax={'100%'} onUpdate={scrollOnUpdate} autoHide>
          {/* <div ref={wrap}></div> */}
          {comments}
        </Scrollbars>
      </CommentList>
      {/* 하단 메시지 입력 영역 */}
      <InputComment onKeyPress={handleCommentKeyPress} />
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
