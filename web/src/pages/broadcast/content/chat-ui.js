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

export default props => {
  //---------------------------------------------------------------------
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
  const postMessageChange = e => {
    //context
    if (e.target.value && e.key == 'Enter') {
      if (context.token.isLogin) {
        //     const resulte = (
        //       <Message key={0}>
        //         <figure></figure>
        //         <div>
        //           <p>닉네임</p>
        //           <pre>{e.target.value}</pre>
        //         </div>
        //       </Message>
        //     )
        //     //setComments([comments, resulte])
        var node = document.createElement('LI')
        var textnode = document.createTextNode(e.target.value)
        node.appendChild(textnode)
        console.log('node= ' + JSON.stringify(node))
        document.getElementById('myList').appendChild(node)
        sc.SendMessageChat({...props.location.state, msg: e.target.value})
        e.target.value = ''
      } else {
        e.target.value = ''
        alert('비회원은 채팅에 참여 하실수 없습니다.')
      }
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
  const getRecvData = data => {
    console.log(data)
    const resulte = (
      <Message key={0}>
        <figure></figure>
        <div>
          <p>닉네임</p>
          <pre>{data.detail.data.data.msg}</pre>
        </div>
      </Message>
    )

    //console.log('메세지 날려라')

    setComments([comments, resulte])

    console.log(comments)
  }

  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {
    const res = document.addEventListener('socketSendData', data => {
      getRecvData(data)
      return () => document.removeEventListener('socketSendData')
    })
  }, [])

  //useEffect(() => {}, [comments])

  //---------------------------------------------------------------------
  return (
    <Content bgImg={roomInfo.bgImg.url}>
      {/* 상단 정보 영역 */}
      <InfoContainer {...roomInfo} />
      <CommentList className="scroll" onWheel={handleOnWheel} ref={chatArea}>
        <Scrollbars ref={scrollbars} autoHeight autoHeightMax={'100%'} onUpdate={scrollOnUpdate} autoHide>
          {/* 가이드 메시지 */}
          <Message className="guide">
            <div>
              <span>
                방송방에 입장하였습니다.
                <br /> 적극적인 방송참여로 방송방의 인싸가 되어보세요!
              </span>
            </div>
          </Message>
          <Message className="guide">
            <div>
              <span>[안내] 방송이 시작되었습니다.</span>
            </div>
          </Message>
          {/* 입장 */}
          <Message className="enter-exit">
            <div>
              <span>cherry🍒 님이 입장하셨습니다.</span>
            </div>
          </Message>
          {/* 기본 청취자 메시지 */}
          <Message className="comment" profImg={`${IMG_SERVER}/images/api/ti375a8312.jpg`}>
            <figure></figure>
            <div>
              <p>cherry🍒</p>
              <pre>목소리 좋으시네요~ 자주 들으러 올게요!</pre>
            </div>
          </Message>
          {/* 퇴장 */}
          <Message className="enter-exit">
            <div>
              <span>cherry🍒 님이 퇴장하셨습니다.</span>
            </div>
          </Message>
          {/* DJ, 매니저, 게스트일 경우 메시지 */}
          <Message className="comment" profImg={`${IMG_SERVER}/images/api/tica034j16080551.jpg`}>
            <figure></figure>
            <div>
              <p>
                <b className="dj">DJ</b>꿀보이스😍
                {/* <b className="manager">매니저</b>꿀매니저😍
                <b className="guest">게스트</b>지나가는게스트😍 */}
              </p>
              <pre>안녕하세요. 내가 바로 DJ입니다.</pre>
            </div>
          </Message>
          {/* 좋아요~ */}
          <Message className="like" profImg={`${IMG_SERVER}/images/api/tica034j16080551.jpg`}>
            <div>
              <span>러브angel~👼 님이 좋아요를 하셨습니다.</span>
            </div>
          </Message>
          <Message className="like" profImg={`${IMG_SERVER}/images/api/tica034j16080551.jpg`}>
            <div>
              <span>가장 못생긴 오징어🦑 님이 좋아요를 하셨습니다.</span>
            </div>
          </Message>
          {/* 가이드 메시지 */}
          <Message className="guide">
            <div>
              <span>[안내] 방송 종료 시간까지 5분 남았습니다.</span>
            </div>
          </Message>

          <li id="myList"></li>
        </Scrollbars>
      </CommentList>
      <InputComment>
        <input type="text" placeholder="대화를 입력해주세요." onKeyPress={postMessageChange} />
      </InputComment>
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
