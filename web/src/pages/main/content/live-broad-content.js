/**
 * @title
 */
import React, {useState} from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE} from 'context/config'
import {WIDTH_TABLET_S} from 'context/config'
import {WIDTH_PC} from 'context/config'
import {WIDTH_PC_S} from 'context/config'

export default props => {
  const [BroadContentInfo, setBroadContentInfo] = useState(props.info)
  //---------------------------------------------------------------------
  const roomTypes = {
    '00': '일상/챗',
    '01': '연애/오락',
    '02': '노래/연주',
    '03': '고민/사연',
    '04': '책/힐링',
    '05': '스포츠',
    '06': 'ASMR',
    '07': '노래방',
    '08': '건강',
    '09': '공포',
    '10': '먹방',
    '11': '성우',
    '12': '요리',
    '99': '기타'
  }
  //---------------------------------------------------------------------
  const arrayBroad = BroadContentInfo.map((item, index) => {
    // console.log(item)
    const {roomNo, bjProfImg, roomType, title, bjNickNm, entryCnt, likeCnt} = item

    return (
      //////
      <BroadWrap
        key={index}
        {...item}
        onClick={() => {
          props.joinRoom({roomNo: roomNo})
        }}>
        <ImgWrap bg={bjProfImg.url}></ImgWrap>
        {/* <Avata bg={avata}></Avata> */}
        <InfoWrap>
          <Category>{roomTypes[roomType]}</Category>
          <Title>{title}</Title>
          <BjName>{bjNickNm}</BjName>
        </InfoWrap>
        <People>
          <Viewer></Viewer>
          <span>{entryCnt}</span>
          <Lover></Lover>
          <span>{likeCnt}</span>
        </People>
      </BroadWrap>
    )
  })
  return (
    <>
      <Flex>
        <div>{arrayBroad}</div>
      </Flex>
    </>
  )
}
const Flex = styled.div`
  width: 100%;
  & > div {
    display: flex;
    flex-wrap: wrap;
    margin: 0 0 0 -2.27%;
    @media (max-width: ${WIDTH_PC_S}) {
    }
    @media (max-width: ${WIDTH_TABLET_S}) {
    }
    @media (max-width: ${WIDTH_MOBILE}) {
      margin: 0 0 0 -2.22%;
    }
  }
`
const BroadWrap = styled.div`
  display: inline-block;
  position: relative;
  width: calc(100% * (1 / 8) - 2.27%);
  min-height: 360px;
  margin: 0 0 0 2.27%;
  cursor: pointer;
  @media (max-width: ${WIDTH_PC_S}) {
    width: calc(100% * (1 / 6) - 2.27%);
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: calc(100% * (1 / 4) - 2.27%);
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    width: calc(100% * (1 / 2) - 2.22%);
    min-height: 342px;
    margin: 0 0 0 2.22%;
  }
`

const ImgWrap = styled.div`
  width: 100%;
  height: 150px;
  background: url(${props => props.bg}) no-repeat center center / cover;
`
const Avata = styled.div`
  position: absolute;
  top: 31.94%;
  right: 0px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: url(${props => props.bg}) no-repeat center center / cover;
  @media (max-width: ${WIDTH_MOBILE}) {
  }
`
const InfoWrap = styled.div`
  width: 100%;
  height: 210px;
  padding-right: 11px;
  box-sizing: border-box;
`
const Category = styled.span`
  display: block;
  margin: 20px 0 18px 0;
  color: #bdbdbd;
  font-size: 14px;
  text-align: left;
  line-height: 1.86;
  letter-spacing: -0.35px;
  transform: skew(-0.03deg);
`
const Title = styled.h2`
  color: #424242;
  font-size: 16px;
  text-align: left;
  line-height: 1.5;
  letter-spacing: -0.4px;
  transform: skew(-0.03deg);
`
const BjName = styled.h4`
  margin-top: 10px;
  color: #8556f6;
  font-size: 14px;
  text-align: left;
  line-height: 1.43;
  letter-spacing: -0.35px;
  transform: skew(-0.03deg);
`
const People = styled.div`
  position: absolute;
  bottom: 30px;
  left: 0;
  width: 100%;
  height: 24px;
  &:after {
    display: block;
    clear: both;
    content: '';
  }
  @media (max-width: ${WIDTH_MOBILE}) {
  }
  & span {
    float: left;
    overflow: hidden;
    height: 24px;
    padding-left: 6px;
    margin-right: 14px;
    box-sizing: border-box;
    color: #9e9e9e;
    font-size: 14px;
    letter-spacing: -0.35px;
    text-align: left;
    line-height: 2;
    text-overflow: ellipsis;
    white-space: nowrap;
    transform: skew(-0.03deg);
    @media (max-width: ${WIDTH_MOBILE}) {
      padding-left: 6px;
      margin-right: 11px;
    }
  }
  & span:last-child {
    margin-right: 0;
  }
`
const Viewer = styled.div`
  float: left;
  height: 24px;
  width: 24px;
  background: url('https://devimage.dalbitcast.com/images/api/hit-g-s.png') no-repeat center center / cover;
`
const Lover = styled.div`
  float: left;
  height: 24px;
  width: 24px;
  background: url('https://devimage.dalbitcast.com/images/api/ico-like-g-s.png') no-repeat center center / cover;
`
