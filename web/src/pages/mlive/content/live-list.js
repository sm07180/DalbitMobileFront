import React, {useMemo, useState, useContext, useRef, useEffect} from 'react'
import styled from 'styled-components'
//context
import {WIDTH_MOBILE} from 'context/config'
import {IMG_SERVER} from 'context/config'

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
  })
  //------------------------------------------------------------ components start
  return (
    <List
      onClick={() => {
        props.update({selectList: data})
      }}>
      <div className="profile">
        <BgImg url={data.bjProfImg.thumb120x120}>
          <Img url={data.gstProfImg.thumb62x62} />
        </BgImg>
      </div>

      <div className="content">
        <div className="title">
          <h2>{roomType}</h2>
          {data.isRecomm && <Tag bgColor={'#8555f6'}>추천</Tag>}
          {data.isPop && <Tag bgColor={'#ec455f'}>인기</Tag>}
          {data.isNew && <Tag bgColor={'#fdad2b'}>신입</Tag>}
        </div>
        <div className="roomTitle">{data.title}</div>
        <div className="nickName">{data.bjNickNm}</div>
        <CountArea>
          <Icon>
            <img src={`${IMG_SERVER}/images/api/ic_headphone_s.png`} width={24} height={24} />
            &nbsp;&nbsp;{data.entryCnt}
          </Icon>
          <span>|</span>
          <Icon>
            <img src={`${IMG_SERVER}/images/api/ic_hearts_s.png`} width={24} height={24} />
            &nbsp;&nbsp;{data.likeCnt}
          </Icon>
        </CountArea>
      </div>
    </List>
  )
}
//------------------------------------------------------------ components start
const List = styled.a`
  display: flex;
  width: 100%;
  padding: 18px 0;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  box-sizing: border-box;
  /* 프로필영역 */
  .profile {
    margin-right: 16px;

    .profileImg {
      display: flex;
      width: 108px;
      height: 108px;
      align-items: center;
      position: relative;
      z-index: 0;
      cursor: pointer;
    }
  }
  /* 컨텐츠영역 */
  .content {
    transform: skew(-0.03deg);
    .title {
      display: flex;
      width: 100%;
      margin-bottom: 4px;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.43;
      letter-spacing: -0.35px;
      color: #bdbdbd;
      h2 {
        display: inline-block;
        margin-right: 5px;
        color: #dbdbdb;
        font-size: 14px;
        font-weight: normal;
        font-style: normal;
        letter-spacing: -0.35px;
      }
    }
    .roomTitle {
      display: block;
      margin-bottom: 11px;
      font-size: 16px;
    }
    .nickName {
      display: flex;
      width: 100%;
      height: 20px;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.43;
      letter-spacing: -0.35px;
      color: #8556f6;
      align-items: center;
      transform: skew(-0.03deg);
    }
  }
`
const CountArea = styled.div`
  display: flex;
  width: 85%;

  height: 30px;
  justify-content: flex-start;
  align-items: center;

  & > span {
    display: flex;
    width: 15px;
    color: #e0e0e0;
    font-size: 12px;
    align-items: center;
    transform: skew(-0.03deg);
  }
`
const Icon = styled.div`
  display: flex;
  align-items: center;
  width: 75px;
  height: 24px;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: -0.35px;
  color: #9e9e9e;
  transform: skew(-0.03deg);
`

const Tag = styled.div`
  height: 16px;
  background: ${props => (props.bgColor ? props.bgColor : '')};
  font-size: 10px;
  font-weight: 400;
  color: #fff;
  border-radius: 8px;
  padding: 1px 6px 0px 6px;
  justify-content: center;
  align-items: center;
  margin-left: 4px;
  margin-top: 1px;
  transform: skew(-0.03deg);
`
const BgImg = styled.div`
  width: 96px;
  height: 96px;
  background-image: url(${props => props.url});
  background-repeat: no-repeat;
  border-radius: 10px;
  position: relative;
  background-position: center;

  @media (max-width: ${WIDTH_MOBILE}) {
    width: 108px;
    height: 108px;
  }
`

const Img = styled.div`
  width: 40px;
  height: 40px;
  background: url(${props => (props.url ? props.url : '')}) no-repeat;
  position: absolute;
  bottom: 0px;
  right: 0px;
  z-index: 999;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
`
