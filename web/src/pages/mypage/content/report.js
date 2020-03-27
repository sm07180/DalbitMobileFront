/**
 * @file /mypage/content/report.js
 * @brief 마이페이지 리포트
 */

import React, {useEffect, useStet, useContext} from 'react'
import styled from 'styled-components'

//layout
import {IMG_SERVER, WIDTH_MOBILE} from 'context/config'

// context
import {Context} from 'context'

// static
import mic from 'images/mini/mic.svg'
import moon from 'images/mini/moon.svg'
import heart from 'images/mini/heart.svg'
import clock from 'images/mini/clock.svg'

const iconInfo = {
  mic: [mic, '방송'],
  moon: [moon, '받은별'],
  heart: [heart, '좋아요'],
  clock: [clock, '청취자']
}

export default props => {
  const ctx = useContext(Context)
  const detialTabList = ['방송일자', '방송시작', '청취종료', '받은별', '좋아요', '최다 청취자', '방송 최고순위']

  return (
    <Report>
      {/* <TitleWrap style={{paddingBottom: '16px'}}>
        <TitleText>리포트</TitleText>
        <div>
          <TypeBtn style={{marginRight: '5px'}}>방송</TypeBtn>
          <TypeBtn style={{marginLeft: '5px'}}>청취</TypeBtn>
        </div>
      </TitleWrap> */}

      {/* <TitleWrap style={{alignItems: 'flex-end'}}>
        <TitleText>방송요약</TitleText>
        <TitleSubMsg>데이터는 최대 6개월까지 검색 가능합니다.</TitleSubMsg>
      </TitleWrap> */}

      {/* <BroadcastShort>
        {Object.keys(iconInfo).map((section, index) => {
          return (
            <ShortSection key={index}>
              <SectionIcon style={{backgroundImage: `url(${iconInfo[section][0]})`}} />
              <div>
                <div>0</div>
                <div>{iconInfo[section][1]}</div>
              </div>
            </ShortSection>
          )
        })}
      </BroadcastShort> */}

      <TitleWrap>
        <TitleText>상세내역</TitleText>
      </TitleWrap>

      <DetailTable>
        <DetailTableNav>
          {detialTabList.map((text, index) => {
            return <DetailTableTab key={index}>{text}</DetailTableTab>
          })}
        </DetailTableNav>

        <div>
          {[
            {
              date: '2020-02-14',
              start: '01:12:23',
              end: '02:12:23',
              byeol: 123123,
              like: 1555,
              maxListener: 94405,
              rank: 15
            },
            {
              date: '2020-03-14',
              start: '01:12:23',
              end: '02:12:23',
              byeol: 123123,
              like: 1555,
              maxListener: 94405,
              rank: 15
            },
            {
              date: '2020-03-22',
              start: '01:12:23',
              end: '02:12:23',
              byeol: 123123,
              like: 1555,
              maxListener: 94405,
              rank: 15
            }
          ].map((value, idx) => {
            return (
              <MobileDetailTab key={idx}>
                <div>{`방송일자 ${value.date}`}</div>
                <div>{`방송시작 ${value.start}`}</div>
                <div>{`방송종료 ${value.end}`}</div>
                <div>{`받은별 ${value.byeol}`}</div>
                <div>{`좋아요 ${value.like}`}</div>
                <div>{`최다 청취자 ${value.maxListener}`}</div>
                <div>{`방송 최고 순위 ${value.rank}`}</div>
              </MobileDetailTab>
            )
          })}
        </div>
      </DetailTable>
    </Report>
  )
}

const MobileDetailTab = styled.div`
  padding: 16px 10px;
  border-bottom: 1px solid #e0e0e0;
  div {
    color: #424242;
    font-size: 14px;
    margin: 8px 0;
  }
`

const DetailTableTab = styled.div`
  width: 14.2857%;
  text-align: center;
  font-size: 16px;
  letter-spacing: -0.4px;
  padding: 17px 0;
`

const DetailTableNav = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;

  @media (max-width: ${WIDTH_MOBILE}) {
    display: none;
  }
`
const DetailTable = styled.div``

const SectionIcon = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background-color: #8556f6;
  background-repeat: no-repeat;
  background-position: center;
`
const ShortSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 25%;
  padding: 32px 0 35px;
`
const BroadcastShort = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #e0e0e0;
`

const TypeBtn = styled.button`
  color: #757575;
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  padding: 15px;
  width: 86px;

  &.active {
    border-color: #8556f6;
  }
`
const TitleSubMsg = styled.div`
  color: #bdbdbd;
  font-size: 12px;
  letter-spacing: -0.3px;
`

const TitleText = styled.div`
  color: #8556f6;
  font-size: 20px;
  font-family: NanumSquareB;
  letter-spacing: -0.5px;
`
const TitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #8556f6;
  padding-bottom: 20px;
  margin-top: 46px;
`

const Report = styled.div``
