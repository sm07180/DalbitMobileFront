/**
 * @title
 */
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
//pages

export default props => {
  const [ManegerInfo, setManegerInfo] = useState(props.Info)
  const [ListenInfo, setListenInfo] = useState(props.Info2)
  const [BJInfo, setBJInfo] = useState(props.Info3)
  //
  const Manegermap = ManegerInfo.map((live, index) => {
    const {bjNickNm, bjMemNo, url} = live
    return (
      <ManegerList key={index}>
        <ManegerImg bg={url} />
        <StreamID>{bjMemNo}</StreamID>
        <NickName>{bjNickNm}</NickName>
      </ManegerList>
    )
  })
  const Listenmap = ListenInfo.map((live, index) => {
    const {bjNickNm, bjMemNo, url} = live
    return (
      <ListenList key={index}>
        <ManegerImg bg={url} />
        <StreamID>{bjMemNo}</StreamID>
        <NickName>{bjNickNm}</NickName>
      </ListenList>
    )
  })
  return (
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
  )
}
const Wrapper = styled.div`
  margin-top: 20px;
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
  width: 100%;
  display: flex;
  padding: 4px;
  margin-top: 4px;
  border: 1px solid #f5f5f5;
  border-radius: 24px;
`
const DJList = styled.div`
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
`
