/**
 * @title 채팅 ui 컴포넌트
 */
import React, {useState, useEffect, useContext, useRef, useMemo} from 'react'
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
import store from 'pages/store'
import {BroadCastStore} from '../store'

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
  const store = useContext(BroadCastStore)
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
    const recvTopData = data.data.recvMsg

    if (recvTopData.position === 'top1') {
      if (data.data.cmd !== 'reqMicOn' || data.data.cmd === 'reqCalling') {
        const result = (
          <div className="system-msg top1">
            <span>{recvTopData.msg}</span>
          </div>
        )
        setTop1Msg(result)
        document.getElementsByClassName('system-msg top1')[0].style.visibility = 'visible'
      } else {
        document.getElementsByClassName('system-msg top1')[0].style.visibility = 'hidden'
      }
    } else {
      top2Data = top2Data.concat(recvTopData)
      const result = top2Data.map((item, index) => {
        if (item.level < 5) {
          setTimeout(() => {
            const el = document.getElementsByClassName('top2-wrap')
            const el2 = document.getElementById(`index${index}`)
            //document.getElementsByTagName()
            //if (el[0]) el[0].childNodes[index].remove()
            if (el2 !== null) {
              el2.remove()
              top2Data.splice(index, 1)
            }
          }, item.time * 1000)
        }
        return (
          <TipMsg className={`system-msg top2 ${item.level == 4 ? 'tip' : ''}`} key={index} level={item.level} id={`index${index}`}>
            <span>{item.msg}</span>
          </TipMsg>
        )
      })
      setTop2Msg(result)
    }
  }

  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {
    const res = document.addEventListener('socketSendData', data => {
      const recvMsg = data.detail.data.recvMsg
      //총접속자 , 누적 사용자수 업데이트
      if (data.detail.data.cmd == 'connect' || data.detail.data.cmd == 'disconnect') context.action.updateBroadcastTotalInfo(data.detail.data.count)
      //랭킹,좋아요 수
      if (data.detail.data.cmd === 'reqChangeCount') context.action.updateBroadcastTotalInfo(data.detail.data.reqChangeCount)
      // 공지사항
      if (data.detail.data.cmd === 'reqNotice') {
        if (recvMsg.msg !== '') context.action.updateBroadcastTotalInfo({hasNotice: true})
        else context.action.updateBroadcastTotalInfo({hasNotice: false})

        store.action.updateNoticeMsg(recvMsg.msg)
        console.log(store.noticeMsg)
      }
      // 매니저 등록 / 해제 시 적용
      const recvauth = recvMsg.msg
      if (data.detail.data.cmd === 'reqGrant') {
        if (context.broadcastTotalInfo.auth < 2) {
          context.action.updateBroadcastTotalInfo({auth: parseInt(recvauth)})
        }
      }

      if (data && data.detail) {
        if (recvMsg.position === 'chat') {
          if (data.detail.data.cmd === 'reqRoomChangeInfo') {
            //console.log('방송방 수정 들어옴 = ' + data.detail.data.reqRoomChangeInfo)
            context.action.updateBroadcastTotalInfo(data.detail.data.reqRoomChangeInfo)
            store.action.updateRoomInfo(data.detail.data.reqRoomChangeInfo)
          } else {
            getRecvChatData(data.detail)
          }
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
    <Content bgImg={context.broadcastTotalInfo.bgImg.url != null ? context.broadcastTotalInfo.bgImg.url : roomInfo.bgImg.url}>
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

  @media (max-width: ${WIDTH_TABLET_S}) {
    bottom: 55px;
    height: calc(100% - 188px);
  }
`

const TipMsg = styled.div`
  order: ${props => props.level};
`
