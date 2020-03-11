/**
 * @title 탭 guest
 */
import React, {useState, useEffect, useContext, useRef} from 'react'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import styled from 'styled-components'
import {Context} from 'context'
import API from 'context/api'
//components----------------------------------------------------
import RequestEvent from './guest-request-event'
import {Scrollbars} from 'react-custom-scrollbars'
import {BroadCastStore} from '../../store'
import EventBtnRequest from './guest-btn-request'
import EventBtnInvite from './guest-btn-invite'
export default props => {
  //context------------------------------------------------------------
  const context = useContext(Context)
  //------------------------------------------------------------------
  //0.게스트정보..배열 호출 state-------------------------------------
  //1.초대정보..배열 호출 state-------------------------------------
  //2.신청정보..배열 호출 state-------------------------------------
  //3.버튼 visibility 체크----------------------------------------현재 가데이터입니다 STORE에 저장해두셧으니 게스트는 붙이실떄 임포트하시면됩니다.
  const [GuestInfo, setGuestInfo] = useState(props.Info3)
  const [InviteInfo, setInviteInfo] = useState(props.Info)
  const [RequestInfo, setRequestInfo] = useState(props.Info2)
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
  // 마우스 스크롤
  const settingArea = useRef(null) //세팅 스크롤 영역 선택자
  const scrollbars = useRef(null) // 스크롤 영역 선택자
  const [checkMove, setCheckMove] = useState(false)
  const handleOnWheel = () => {
    setCheckMove(true)
  }
  const scrollOnUpdate = e => {
    //스크롤영역 height 고정해주기, 윈도우 리사이즈시에도 동작
    settingArea.current.children[0].children[0].style.maxHeight = `calc(${settingArea.current.offsetHeight}px + 17px)`
  }
  //초대맵----------------------------------------------
  const InviteMap = InviteInfo.map((live, index) => {
    const {bjNickNm, bjMemNo, url} = live

    //-------------------------------------------------------
    return (
      <InviteList key={index}>
        <ImgArea bg={url} />
        <StreamID>{bjMemNo}</StreamID>
        <NickName>{bjNickNm}</NickName>
        <div className="btnwrap">
          <EventBtnInvite />
        </div>
      </InviteList>
    )
  })
  //요청맵----------------------------------------------
  const RequestMap = RequestInfo.map((live, index) => {
    const {bjNickNm, bjMemNo, url} = live
    //클릭 이벤트
    //-------------------------------------------------------
    return (
      <RequestList key={index}>
        <ImgArea bg={url} />
        <StreamID>{bjMemNo}</StreamID>
        <NickName>{bjNickNm}</NickName>
        <div className="btnwrap">
          <EventBtnRequest />
        </div>
      </RequestList>
    )
  })
  //render-------------------------------------------------------
  return (
    <>
      <Wrapper onWheel={handleOnWheel} ref={settingArea}>
        <Scrollbars ref={scrollbars} autoHeight autoHeightMax={'100%'} onUpdate={scrollOnUpdate} autoHide className="scrollCustom">
          <GuestWrap>
            <Title>방송 참여 중 게스트</Title>
            <DJList>
              <ImgArea bg={GuestInfo.url} />
              <h5>{GuestInfo.bjNickNm}</h5>
              <CancelEventGuest value={BTNcheck} onClick={ToggleGuest}></CancelEventGuest>
              {/* {BTNcheck && <CancelEvent onClick={AllFalse} value={GuestInfo.bjNickNm} />}
              임시로 백그라운트 클릭이나 소규모 팝업생성했었는데 컨텍스트 레이어팝업 확정된거같아 이벤트 뺴놓습니다
              (이벤트 주는 구조정도 참고 하시면 될거같습니다.)
              <BackGround onClick={AllFalse} className={BTNcheck === true ? 'on' : ''} /> */}
            </DJList>
          </GuestWrap>
          <GuestWrap>
            <Title>초대한 게스트</Title>
            {InviteMap}
          </GuestWrap>
          <GuestWrap>
            <Title>게스트 요청 청취자</Title>
            <ListenWrap>{RequestMap}</ListenWrap>
          </GuestWrap>
        </Scrollbars>
      </Wrapper>
    </>
  )
}
//-----------------------------------style
const Wrapper = styled.div`
  margin-top: 20px;
  height: calc(100% - 60px);
  & .scrollCustom {
    & > div:nth-child(3) {
      width: 10px !important;
    }
  }
`
const GuestWrap = styled.div`
  margin-bottom: 20px;
  & .btnwrap {
    position: absolute;
    right: 0;
    width: 36px;
    height: 36px;
  }
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
    line-height: 40px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
  }
  & h5 {
    height: 36px;
    margin-left: 12px;
    color: #fff;
    line-height: 40px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
  }
`
const InviteList = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  padding: 4px;
  margin-top: 4px;
  border: 1px solid #8555f6;
  border-radius: 24px;
`
const ImgArea = styled.div`
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
  & > div:nth-last-child(-n + 4) {
    div {
      bottom: 0;
    }
  }
`
const RequestList = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  padding: 4px;
  margin-top: 4px;
  border: 1px solid #f5f5f5;
  border-radius: 24px;
  background-color: #fff;
`

const CancelEventGuest = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  width: 18px;
  height: 18px;
  transform: translateY(-50%);
  background: url(${IMG_SERVER}/images/api/ic_close_round2.png) no-repeat center center / cover;
  outline: none;
`
