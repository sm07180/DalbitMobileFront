/**
 * @title
 */
import React, {useState} from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE} from 'Context/config'
import {WIDTH_TABLET} from 'Context/config'
import {WIDTH_PC} from 'Context/config'
import {WIDTH_PC2} from 'Context/config'

export default props => {
  const [BroadContentInfo, setBroadContentInfo] = useState(props.BroadInfo)
  //---------------------------------------------------------------------
  //---------------------------------------------------------------------
  const arrayBroad = BroadContentInfo.map((item, index) => {
    // console.log(item)
    const {id, title, url, margin, reco, category, popu, avata, name} = item

    return (
      //////
      <BroadWrap key={id} {...item} marginR={margin}>
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
  return <>{arrayBroad}</>
}
const BroadWrap = styled.div`
  float: left;
  width: 20.78%;
  height: 360px;
  position: relative;
  margin-right: 40px;
  &:nth-child(4n-1) {
    margin-right: 0;
  }
  @media (max-width: ${WIDTH_PC2}) {
    width: 25%;
    &:nth-child(4n-1) {
      margin-right: 40px;
    }
    &:nth-child(3n) {
      margin-right: 0;
    }
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
