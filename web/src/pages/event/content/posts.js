import React from 'react'
import API from 'context/api'
import styled from 'styled-components'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
const Posts = ({posts}) => {
  return (
    <Wrap>
      {posts.map((post, index) => (
        <li key={index} bg={runningEInfo[index].url}>
          <IMGBOX bg={runningEInfo[index].url}></IMGBOX>
          <InfoBOX>
            <p>{post.title}</p>
            <h4>{runningEInfo[index].title}</h4>
            <h5>{runningEInfo[index].date}</h5>
          </InfoBOX>
        </li>
      ))}
    </Wrap>
  )
}
export default Posts

const Wrap = styled.ul`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 26px;
  & li {
    width: calc(33.33% - 17.4px);
    height: 360px;
    margin-right: 26px;
    margin-bottom: 50px;
    background-color: #f5f5f5;
    &:nth-child(3n) {
      margin-right: 0;
    }
    & p {
      display: none;
    }
    & h4 {
      font-size: 16px;
      transform: skew(-0.03deg);
      font-weight: normal;
      letter-spacing: -0.4px;
    }
    & h5 {
      margin-top: 8px;
      color: #bdbdbd;
      font-size: 14px;
      font-weight: normal;
      letter-spacing: -0.4px;
      transform: skew(-0.03deg);
    }
    @media (max-width: ${WIDTH_TABLET}) {
      width: calc(50% - 13px);
      &:nth-child(3n) {
        margin-right: 26px;
      }
      &:nth-child(2n) {
        margin-right: 0px;
      }
    }
    @media (max-width: ${WIDTH_MOBILE}) {
      width: calc(100%);
      margin-right: 0;
      &:nth-child(2n) {
        margin-right: 0;
      }
      &:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
`
const IMGBOX = styled.div`
  width: 100%;
  height: 80%;
  background: url(${props => props.bg}) no-repeat center center / cover;
`
const InfoBOX = styled.div`
  width: 100%;
  height: 20%;
  padding: 20px;
  box-sizing: border-box;
`
//Maneger가데이터
const runningEInfo = [
  {
    title: '표현하지 못한 마음, 이렇게 표현해요!',
    date: '2020.02.11 ~ 2020.04.11',
    url: 'https://image.dalbitcast.com/images/api/event1.png'
  },
  {
    title: '검사 라디오 모험가 여러분들의 사연을 모집합니다!',
    date: '2020.02.11 ~ 2020.04.11',
    url: 'https://image.dalbitcast.com/images/api/event2.png'
  },
  {
    title: '달빛 보이스 콘테스트!',
    date: '2020.02.11 ~ 2020.04.11',
    url: 'https://image.dalbitcast.com/images/api/event3.png'
  },
  {
    title: '검사 라디오 모험가 여러분들의 사연을 모집합니다!',
    date: '2020.02.11 ~ 2020.04.11',
    url: 'https://image.dalbitcast.com/images/api/event4.png'
  },
  {
    title: '커피 한 잔의 여유 이벤트!',
    date: '2020.02.11 ~ 2020.04.11',
    url: 'https://image.dalbitcast.com/images/api/event1.png'
  },
  {
    title: '달빛의 꿈꾸는 라디오!',
    date: '2020.02.11 ~ 2020.04.11',
    url: 'https://image.dalbitcast.com/images/api/event2.png'
  },
  {
    title: '달빛송 달빛들아 달빛송 만들어줘!',
    date: '2020.02.11 ~ 2020.04.11',
    url: 'https://image.dalbitcast.com/images/api/event3.png'
  },
  {
    title: '달빛송 달빛들아 달빛송 만들어줘!',
    date: '2020.02.11 ~ 2020.04.11',
    url: 'https://image.dalbitcast.com/images/api/event3.png'
  },
  {
    title: '달빛송 달빛들아 달빛송 만들어줘!',
    date: '2020.02.11 ~ 2020.04.11',
    url: 'https://image.dalbitcast.com/images/api/event3.png'
  },
  {
    title: '달빛송 달빛들아 달빛송 만들어줘!',
    date: '2020.02.11 ~ 2020.04.11',
    url: 'https://image.dalbitcast.com/images/api/event3.png'
  },
  {
    title: '달빛송 달빛들아 달빛송 만들어줘!',
    date: '2020.02.11 ~ 2020.04.11',
    url: 'https://image.dalbitcast.com/images/api/event3.png'
  },
  {
    title: '달빛송 달빛들아 달빛송 만들어줘!',
    date: '2020.02.11 ~ 2020.04.11',
    url: 'https://image.dalbitcast.com/images/api/event3.png'
  },
  {
    title: '달빛송 달빛들아 달빛송 만들어줘!',
    date: '2020.02.11 ~ 2020.04.11',
    url: 'https://image.dalbitcast.com/images/api/event3.png'
  }
]
