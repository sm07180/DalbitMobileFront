/**
 * @title 채팅 ui 컴포넌트
 */
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //state
  const [isSideOn, setIsSideOn] = useState(true)
  const [comments, setComments] = useState([])
  const [isOverHeight, setIsOverHeight] = useState(false) // 채팅창 스크롤이 있는지 없는지 상태 값, 초기엔 height가 0이므로 false
  const [checkMove, setCheckMove] = useState() // 채팅창 스크롤이 생긴 후 최초로 스크롤 움직였는지 감지
  //ref
  const chatArea = useRef(null) // 채팅창 스크롤 영역 선택자

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

  //스크롤 셋팅
  const settingScroll = type => {
    if (type == 'addComment') {
      //채팅이 입력되었을시 스크롤을 최하단으로 옮기기
      chatArea.current.scrollTop = chatArea.current.offsetHeight
      setCheckMove(false)
    } else if (type == 'move') {
      setCheckMove(true)
    }
  }

  //채팅창 마우스 휠 작동시
  const handleOnWheel = () => {
    settingScroll('move')
  }

  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {}, [])

  useEffect(() => {
    if (!(chatArea.current.scrollHeight == chatArea.current.offsetHeight)) {
      if (!isOverHeight) {
        //처음에 바텀 찍은 후의 로직
        if (!checkMove) {
          // 스크롤 움직이지 않았을때만 스크롤 바텀 유지
          settingScroll('addComment')
        }
      } else {
        //스크롤 생긴 후 처음 바텀 찍기
        settingScroll('addComment')
        setIsOverHeight(true) // 스크롤 생김
      }
    } else {
      settingScroll('addComment')
      setIsOverHeight(false) // 스크롤 없음
    }
  }, [comments])

  //---------------------------------------------------------------------
  return (
    <Content bgImg="">
      <InfoArea>정보 담는 영역</InfoArea>
      <CommentList className="scroll" ref={chatArea} onWheel={handleOnWheel}>
        {comments}
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
  overflow-y: scroll;
  position: absolute;
  bottom: 66px;
  max-height: calc(100% - 146px);
  width: 100%;
  padding: 20px;
`

const Message = styled.div`
  border: 1px solid #000;

  & + & {
    margin-top: 20px;
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
