/**
 * @title 채팅 ui 컴포넌트
 */
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
const sc = require('context/socketCluster')
export default props => {
  //context
  const context = new useContext(Context)
  //state
  const [isSideOn, setIsSideOn] = useState(true)
  const [comments, setComments] = useState([])
  const [roomInfo, setRoomInfo] = useState([])
  let test = React.createRef()

  //comment Key Press
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
      console.log('메세지 날려라')
      setRoomInfo({
        ...props.location.state,
        msg: e.target.value
      })
      // objSendInfo.roomNo = props.location.state.roomNo
      // objSendInfo.message = e.target.value

      //sc.SendMessageChat(props)
      e.target.value = ''
      // console.log(test)
      test.current.scrollTop = test.current.offsetHeight
    }
  }
  useEffect(() => {
    console.log(roomInfo)
    console.log('현재 얘가 영역임', test)
    sc.SendMessageChat(roomInfo)
  }, [roomInfo])
  //tab
  return (
    <Content bgImg="">
      <InfoArea>정보 담는 영역</InfoArea>
      <CommentList className="scroll" ref={test}>
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
