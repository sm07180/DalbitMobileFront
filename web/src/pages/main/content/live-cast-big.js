/**
 * @title
 */
import React, {useState} from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE, WIDTH_TABLET_S} from 'context/config'
import {WIDTH_TABLET} from 'context/config'
import {WIDTH_PC} from 'context/config'
import {WIDTH_PC_S} from 'context/config'

export default props => {
  const [LiveBigInfo, setLiveBigInfo] = useState(props.ImgInfo[0])
  //---------------------------------------------------------------------
  // console.log(item)
  console.log(LiveBigInfo.url)
  //---------------------------------------------------------------------
  return (
    <>
      <LiveBigWrap>
        <ImgWrap bg={LiveBigInfo.url}>
          <Avata bg={LiveBigInfo.avata}></Avata>
        </ImgWrap>
        <InfoWrap>
          <InfoTitle>{LiveBigInfo.title}</InfoTitle>
          <BjName>{LiveBigInfo.name}</BjName>
          <People>
            <Viewer></Viewer>
            <Lover></Lover>
            <span>{LiveBigInfo.people}</span>
            <span>{LiveBigInfo.like}</span>
          </People>
        </InfoWrap>
      </LiveBigWrap>
    </>
  )
}
//---------------------------------------------------------------------
//큰거는 809 42.13% 1920기준의
//714
const LiveBigWrap = styled.div`
  width: calc(50% - 21.5px);
  float: left;
  margin-right: 43px;
  margin-bottom: 60px;
  height: 336px;

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
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 100%;
    height: 160px;
    margin-bottom: 36px;
  }
`
const ImgWrap = styled.div`
  width: 47.05%;
  height: 100%;
  float: left;
  background: url(${props => props.bg}) no-repeat center center / cover;
  position: relative;
`
const Avata = styled.div`
  position: absolute;
  height: 120px;
  right: 0;
  bottom: 0;
  width: 120px;
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
  width: 52.94%;
  float: left;
  background-color: #f5f5f5;
  height: 100%;
  padding: 10.95% 10% 0 10%;
  box-sizing: border-box;
  position: relative;
  @media (max-width: ${WIDTH_PC_S}) {
    padding: 11.2% 9.54% 0 9.54%;
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    padding: 6.06% 5.35% 0 5.35%;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    padding: 6.06% 4.87% 0 4.87%;
  }
`
const InfoTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.32;
  letter-spacing: -0.6px;
  text-align: center;
  color: #8556f6;
  margin-bottom: 18px;
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media (max-width: ${WIDTH_PC_S}) {
    font-size: 20px;
    letter-spacing: -0.5px;
    line-height: 1.4;
    margin-bottom: 15px;
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    font-size: 16px;
    line-height: 1.5;
    letter-spacing: -0.4px;
    margin-bottom: 12px;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    margin-bottom: 8px;
  }
`
const BjName = styled.h4`
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: -0.5px;
  text-align: center;
  color: #757575;
  @media (max-width: ${WIDTH_PC_S}) {
    font-size: 18px;
    line-height: 1.11;
    letter-spacing: -0.45px;
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    font-size: 14px;
    line-height: 1.71;
    letter-spacing: -0.35px;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    line-height: 1.43;
  }
`
const People = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 124.8px;
  bottom: 58px;
  height: auto;
  @media (max-width: ${WIDTH_PC_S}) {
    bottom: 36px;
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 80px;
    bottom: 16px;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    bottom: 18px;
  }
  &:after {
    content: '';
    clear: both;
    display: block;
  }

  & span {
    float: left;
    width: 48px;
    height: 18px;
    text-align: center;
    margin-right: 28.8px;
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.63;
    letter-spacing: -0.4px;
    color: #8556f6;
    transform: skew(-0.03deg);
    @media (max-width: ${WIDTH_MOBILE}) {
    }
    @media (max-width: ${WIDTH_TABLET_S}) {
      width: 24px;
      font-size: 12px;
      height: 16px;
      margin-right: 32px;
      text-align: left;
    }
  }

  & span:last-child {
    margin-right: 0;
  }
`
const Viewer = styled.div`
  float: left;
  height: 48px;
  width: 48px;
  background: url('http://www.hwangsh.com/img/ico-hit-w-l.png') no-repeat center center / cover;
  margin-right: 28.8px;
  position: relative;
  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 18px;
    left: 62.4px;
    width: 1px;
    height: 30px;
    background-color: lightgray;
    @media (max-width: ${WIDTH_TABLET_S}) {
      display: none;
    }
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    height: 24px;
    width: 24px;
    margin-right: 32px;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    height: 24px;
    width: 24px;
  }
`
const Lover = styled.div`
  float: left;
  height: 48px;
  width: 48px;
  background: url('http://www.hwangsh.com/img/ico-like-p-l.png') no-repeat center center / cover;
  @media (max-width: ${WIDTH_TABLET_S}) {
    height: 24px;
    width: 24px;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    height: 24px;
    width: 24px;
  }
`
