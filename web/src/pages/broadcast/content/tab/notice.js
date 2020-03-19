import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import {COLOR_MAIN} from 'context/color'
import Navi from './navibar'
import Api from 'context/api'
import {Context} from 'context'
import useChange from 'components/hooks/useChange'
import {BroadCastStore} from 'pages/broadcast/store'

export default props => {
  //context------------------------------------------------------------
  const context = useContext(Context)
  const store = useContext(BroadCastStore)
  const {changes, setChanges, onChange} = useChange(update, {
    onChange: -1,
    notice: ''
  })
  const [roomInfo, setRoomInfo] = useState({...props.location.state})
  const [show, setShow] = useState(false)
  //const [showRegist, setShowRegist] = useState(true)

  const RoomNumbers = roomInfo.roomNo
  //update
  function update(mode) {
    switch (true) {
      case mode.onChange !== undefined:
        //console.log(JSON.stringify(changes))
        break
    }
  }
  //useState
  const [fetch, setFetch] = useState(null)
  //---------------------------------------------------------------------
  //fetch

  async function NoticeChange(idx) {
    //idx (1- 등록 , 2- 수정 , 3-삭제)
    let methodType
    let res

    methodType = idx === 3 ? 'DELETE' : 'POST'

    if (idx === 1 || idx === 2) {
      //등록(1), 수정(2)
      res = await Api.broad_notice({
        data: {
          roomNo: RoomNumbers,
          notice: changes.notice
        },
        method: 'POST'
      })
    } else if (idx === 3) {
      // 삭제(3)
      res = await Api.broad_notice({
        data: {
          roomNo: RoomNumbers
        },
        method: methodType
      })
    }

    if (res.result === 'success') {
      // setFetch(res.data)
      if (idx == 1 || idx == 2) {
        setShow(true)
        store.action.updateNoticeMsg(changes.notice)
        context.action.alert({
          //콜백처리
          Callback: () => {},
          msg: '공지사항이 등록되었습니다.'
        })
      } else if (idx == 3) {
        setShow(false)
        store.action.updateNoticeMsg(changes.notice)
        setTyping('')
        context.action.alert({
          //콜백처리
          Callback: () => {},
          msg: '공지사항이 삭제되었습니다.'
        })
      }
    } else {
      //Error발생시
    }
  }

  //0.공지사항등록 체인지 글자 스테이트-----------------------------------
  const [count, setCount] = useState(store.noticeMsg.length)
  const [typing, setTyping] = useState(store.noticeMsg)
  //텍스트아리아 벨리데이션function
  const handleChangeNotice = event => {
    const {value} = event.target
    const element = event.target
    setTyping(value)
    setChanges({...changes, notice: value})
    if (value.length > 100) {
      return
    }
    setCount(element.value.length)
  }
  //리스너뷰
  const listenerNotice = () => {
    if (context.broadcastTotalInfo.auth !== 3 && context.broadcastTotalInfo.hasNotice === false) {
      return (
        <div className="noresultWrap">
          <img src={`${IMG_SERVER}/images/api/img_noresult.png`}></img>
          <p>등록된 공지사항이 없습니다.</p>
        </div>
      )
    } else if (context.broadcastTotalInfo.auth !== 3 && context.broadcastTotalInfo.hasNotice === true) {
      return <div className="noticeInput">{store.noticeMsg}</div>
    }
  }
  //버튼
  const buttonfunc = () => {
    if (show === false && context.broadcastTotalInfo.auth == 3 && store.noticeMsg === '') return <RegistBTN onClick={() => NoticeChange(1)}>등록하기</RegistBTN>
    if (show === false && context.broadcastTotalInfo.auth == 3 && store.noticeMsg !== '')
      return (
        <div className="modifyWrap">
          <DeleteBTN onClick={() => NoticeChange(3)}>삭제하기</DeleteBTN>
          <ModifyBTN onClick={() => NoticeChange(2)}>수정하기</ModifyBTN>
        </div>
      )
    if (show === true && context.broadcastTotalInfo.auth == 3)
      return (
        <div className="modifyWrap">
          <DeleteBTN onClick={() => NoticeChange(3)}>삭제하기</DeleteBTN>
          <ModifyBTN onClick={() => NoticeChange(2)}>수정하기</ModifyBTN>
        </div>
      )
  }
  //텍스트아리아
  const textareafunc = () => {
    if ((context.broadcastTotalInfo.auth == 3 && context.broadcastTotalInfo.hasNotice === false) || (context.broadcastTotalInfo.auth == 3 && context.broadcastTotalInfo.hasNotice === true))
      return (
        <div className="noticeInput">
          <textarea onChange={handleChangeNotice} maxLength="100" placeholder="최대 100자 이내로 작성해주세요." value={typing}>
            {/* {NoticeData.notice} */}
          </textarea>
          <Counter>{count} / 100</Counter>
        </div>
      )
  }

  ///////////////////////////////////////////////////////////////////////////////////
  //--------------------------------------------------------------------
  return (
    <Container>
      <Navi title={'공지사항'} prev={props.prev} _changeItem={props._changeItem} />
      {context.broadcastTotalInfo.auth == 3 ? <h5>* 현재 방송방에서 공지할 내용을 입력하세요.</h5> : <h5>* 현재 방송방의 공지 사항 입니다.</h5>}
      {textareafunc()}
      {listenerNotice()}
      {context.broadcastTotalInfo.auth == 3 && <h4>방송 중 공지는 가장 최근 작성한 공지만 노출됩니다.</h4>}
      {buttonfunc()}
    </Container>
  )
}
//----------------------------------------
//styled
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #fff;
  /* align-items: center; */
  flex-direction: column;
  flex-wrap: wrap;
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 360px;
  }
  & h5 {
    margin: 20px 0 16px 0;
    color: #616161;
    font-size: 14px;
    font-weight: normal;
    letter-spacing: -0.35px;
    text-align: center;
    transform: skew(-0.03deg);
  }
  & .noticeInput {
    position: relative;
    width: 100%;
    min-height: 180px;
    padding: 20px;
    box-sizing: border-box;
    background-color: #f5f5f5;
    border-radius: 10px;
    & textarea {
      display: block;
      border: none;
      appearance: none;
      width: 100%;
      min-height: 140px;
      background-color: #f5f5f5;
      font-family: NanumSquare;
      color: #424242;
      font-size: 16px;
      transform: skew(-0.03deg);
      resize: none;
      outline: none;
    }
  }
  & h4 {
    margin: 12px 0;
    color: #bdbdbd;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.14;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
  }
  & .modifyWrap {
  }
  & .noresultWrap {
    text-align: center;
    transform: skew(-0.03deg);
    color: #616161;
  }
`
const Counter = styled.span`
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: block;
  color: #bdbdbd;
  font-size: 12px;
  line-height: 1.5;
  letter-spacing: -0.3px;
  transform: skew(-0.03deg);
`
const RegistBTN = styled.button`
  width: 100%;
  padding: 15px 0;
  border-radius: 10px;
  background-color: ${COLOR_MAIN};
  color: #fff;
  font-size: 16px;
  letter-spacing: -0.4px;
  transform: skew(-0.03deg);
`
const DeleteBTN = styled.button`
  width: calc(50% - 4px);
  padding: 15px 0;
  margin-right: 8px;
  border-radius: 10px;
  background-color: #fff;
  color: ${COLOR_MAIN};
  font-size: 16px;
  letter-spacing: -0.4px;
  border: 1px solid ${COLOR_MAIN};

  transform: skew(-0.03deg);
`
const ModifyBTN = styled.button`
  width: calc(50% - 4px);
  padding: 15px 0;
  border-radius: 10px;
  background-color: ${COLOR_MAIN};
  border: 1px solid ${COLOR_MAIN};
  color: #fff;
  font-size: 16px;
  letter-spacing: -0.4px;
  transform: skew(-0.03deg);
`
