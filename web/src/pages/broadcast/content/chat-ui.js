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
