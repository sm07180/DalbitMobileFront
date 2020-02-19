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
  //context
  const context = useContext(Context)
  //state
  const [comments, setComments] = useState([])
  const [checkMove, setCheckMove] = useState(false) // 채팅창 스크롤이 생긴 후 최초로 스크롤 움직였는지 감지
  //ref
  const chatArea = useRef(null) // 채팅창 스크롤 영역 선택자
  const scrollbars = useRef(null) // 채팅창 스크롤 영역 선택자

  //---------------------------------------------------------------------
  //function

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
      setComments([comments, resulte])
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

  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {}, [])

  useEffect(() => {}, [comments])

  //---------------------------------------------------------------------
  return (
    <Content bgImg="">
      <InfoArea>정보 담는 영역</InfoArea>
      <CommentList className="scroll" onWheel={handleOnWheel} ref={chatArea}>
        <Scrollbars ref={scrollbars} autoHeight autoHeightMax={'100%'} onUpdate={scrollOnUpdate} autoHide>
          <Message>
            <figure></figure>
            <div>
              <p>닉네임</p>
              <pre>여러가지 버전 메시지 퍼블 중</pre>
            </div>
          </Message>
          {comments}
        </Scrollbars>
      </CommentList>
      <InputComment>
        <input type="text" placeholder="대화를 입력해주세요." onKeyPress={handleCommentKeyPress} />
      </InputComment>
    </Content>
  )
}

//---------------------------------------------------------------------
//styled

const Content = styled.section`
  position: relative;
  height: 100%;
  background: #555;
`

const InfoArea = styled.div`
  height: 80px;
  background: #212121;
`

const CommentList = styled.div`
  /* overflow-y: scroll; */
  position: absolute;
  bottom: 66px;
  width: 100%;
  height: calc(100% - 146px);
  & > div {
    /* height: 100%; */
    position: absolute !important;
    bottom: 0;
    max-height: 100% !important;
    width: 100%;
  }
`

const Message = styled.div`
  border: 1px solid #000;

  & + & {
    margin-top: 20px;
  }

  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-word;
  }
`

const InputComment = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 66px;
  padding: 15px;
  background: #212121;

  input {
    width: 100%;
    border: 0;
    border-radius: 36px;
    line-height: 36px;
    text-indent: 18px;
  }
`
