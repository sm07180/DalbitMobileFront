/**
 * @title 탭 guest
 */
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {Context} from 'context'
import Api from 'context/api'
//components----------------------------------------------------
import CancelEvent from './guest-cancel-event'
import RequestEvent from './guest-request-event'
export default props => {
  //context------------------------------------------------------------
  const context = useContext(Context)
  //------------------------------------------------------------------
  //0.매니저정보..배열 호출 state-------------------------------------
  //1.청취자정보..배열 호출 state-------------------------------------
  //2.게스트정보..배열 호출 state-------------------------------------
  //3.버튼 visibility 체크----------------------------------------
  const [ManegerInfo, setManegerInfo] = useState(props.Info)
  const [ListenInfo, setListenInfo] = useState(props.Info2)
  const [GuestInfo, setGuestInfo] = useState(props.Info3)
  const [BTNcheck, setBTNcheck] = useState(false)
  //visibility btn function----------------------------------------------
  const ToggleGuest = () => {
    if (BTNcheck === false) {
      setBTNcheck(true)
    } else {
      setBTNcheck(false)
    }
  }
  //visibility bg function----------------------------------------------
  const AllFalse = () => {
    setBTNcheck(false)
  }
  //매니저map----------------------------------------------
  const Manegermap = ManegerInfo.map((live, index) => {
    const {bjNickNm, bjMemNo, url} = live
    const [checkVisibility, SetcheckVisibility] = useState(false)
    //function
    const ToggleEvent = () => {
      if (checkVisibility === false) {
        SetcheckVisibility(true)
      } else {
        SetcheckVisibility(false)
      }
    }
    const AllFalse = () => {
      SetcheckVisibility(false)
    }
    //-------------------------------------------------------
    return (
      <ManegerList key={index}>
        <ManegerImg bg={url} />
        <StreamID>{bjMemNo}</StreamID>
        <NickName>{bjNickNm}</NickName>
        <CANCELBTN value={checkVisibility} onClick={ToggleEvent}></CANCELBTN>
        {checkVisibility && <CancelEvent value={bjNickNm} onClick={AllFalse} />}
        <BackGround onClick={AllFalse} className={checkVisibility === true ? 'on' : ''} />
      </ManegerList>
    )
  })
  //리스너map----------------------------------------------
  const Listenmap = ListenInfo.map((live, index) => {
    const {bjNickNm, bjMemNo, url} = live
    const [checkVisibility, SetcheckVisibility] = useState(false)
    //클릭 이벤트
    const ToggleEvent = () => {
      if (checkVisibility === false) {
        SetcheckVisibility(true)
      } else {
        SetcheckVisibility(false)
      }
    }
    const AllFalse = () => {
      SetcheckVisibility(false)
    }
    //-------------------------------------------------------
    return (
      <ListenList key={index}>
        <ManegerImg bg={url} />
        <StreamID>{bjMemNo}</StreamID>
        <NickName>{bjNickNm}</NickName>
        <EVENTBTN value={checkVisibility} onClick={ToggleEvent}></EVENTBTN>
        {checkVisibility && <RequestEvent />}
        <BackGround onClick={AllFalse} className={checkVisibility === true ? 'on' : ''} />
      </ListenList>
    )
  })
  //render-------------------------------------------------------
  return (
    <>
      <Wrapper>
        <LiveWrap>
          <Title>방송 참여 중 게스트</Title>
          <DJList>
            <ManegerImg bg={GuestInfo.url} />
            <h5>{GuestInfo.bjNickNm}</h5>
            <CancelEventGuest value={BTNcheck} onClick={ToggleGuest}></CancelEventGuest>
            {BTNcheck && <CancelEvent onClick={AllFalse} value={GuestInfo.bjNickNm} />}
            <BackGround onClick={AllFalse} className={BTNcheck === true ? 'on' : ''} />
          </DJList>
        </LiveWrap>
        <LiveWrap>
          <Title>초대한 게스트</Title>
          {Manegermap}
        </LiveWrap>
        <LiveWrap>
          <Title>게스트 요청 청취자</Title>
          <ListenWrap className="scrollbar">{Listenmap}</ListenWrap>
        </LiveWrap>
      </Wrapper>
    </>
  )
}
//-----------------------------------style
const Wrapper = styled.div`
  margin-top: 20px;
`
const LiveWrap = styled.div`
  margin-bottom: 20px;
`
const DJList = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  padding: 4px;
  margin-top: 4px;
  background-color: #8555f6;
  border-radius: 24px;
  & h2 {
    width: 53px;
    height: 36px;
    margin-left: 10px;
    color: #fff;
    line-height: 36px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
  }
  & h5 {
    height: 36px;
    margin-left: 12px;
    color: #fff;
    line-height: 36px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
  }
`
const ManegerList = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  padding: 4px;
  margin-top: 4px;
  border: 1px solid #8555f6;
  border-radius: 24px;
`
const ManegerImg = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: url(${props => props.bg}) no-repeat center center / cover;
`

const Title = styled.h4`
  display: inline-block;
  margin-bottom: 6px;
  color: #616161;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.14;
  letter-spacing: -0.35px;
  transform: skew(-0.03deg);
`
const StreamID = styled.h4`
  width: 53px;
  height: 36px;
  margin-left: 10px;
  color: #8555f6;
  line-height: 36px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.35px;
  transform: skew(-0.03deg);
`
const NickName = styled.h4`
  height: 36px;
  margin-left: 36px;
  color: #424242;
  line-height: 36px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.35px;
  transform: skew(-0.03deg);
`
const ListenWrap = styled.div`
  z-index: 4;
  overflow-y: scroll;
  max-height: 420px;
  overflow-x: hidden;
  & > div:nth-last-child(-n + 4) {
    div {
      bottom: 0;
    }
  }
`
const ListenList = styled.div`
  width: calc(100% + 10px);
  position: relative;
  display: flex;
  padding: 4px;
  margin-top: 4px;
  border: 1px solid #f5f5f5;
  border-radius: 24px;
  background-color: #fff;
`
//이벤트버튼
const EVENTBTN = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  width: 36px;
  height: 36px;
  transform: translateY(-50%);
  background: url('https://devimage.dalbitcast.com/images/api/ic_more.png') no-repeat center center / cover;
  outline: none;
`

const CANCELBTN = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  width: 18px;
  height: 18px;
  transform: translateY(-50%);
  background: url('https://devimage.dalbitcast.com/images/api/ic_close_round.png') no-repeat center center / cover;
  outline: none;
`
const CancelEventGuest = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  width: 18px;
  height: 18px;
  transform: translateY(-50%);
  background: url('https://devimage.dalbitcast.com/images/api/ic_close_round2.png') no-repeat center center / cover;
  outline: none;
`

//클릭 배경 가상요소
const BackGround = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  &.on {
    display: block;
    z-index: 2;
  }
`
