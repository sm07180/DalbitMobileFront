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
  const [BroadContentInfo, setBroadContentInfo] = useState(props.BroadInfo)
  //---------------------------------------------------------------------
  //---------------------------------------------------------------------
  const arrayBroad = BroadContentInfo.map((item, index) => {
    // console.log(item)
    const {id, title, url, margin, reco, category, popu, avata, name} = item

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
  }
`
const BroadWrap = styled.div`
  display: inline-block;
  width: calc(100% * (1 / 8) - 2.27%);
  margin: 0 0 0 2.27%;
  height: 360px;
  position: relative;

  @media (max-width: ${WIDTH_PC_S}) {
  }
  @media (max-width: ${WIDTH_TABLET}) {
    width: calc(100% * (1 / 4) - 2.27%);
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    width: calc(100% * (1 / 2) - 2.27%);
    height: 324px;
    margin-bottom: 32px;
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
  left: 58.66%;
  border-radius: 50%;
  width: 41.33%;
  height: 17.22%;
  background: url(${props => props.bg}) no-repeat center center / cover;
  @media (max-width: ${WIDTH_MOBILE}) {
    left: 66%;
    width: 34%;
    height: 19.75%;
  }
`
const InfoWrap = styled.div`
  width: 100%;
  height: 210px;
  padding-right: 11px;
  box-sizing: border-box;
`
const Category = styled.span`
  margin: 14px 0 20px 0;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.86;
  letter-spacing: -0.35px;
  text-align: left;
  color: #bdbdbd;
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
`
