import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE} from 'context/config'
//components
import Title from './title'
import TopRank from './topRank'
import RealTimeList from './realTimeList'

const testData = [
  {
    rank: 1,
    code: '노래/연주',
    title: '비오는 날, 기분이 뽀송해지는 점심 라디오',
    intro: '우리의 미래를 함께 할 DJ',
    listenCnt: '4,698',
    likeCnt: '11,546',
    imgUrl: 'https://devimage.dalbitcast.com/images/api/live_profile.png'
  },
  {
    rank: 2,
    code: '노래/연주',
    title: '비오는 날, 기분이 뽀송해지는 점심 라디오',
    intro: '우리의 미래를 함께 할 DJ',
    listenCnt: '4,698',
    likeCnt: '11,546',
    imgUrl: 'https://devimage.dalbitcast.com/images/api/live_profile.png'
  },
  {
    rank: 3,
    code: '노래/연주',
    title: '☂️ 비오는 날, 기분이 뽀송해지는 점심 라디오',
    intro: '우리의 미래를 함께 할 DJ와 함께해요 우리의 미래를 함께 할',
    listenCnt: '4,698',
    likeCnt: '11,546',
    imgUrl: 'https://devimage.dalbitcast.com/images/api/live_profile.png'
  }
]
export default props => {
  return (
    <Container>
      <Title title={'라이브'} />
      <Wrap>
        <MainContents>
          <TopRank testData={testData} />
          <RealTimeList />
        </MainContents>
      </Wrap>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
`

const MainContents = styled.div`
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 100%;
    align-items: flex-start;
  }
  display: flex;
  width: 80%;
  height: 100%;
  align-items: flex-start;
  flex-direction: column;
`
const Wrap = styled.div`
  display: flex;
  width: 90%;
  height: 100%;
  justify-content: center;
`
