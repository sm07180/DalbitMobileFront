import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import {Context} from 'context'
import {EventStore} from '../store'
import API from 'context/api'

//component
import Header from 'components/ui/header'

export default props => {
  const context = useContext(Context)
  const store = useContext(EventStore)
  const location = window.location.pathname.replace('/event/', '')

  //Maneger가데이터
  const runningEInfo = [
    {
      title: '1표현하지 못한 마음, 이렇게 표현해요!',
      date: '2020.02.11 ~ 2020.04.11',
      url: `${IMG_SERVER}/images/api/event1.png`
    },
    {
      title: '2검사 라디오 모험가 여러분들의 사연을 모집합니다!',
      date: '2020.02.11 ~ 2020.04.11',
      url: `${IMG_SERVER}/images/api/event2.png`
    },
    {
      title: '3달빛 보이스 콘테스트!',
      date: '2020.02.11 ~ 2020.04.11',
      url: `${IMG_SERVER}/images/api/event3.png`
    },
    {
      title: '4검사 라디오 모험가 여러분들의 사연을 모집합니다!',
      date: '2020.02.11 ~ 2020.04.11',
      url: `${IMG_SERVER}/images/api/event4.png`
    },
    {
      title: '5커피 한 잔의 여유 이벤트!',
      date: '2020.02.11 ~ 2020.04.11',
      url: `${IMG_SERVER}/images/api/event1.png`
    },
    {
      title: '6달빛의 꿈꾸는 라디오!',
      date: '2020.02.11 ~ 2020.04.11',
      url: `${IMG_SERVER}/images/api/event2.png`
    },
    {
      title: '7달빛송 달빛들아 달빛송 만들어줘!',
      date: '2020.02.11 ~ 2020.04.11',
      url: `${IMG_SERVER}/images/api/event3.png`
    },
    {
      title: '8달빛송 달빛들아 달빛송 만들어줘!',
      date: '2020.02.11 ~ 2020.04.11',
      url: `${IMG_SERVER}/images/api/event3.png`
    },
    {
      title: '9달빛송 달빛들아 달빛송 만들어줘!',
      date: '2020.02.11 ~ 2020.04.11',
      url: `${IMG_SERVER}/images/api/event3.png`
    },
    {
      title: '10달빛송 달빛들아 달빛송 만들어줘!',
      date: '2020.02.11 ~ 2020.04.11',
      url: `${IMG_SERVER}/images/api/event3.png`
    },
    {
      title: '11달빛송 달빛들아 달빛송 만들어줘!',
      date: '2020.02.11 ~ 2020.04.11',
      url: `${IMG_SERVER}/images/api/event3.png`
    },
    {
      title: '12달빛송 달빛들아 달빛송 만들어줘!',
      date: '2020.02.11 ~ 2020.04.11',
      url: `${IMG_SERVER}/images/api/event3.png`
    },
    {
      title: '13달빛송 달빛들아 달빛송 만들어줘!',
      date: '2020.02.11 ~ 2020.04.11',
      url: `${IMG_SERVER}/images/api/event3.png`
    }
  ]

  const EventeUrl = () => {
    const index = store.eventPage
    if (index !== '') {
      props.history.push(`/event/${index}`)
      //fetchData2()
    } else {
      store.action.updateEventPage('')
    }
  }

  useEffect(() => {
    if (store.eventPage !== '') {
      EventeUrl()
    }
  }, [store.eventPage])

  useEffect(() => {
    if (store.eventPage !== undefined) {
      window.onpopstate = e => {
        window.location.href = `/event`
      }
    }

    if (location !== '/event' && location !== '') {
      store.action.updateEventPage(location)
    }

    return () => {
      store.action.updateEventPage('')
    }
  }, [])

  return (
    <>
      <Container>
        <Header>
          <div className="category-text">이벤트</div>
        </Header>
        <p>달빛라이브</p>
        <Wrap className={store.eventPage === '' ? 'on' : 'off'}>
          {runningEInfo.map((post, index) => {
            return (
              <li key={index} bg={post.url} onClick={() => store.action.updateEventPage(index)}>
                <IMGBOX bg={post.url}></IMGBOX>
                <InfoBOX>
                  <p>{post.title}</p>
                  <h4>{post.title}</h4>
                  <h5>{post.date}</h5>
                </InfoBOX>
              </li>
            )
          })}
        </Wrap>

        <Detail className={store.eventPage === '' ? 'off' : 'on'}>여기는 디테일 {store.eventPage}번째 내용입니다.</Detail>
      </Container>
    </>
  )
}

const Container = styled.div`
  width: 1210px;
  margin: 0 auto;
  .close-btn {
    position: absolute;
    top: 6px;
    left: 2%;
  }
  & h1 {
    margin: 40px 0;
    text-align: center;
    color: ${COLOR_MAIN};
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.7px;
  }
  @media (max-width: 1240px) {
    width: calc(100% - 32px);
  }
`

const Wrap = styled.ul`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 26px;

  &.off {
    display: none;
  }
  &.on {
    display: block;
  }
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

const Detail = styled.section`
  display: none;
  border: 1px solid #000;

  &.on {
    display: block;
  }
`
