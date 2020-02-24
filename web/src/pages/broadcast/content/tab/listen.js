/**
 * @title 청취자
 */
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {Context} from 'context'
import API from 'context/api'
//components--------------------------------------------------
import Events from './listener-event'
export default props => {
  //context---------------------------------------------------------
  const context = useContext(Context)
  //----------------------------------------------------------------
  //0.매니저정보 info스테이트----------------------------------------
  //1.청취자정보 info스테이트----------------------------------------
  //2.비제이정보 info스테이트----------------------------------------
  const [ManagerInfo, setManagerInfo] = useState([])
  const [ListenInfo, setListenInfo] = useState(null)
  const [trues, setTrues] = useState(false)
  const [listenTrues, setListenTrues] = useState(false)

  const [BJInfo, setBJInfo] = useState(props.Info3)

  const fetchListenList = async () => {
    const {roomNo} = props.location.state
    const res = await API.broad_listeners({
      params: {roomNo}
    })
    if (res.result === 'success') {
      const {list} = res.data
      setListenInfo(list)
    }
    return
  }

  //메니저 info맵----------------------------------------------------
  const Managermap = ManagerInfo.map((live, index) => {
    const {bjNickNm, bjMemNo, url} = live

    //클릭visibility function
    const ToggleEvent = () => {
      if (trues === false) {
        setTrues(true)
      } else {
        setTrues(false)
      }
    }
    //클릭 bg visibility function
    const AllFalse = () => {
      setTrues(false)
    }
    //----------------------------------------------------------------
    return (
      <ManagerList key={index}>
        <ManagerImg bg={url} />
        <StreamID>{bjMemNo}</StreamID>
        <NickName>{bjNickNm}</NickName>
        <EVENTBTN value={trues} onClick={ToggleEvent}></EVENTBTN>
        {trues && <Events />}
        <BackGround onClick={AllFalse} className={trues === true ? 'on' : ''} />
      </ManagerList>
    )
  })
  //----------------------------------------------------------------

  const drawListenList = () => {
    if (ListenInfo === null) return
    return ListenInfo.map((live, index) => {
      const {nickNm, memNo, profImg} = live
      const {thumb62x62} = profImg

      //클릭 이벤트
      const ToggleEvent = () => {
        // if (listenTrues === false) {
        //   setListenTrues(true)
        // } else {
        //   setListenTrues(false)
        // }
      }
      const AllFalse = () => {
        // setListenTrues(false)
      }
      //----------------------------------------------------------------
      return (
        <ListenList key={index}>
          <ManagerImg bg={thumb62x62} />
          <StreamID>{memNo}</StreamID>
          <NickName>{nickNm}</NickName>
          <EVENTBTN value={listenTrues} onClick={ToggleEvent}></EVENTBTN>
          {listenTrues && <Events />}
          <BackGround onClick={AllFalse} className={listenTrues === true ? 'on' : ''} />
        </ListenList>
      )
    })
  }

  //render------------------------------------------------------------

  useEffect(() => {
    fetchListenList()
  }, [])

  return (
    <>
      <Wrapper>
        <LiveWrap>
          <Title>방송 DJ</Title>
          <DJList>
            <ManagerImg bg={BJInfo.url} />
            <h2>{BJInfo.bjMemNo}</h2>
            <h5>{BJInfo.bjNickNm}</h5>
          </DJList>
        </LiveWrap>
        <LiveWrap>
          <Title>방송 매니저</Title>
          {Managermap}
        </LiveWrap>
        <LiveWrap>
          <Title>청취자</Title>
          <ListenWrap className="scrollbar">{drawListenList()}</ListenWrap>
        </LiveWrap>
      </Wrapper>
    </>
  )
}
//----------------------------------------------------------------
//style
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
    margin-left: 36px;
    color: #fff;
    line-height: 36px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
  }
  &:after {
    display: block;
    position: absolute;
    top: 50%;
    right: 12px;
    width: 24px;
    height: 14px;
    border-radius: 7px;
    background-color: #fdad2b;
    color: #fff;
    font-size: 10px;
    font-weight: 600;
    text-align: center;
    line-height: 14px;
    transform: translateY(-50%);
    content: 'DJ';
  }
`

const ManagerList = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  padding: 4px;
  margin-top: 4px;
  border: 1px solid #8555f6;
  border-radius: 24px;
`
const ManagerImg = styled.div`
  width: 36px;
  height: 36px;
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
