/**
 * @file main.js
 * @brief 메인페이지
 */
import React, {useState, useContext, useEffect} from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE, WIDTH_TABLET_S, WIDTH_TABLET, WIDTH_PC_S} from 'context/config'
//context
import {COLOR_MAIN} from 'context/color'
import {Context} from 'context'
import Api from 'context/api'
import MainSlider from './main-slider'
import StarRangking from './ranking'
import MyStar from './my-star'
import ContentList from './live'
//components
const Main = props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //useState
  const [fetch, setFetch] = useState(null)
  const [fetch1, setFetch1] = useState(null)
  //임시 데이터
  const slideInfo = [
    {
      id: '1',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '💙24시간 설레는 봄과 음악이냥👀',
      url: 'https://photo.dalbitlive.com/bg_0/20608099200/20200327162229077508.jpeg?336x336',
      name: '끝날 때까지 끝난게 아닌 인연을 위해',
      people: '1,860',
      like: '5,200',
      roomNo: '91585293778993'
    },
    {
      id: '2',
      reco: '추천',
      popu: '인기',
      category: '봄바람 휘날리며 꽃냄새가 향긋!',
      title: '*~!달빛냥이!~*',
      url: 'https://photo.dalbitlive.com/bg_0/20608099200/20200327162511568731.jpeg?336x336',
      name: '끝날 때까지 끝난게 아닌 인연을 위해',
      people: '1,860',
      like: '5,200',
      roomNo: '91585293922745'
    },
    {
      id: '31',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '이 밤을 신나게 보내요',
      url: 'https://photo.dalbitlive.com/profile_0/20608099200/20200327143603199453.jpeg?336x336',
      name: '끝날 때까지 끝난게 아닌 인연을 위해',
      people: '1,860',
      like: '5,200',
      roomNo: '91585294933832'
    },
    {
      id: '1',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '이 밤을 신나게 보내요',
      url: 'https://photo.dalbitlive.com/bg_3/roombg_200310_1.jpg?336x336',
      name: '끝날 때까지 끝난게 아닌 인연을 위해',
      people: '1,860',
      like: '5,200',
      roomNo: '91585299358701'
    },
    {
      id: '1',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '책을 읽다 예쁜문구를 만나셨다면',
      url: 'https://photo.dalbitlive.com/profile_0/20608099200/20200327164138046799.jpeg?336x336',
      name: '끝날 때까지 끝난게 아닌 인연을 위해',
      people: '1,860',
      like: '5,200',
      roomNo: '91585299392943'
    },
    {
      id: '1',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '💙24시간 설레는 봄과 음악이냥👀',
      url: 'https://photo.dalbitlive.com/bg_0/20608099200/20200327162229077508.jpeg?336x336',
      name: '끝날 때까지 끝난게 아닌 인연을 위해',
      people: '1,860',
      like: '5,200',
      roomNo: '91585293778993'
    },
    {
      id: '2',
      reco: '추천',
      popu: '인기',
      category: '봄바람 휘날리며 꽃냄새가 향긋!',
      title: '*~!달빛냥이!~*',
      url: 'https://photo.dalbitlive.com/bg_0/20608099200/20200327162511568731.jpeg?336x336',
      name: '끝날 때까지 끝난게 아닌 인연을 위해',
      people: '1,860',
      like: '5,200',
      roomNo: '91585293922745'
    },
    {
      id: '31',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '이 밤을 신나게 보내요',
      url: 'https://photo.dalbitlive.com/profile_0/20608099200/20200327143603199453.jpeg?336x336',
      name: '끝날 때까지 끝난게 아닌 인연을 위해',
      people: '1,860',
      like: '5,200',
      roomNo: '91585294933832'
    },
    {
      id: '1',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '이 밤을 신나게 보내요',
      url: 'https://photo.dalbitlive.com/bg_3/roombg_200310_1.jpg?336x336',
      name: '끝날 때까지 끝난게 아닌 인연을 위해',
      people: '1,860',
      like: '5,200',
      roomNo: '91585299358701'
    },
    {
      id: '1',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '책을 읽다 예쁜문구를 만나셨다면',
      url: 'https://photo.dalbitlive.com/profile_0/20608099200/20200327164138046799.jpeg?336x336',
      name: '끝날 때까지 끝난게 아닌 인연을 위해',
      people: '1,860',
      like: '5,200',
      roomNo: '91585299392943'
    },
    {
      id: '1',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '💙24시간 설레는 봄과 음악이냥👀',
      url: 'https://photo.dalbitlive.com/bg_0/20608099200/20200327162229077508.jpeg?336x336',
      name: '끝날 때까지 끝난게 아닌 인연을 위해',
      people: '1,860',
      like: '5,200',
      roomNo: '91585293778993'
    },
    {
      id: '2',
      reco: '추천',
      popu: '인기',
      category: '봄바람 휘날리며 꽃냄새가 향긋!',
      title: '*~!달빛냥이!~*',
      url: 'https://photo.dalbitlive.com/bg_0/20608099200/20200327162511568731.jpeg?336x336',
      name: '끝날 때까지 끝난게 아닌 인연을 위해',
      people: '1,860',
      like: '5,200',
      roomNo: '91585293922745'
    },
    {
      id: '31',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '이 밤을 신나게 보내요',
      url: 'https://photo.dalbitlive.com/profile_0/20608099200/20200327143603199453.jpeg?336x336',
      name: '끝날 때까지 끝난게 아닌 인연을 위해',
      people: '1,860',
      like: '5,200',
      roomNo: '91585294933832'
    },
    {
      id: '1',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '이 밤을 신나게 보내요',
      url: 'https://photo.dalbitlive.com/bg_3/roombg_200310_1.jpg?336x336',
      name: '끝날 때까지 끝난게 아닌 인연을 위해',
      people: '1,860',
      like: '5,200',
      roomNo: '91585299358701'
    },
    {
      id: '1',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '책을 읽다 예쁜문구를 만나셨다면',
      url: 'https://photo.dalbitlive.com/profile_0/20608099200/20200327164138046799.jpeg?336x336',
      name: '끝날 때까지 끝난게 아닌 인연을 위해',
      people: '1,860',
      like: '5,200',
      roomNo: '91585299392943'
    }
  ]
  //---------------------------------------------------------------------

  //fetch (메인상단)
  async function fetchData1() {
    const res = await Api.recommand({})
    if (res.result === 'success') {
      console.log(res)
      setFetch1(res.data)
      // setFetch1(res.data.list)
    }
    //   console.log(res)
  }
  //fetch (내 스타 영역.. 로그인시에만 보여줌)
  async function fetchData(obj) {
    const res = await Api.my_dj({...obj})
    if (res.result === 'success') {
      setFetch(res.data.list)
    }
  }
  //---------------------------------------------------------------------
  useEffect(() => {
    //내 스타 영역.. 로그인시에만 보여줌
    fetchData()
    fetchData1()
  }, [])
  //---------------------------------------------------------------------
  return (
    <Content {...props}>
      {/* 메인 최상단 슬라이드 */}
      <MainSlider Info={slideInfo} />
      {/* 스타 랭킹 영역 */}
      <RangkingWrap>
        <StarRangking {...props} />
      </RangkingWrap>
      {/* 내 스타 영역.. 로그인시에만 보여줌 */}
      {context.token.isLogin && (
        <SectionWrap>
          <MyStar Info={fetch} />
        </SectionWrap>
      )}

      {/* 라이브 list 영역, 캐스트 list 영역 */}
      <SectionWrap>
        <ContentList type="live" />
      </SectionWrap>
    </Content>
  )
}
export default Main

//---------------------------------------------------------------------
// styled
const Content = styled.div`
  background: #fff;
  &:before {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 500px;
    background: ${COLOR_MAIN};
    z-index: -4;
    content: '';
  }

  @media (max-width: ${WIDTH_MOBILE}) {
    &:before {
      height: 200px;
    }
  }
`
const RangkingWrap = styled.section``

const SectionWrap = styled.section`
  position: relative;
  width: 1464px;
  margin: 0 auto;
  border-top: 1px solid ${COLOR_MAIN};
  &:after {
    display: none;
    position: absolute;
    top: -1px;
    right: 0;
    width: 2.5%;
    height: 1px;
    background: #fff;
    content: '';
  }

  @media (max-width: 1480px) {
    width: 95%;
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 97.5%;
    margin: 0 0 0 2.5%;
    &:after {
      display: block;
    }
  }
`
