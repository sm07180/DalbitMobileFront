/**
 * @title
 */
import React, {useState} from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE} from 'context/config'
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
        </InfoWrap>
      </LiveBigWrap>
    </>
  )
}
//---------------------------------------------------------------------
//큰거는 809 42.13% 1920기준의
//714
const LiveBigWrap = styled.div`
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
  @media (max-width: ${WIDTH_TABLET}) {
    height: 168px;
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
  height: 35.71%;
  right: 0;
  bottom: 0;
  width: 35.71%;
  background: url(${props => props.bg}) no-repeat center center / cover;
`
const InfoWrap = styled.div`
  width: 52.94%;
  float: left;
  background-color: #f5f5f5;
  height: 100%;
  padding: 7.97% 8.56% 0 8.75%;
  box-sizing: border-box;
`
const InfoTitle = styled.h2`
  font-size: 24px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.42;
  letter-spacing: -0.6px;
  text-align: center;
  color: #8556f6;
  margin-bottom: 18px;
  @media (max-width: ${WIDTH_PC_S}) {
    font-size: 20px;
  }
  @media (max-width: ${WIDTH_TABLET}) {
    font-size: 16px;
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
  }
`
