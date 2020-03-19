/**
 * @title
 */
import React, {useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

export default props => {
  //const [LiveBigInfo, setLiveBigInfo] = useState(props.ImgInfo[0])
  const {bjProfImg, roomNo, roomType, title, entryCnt, likeCnt, bjNickNm} = {...props.info}
  //---------------------------------------------------------------------
  // console.log(item)
  // console.log(LiveBigInfo.url)
  //---------------------------------------------------------------------
  return (
    <>
      {props.info && (
        <LiveBigWrap
          onClick={() => {
            props.joinRoom({roomNo: roomNo})
          }}>
          <ImgWrap bg={bjProfImg && bjProfImg.url}>{/* <Avata bg={LiveBigInfo.avata}></Avata> */}</ImgWrap>
          <InfoWrap>
            <InfoTitle>{title}</InfoTitle>
            <BjName>{bjNickNm}</BjName>
            <People>
              <Viewer></Viewer>
              <Lover></Lover>
              <span>{entryCnt}</span>
              <span>{likeCnt}</span>
            </People>
          </InfoWrap>
        </LiveBigWrap>
      )}
    </>
  )
}
//---------------------------------------------------------------------
//큰거는 809 42.13% 1920기준의 예??
//714
const LiveBigWrap = styled.div`
  float: left;
  width: calc(50% - 21.5px);
  height: 336px;
  margin-right: 43px;
  margin-bottom: 60px;
  cursor: pointer;
  &:after {
    content: '';
    clear: both;
    display: block;
  }
  @media (max-width: ${WIDTH_PC_S}) {
    height: 262px;
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    height: 168px;
    width: 100%;
    height: 180px;
    margin-bottom: 36px;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
  }
`
const ImgWrap = styled.div`
  position: relative;
  float: left;
  width: 47.05%;
  height: 100%;
  background: url(${props => props.bg}) no-repeat center center / cover;
`
const Avata = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 120px;
  height: 120px;
  background: url(${props => props.bg}) no-repeat center center / cover;
  @media (max-width: ${WIDTH_PC_S}) {
    width: 80px;
    height: 80px;
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 64px;
    height: 64px;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
  }
`
const InfoWrap = styled.div`
  position: relative;
  float: left;
  width: 52.94%;
  height: 100%;
  padding: 10.95% 10% 0 10%;
  box-sizing: border-box;
  background-color: #f5f5f5;
  @media (max-width: ${WIDTH_PC_S}) {
    padding: 11.2% 9.54% 20px 9.54%;
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    padding: 6.06% 5.35% 40px 5.35%;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    padding: 6.06% 4.87% 40px 4.87%;
  }
`
const InfoTitle = styled.h2`
  overflow: hidden;
  max-height: 60px;
  margin-bottom: 18px;
  color: #8556f6;
  font-size: 24px;
  text-align: center;
  font-weight: 700;
  line-height: 1.32;
  letter-spacing: -0.6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  word-wrap: break-word;
  @media (max-width: ${WIDTH_PC_S}) {
    margin-bottom: 15px;
    font-size: 20px;
    letter-spacing: -0.5px;
    line-height: 1.4;
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    margin-bottom: 12px;
    font-size: 16px;
    line-height: 1.5;
    letter-spacing: -0.4px;
    transform: skew(-0.03deg);
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    margin-bottom: 8px;
  }
`
const BjName = styled.h4`
  color: #757575;
  font-size: 20px;
  line-height: 1.5;
  letter-spacing: -0.5px;
  text-align: center;
  @media (max-width: ${WIDTH_PC_S}) {
    font-size: 18px;
    line-height: 1.11;
    letter-spacing: -0.45px;
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    font-size: 14px;
    line-height: 1.71;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    line-height: 1.43;
  }
`
const People = styled.div`
  position: absolute;
  left: 50%;
  bottom: 58px;
  width: 124.8px;
  height: auto;
  transform: translateX(-50%);

  @media (max-width: ${WIDTH_PC_S}) {
    bottom: 36px;
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    bottom: 16px;
    width: 80px;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    bottom: 18px;
  }
  &:after {
    display: block;
    clear: both;
    content: '';
  }

  & span {
    float: left;
    width: 48px;
    height: 18px;
    margin-right: 28.8px;
    color: #8556f6;
    font-size: 16px;
    text-align: center;
    font-weight: 700;
    line-height: 1.63;
    letter-spacing: -0.4px;
    transform: skew(-0.03deg);
    @media (max-width: ${WIDTH_MOBILE}) {
    }
    @media (max-width: ${WIDTH_TABLET_S}) {
      width: 24px;
      height: 16px;
      margin-right: 32px;
      font-size: 12px;
      text-align: left;
    }
  }

  & span:last-child {
    margin-right: 0;
  }
`
const Viewer = styled.div`
  position: relative;
  float: left;
  height: 48px;
  width: 48px;
  margin-right: 28.8px;
  background: url('${IMG_SERVER}/images/api/ico-hit-w-l.png') no-repeat center center / cover;
  &:after {
    display: block;
    position: absolute;
    top: 18px;
    left: 62.4px;
    width: 1px;
    height: 30px;
    background-color: lightgray;
    content: '';
    @media (max-width: ${WIDTH_TABLET_S}) {
      display: none;
    }
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 24px;
    height: 24px;
    margin-right: 32px;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 24px;
    height: 24px;
  }
`
const Lover = styled.div`
  float: left;
  width: 48px;
  height: 48px;
  background: url('${IMG_SERVER}/images/api/ico-like-p-l.png') no-repeat center center / cover;
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 24px;
    height: 24px;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 24px;
    height: 24px;
  }
`
