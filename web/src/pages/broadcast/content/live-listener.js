/**
 * @title
 */
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {Context} from 'context'
import Api from 'context/api'
import list from 'pages/live/content/list'
//pages

export default props => {
  const context = useContext(Context)
  //클릭 이벤트
  const [EventValue, SetValue] = useState(false)
  const ToggleEvent = () => {
    if (EventValue === false) {
      SetValue(true)
    } else {
      SetValue(false)
    }
  }
  const AllFalse = () => {
    SetValue(false)
  }
  const checkVisible = live => {
    live.visible = !live.visible
    console.log(live.visible)
  }
  //MAP 인포
  const [ManegerInfo, setManegerInfo] = useState(props.Info)
  const [ListenInfo, setListenInfo] = useState(props.Info2)
  const [BJInfo, setBJInfo] = useState(props.Info3)
  //-------------------
  const Manegermap = ManegerInfo.map((live, index) => {
    const {bjNickNm, bjMemNo, url} = live
    live.visible = false
    return (
      <ManegerList key={index}>
        <ManegerImg bg={url} />
        <StreamID>{bjMemNo}</StreamID>
        <NickName>{bjNickNm}</NickName>
        <button
          onClick={() => {
            checkVisible(live)
            //   ToggleEvent(index)
          }}>
          이벤트클릭
        </button>
        <Event value={EventValue} className={!EventValue ? 'on' : ''}>
          <ul>
            <li>강제퇴장</li>
            <li>매니저 등록</li>
            <li>게스트 초대</li>
            <li>프로필 보기</li>
            <li>신고하기</li>
          </ul>
        </Event>
      </ManegerList>
    )
  })
  const Listenmap = ListenInfo.map((live, index) => {
    const {bjNickNm, bjMemNo, url} = live
    return (
      <div key={index}>
        <ListenList>
          <ManegerImg bg={url} />
          <StreamID>{bjMemNo}</StreamID>
          <NickName>{bjNickNm}</NickName>
        </ListenList>
        <Event>
          <ul>
            <li>강제퇴장</li>
            <li>매니저 등록</li>
            <li>게스트 초대</li>
            <li>프로필 보기</li>
            <li>신고하기</li>
          </ul>
        </Event>
      </div>
    )
  })
  return (
    <>
      <Wrapper>
        <LiveWrap>
          <Title>방송 DJ</Title>
          <DJList>
            <ManegerImg bg={BJInfo.url} />
            <h2>{BJInfo.bjMemNo}</h2>
            <h5>{BJInfo.bjNickNm}</h5>
          </DJList>
        </LiveWrap>
        <LiveWrap>
          <Title>방송 매니저</Title>
          {Manegermap}
        </LiveWrap>
        <LiveWrap>
          <Title>청취자</Title>
          <ListenWrap className="scrollbar">{Listenmap}</ListenWrap>
        </LiveWrap>
      </Wrapper>
      <AFTER onClick={AllFalse} className={EventValue === true ? 'on' : ''} />
    </>
  )
}
const Wrapper = styled.div`
  margin-top: 20px;
`
const AFTER = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  &.on {
    z-index: 9999;
  }
`

const LiveWrap = styled.div`
  margin-bottom: 20px;
`

const ManegerList = styled.div`
  width: 100%;
  display: flex;
  padding: 4px;
  margin-top: 4px;
  border: 1px solid #8555f6;
  border-radius: 24px;
`
const ManegerImg = styled.div`
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
////////////////////////////
const ListenWrap = styled.div`
  margin-bottom: 20px;
  overflow-y: scroll;
  height: 500px;
`

const ListenList = styled.div`
  width: calc(100% + 10px);
  z-index: 1;
  position: relative;
  display: flex;
  padding: 4px;
  margin-top: 4px;
  border: 1px solid #f5f5f5;
  border-radius: 24px;
  background-color: #fff;
  &:hover {
    background-color: #fdad2b;
  }
  &:hover > h4 {
    color: #fff;
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
const Event = styled.div`
  position: absolute;
  right: 23px;
  width: 105px;
  padding: 13px 0;
  background-color: #fff;
  z-index: 9999;
  & ul {
    & li {
      padding: 7px 0;
      box-sizing: border-box;
      color: #757575;
      font-size: 14px;
      text-align: center;
      letter-spacing: -0.35px;
    }
  }
  &.on {
    display: none;
  }
`
