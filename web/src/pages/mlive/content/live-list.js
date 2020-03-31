import React, {useMemo, useState, useContext, useRef, useEffect} from 'react'
import styled from 'styled-components'
//context
import {IMG_SERVER} from 'context/config'
// static image
import Listen from '../static/ic_headphones_s.svg'
import Like from '../static/ic_heart_s_g.svg'

export default props => {
  //------------------------------------------------------------ declare start
  const {data} = props
  const roomType = useMemo(() => {
    if (data.roomType === '') return '전체'
    if (data.roomType === '00') return '일상/챗'
    if (data.roomType === '01') return '노래/연주'
    if (data.roomType === '02') return '고민/사연'
    if (data.roomType === '03') return '연애/오락'
    if (data.roomType === '04') return '책/힐링'
    if (data.roomType === '05') return 'ASMR'
    if (data.roomType === '06') return '노래방'
    if (data.roomType === '07') return '성우'
    if (data.roomType === '08') return '스터디'
    if (data.roomType === '09') return '공포'
    if (data.roomType === '10') return '먹방/요리'
    if (data.roomType === '11') return '건강/스포츠'
    if (data.roomType === '99') return '전체'
    return '기타'
  }, [])
  //------------------------------------------------------------ components start
  return (
    <List
      onClick={() => {
        props.update({selectList: data})
      }}>
      <Profile url={data.bjProfImg.thumb120x120} />
      <Info>
        <h1>{data.title}</h1>
        <h2>{data.bjNickNm}</h2>
        <div className="ico_wrap">
          <span className="roomType">{roomType}</span>
          <i>
            <img className="icon" src={Listen} />
            <span>{data.entryCnt}</span>
          </i>
          <i>
            <img className="icon" src={Like} />
            <span>{data.likeCnt}</span>
          </i>
        </div>
      </Info>
    </List>
  )
}
//------------------------------------------------------------ components start
// 프로필
const Profile = styled.span`
  position: absolute;
  left: 0;
  display: inline-block;
  width: 72px;
  height: 72px;
  border-radius: 24px;
  font-family: sans-serif;
  background-color: #bdbdbd;
  background-image: url(${props => props.url});
  background-repeat: no-repeat;
  overflow: hidden;
`
//타이틀,등
const Info = styled.div`
  box-sizing: border-box;
  padding-left: 88px;
  > h1 {
    display: block;
    padding: 6px 0;
    letter-spacing: -0.35px;
    color: #424242;
    font-size: 14px;
    font-weight: bold;
  }
  > h2 {
    display: block;
    margin-bottom: 6px;
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    line-height: 1.08;
    letter-spacing: -0.3px;
    text-align: left;
    color: #757575;
  }
  .ico_wrap {
    > * {
      display: inline-block;
      vertical-align: middle;
    }
    i {
      img {
        width: 17px;
        height: 17px;
        vertical-align: bottom;
      }
      span {
        display: inline-block;
        margin-left: 2px;
        margin-right: 6px;
        font-size: 11px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: -0.28px;
        text-align: left;
        color: #bdbdbd;
      }
    }
  }
  span.roomType {
    display: inline-block;
    margin-right: 16px;
    font-size: 11px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.09;
    letter-spacing: -0.28px;
    text-align: left;
    color: #8556f6;
  }
`
const List = styled.a`
  position: relative;
  display: block;
  width: 100%;
  height: 72px;
  margin-bottom: 10px;
  box-sizing: border-box;
  /* 모바일일때 hover */
  @media (hover: hover) {
    &:hover {
      background: #f8f8f8;
    }
  }
`
