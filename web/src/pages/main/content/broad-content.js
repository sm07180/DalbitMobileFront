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
  const [BroadContentInfo, setBroadContentInfo] = useState(props.BroadInfo)
  //---------------------------------------------------------------------
  //---------------------------------------------------------------------
  const arrayBroad = BroadContentInfo.map((item, index) => {
    // console.log(item)
    const {id, title, url, people, like, category, popu, avata, name} = item

    return (
      //////
      <BroadWrap key={id} {...item}>
        <ImgWrap bg={url}></ImgWrap>
        <Avata bg={avata}></Avata>
        <InfoWrap>
          <Category>{category}</Category>
          <Title>{title}</Title>
          <BjName>{name}</BjName>
        </InfoWrap>
        <People>
          <Viewer></Viewer>
          <span>{people}</span>
          <Lover></Lover>
          <span>{like}</span>
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
  width: calc(100% * (1 / 8) - 2.27%);
  margin: 0 0 0 2.27%;
  min-height: 360px;
  position: relative;
  @media (max-width: ${WIDTH_PC_S}) {
    width: calc(100% * (1 / 6) - 2.27%);
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: calc(100% * (1 / 4) - 2.27%);
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    margin: 0 0 0 2.22%;
    width: calc(100% * (1 / 2) - 2.22%);
    min-height: 342px;
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
  border-radius: 50%;
  width: 64px;
  height: 64px;
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
  margin: 18px 0 18px 0;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.86;
  letter-spacing: -0.35px;
  text-align: left;
  color: #bdbdbd;
  transform: skew(-0.03deg);
`

const Title = styled.h2`
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: -0.4px;
  text-align: left;
  color: #424242;
  transform: skew(-0.03deg);
`
const BjName = styled.h4`
  margin-top: 10px;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: -0.35px;
  text-align: left;
  color: #8556f6;
  transform: skew(-0.03deg);
`
const People = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  bottom: 24px;
  height: 24px;
  &:after {
    content: '';
    clear: both;
    display: block;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
  }
  & span {
    font-size: 14px;
    padding-left: 6px;
    box-sizing: border-box;
    margin-right: 14px;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: -0.35px;
    text-align: left;
    color: #9e9e9e;
    transform: skew(-0.03deg);
    float: left;
    height: 24px;
    line-height: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
  background: url('http://www.hwangsh.com/img/hit-g-s.png') no-repeat center center / cover;
`
const Lover = styled.div`
  float: left;
  height: 24px;
  width: 24px;
  background: url('http://www.hwangsh.com/img/ico-like-g-s.png') no-repeat center center / cover;
`
