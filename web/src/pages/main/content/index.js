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
      roomNo: '91585299358701',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: 'ㅡㅡㅡㅡㅡㅡㅡ',
      people: 17,
      like: 0,
      name: '수다수달(\u003e_\u003c)/',
      url: 'https://photo.dalbitlive.com/profile_0/20606976000/20200326170947263044.jpeg?336x336'
    },
    {
      roomNo: '91585301052106',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '🌹🌹🌹24시간 음악이나 들알까?',
      people: 8,
      like: 1,
      name: '🎉😝pqpq😝🎉',
      url: 'https://photo.dalbitlive.com/profile_0/20608099200/20200327163023563511.jpeg?336x336'
    },
    {
      roomNo: '91585301233729',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '책과함께  힐링해요~!!',
      people: 6,
      like: 1,
      name: '11100000008',
      url: 'https://photo.dalbitlive.com/profile_0/20608099200/20200327164138046799.jpeg?336x336'
    },
    {
      roomNo: '91585300740523',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '😊하리보의 24시간 음악방송💕',
      people: 6,
      like: 0,
      name: '하리보',
      url: 'https://photo.dalbitlive.com/profile_0/20608052400/20200327090700525559.png?336x336'
    },
    {
      roomNo: '91585301623808',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '이불밖은 위험한 음악 플레이리스트!!',
      people: 3,
      like: 0,
      name: '이불밖은위험해🛌🛌',
      url: 'https://photo.dalbitlive.com/profile_0/20605806000/20200325093555014050.jpeg?336x336'
    },
    {
      roomNo: '91585299358701',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: 'ㅡㅡㅡㅡㅡㅡㅡ',
      people: 17,
      like: 0,
      name: '수다수달(\u003e_\u003c)/',
      url: 'https://photo.dalbitlive.com/profile_0/20606976000/20200326170947263044.jpeg?336x336'
    },
    {
      roomNo: '91585301052106',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '🌹🌹🌹24시간 음악이나 들알까?',
      people: 8,
      like: 1,
      name: '🎉😝pqpq😝🎉',
      url: 'https://photo.dalbitlive.com/profile_0/20608099200/20200327163023563511.jpeg?336x336'
    },
    {
      roomNo: '91585301233729',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '책과함께  힐링해요~!!',
      people: 6,
      like: 1,
      name: '11100000008',
      url: 'https://photo.dalbitlive.com/profile_0/20608099200/20200327164138046799.jpeg?336x336'
    },
    {
      roomNo: '91585300740523',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '😊하리보의 24시간 음악방송💕',
      people: 6,
      like: 0,
      name: '하리보',
      url: 'https://photo.dalbitlive.com/profile_0/20608052400/20200327090700525559.png?336x336'
    },
    {
      roomNo: '91585301623808',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '이불밖은 위험한 음악 플레이리스트!!',
      people: 3,
      like: 0,
      name: '이불밖은위험해🛌🛌',
      url: 'https://photo.dalbitlive.com/profile_0/20605806000/20200325093555014050.jpeg?336x336'
    },
    {
      roomNo: '91585299358701',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: 'ㅡㅡㅡㅡㅡㅡㅡ',
      people: 17,
      like: 0,
      name: '수다수달(\u003e_\u003c)/',
      url: 'https://photo.dalbitlive.com/profile_0/20606976000/20200326170947263044.jpeg?336x336'
    },
    {
      roomNo: '91585301052106',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '🌹🌹🌹24시간 음악이나 들알까?',
      people: 8,
      like: 1,
      name: '🎉😝pqpq😝🎉',
      url: 'https://photo.dalbitlive.com/profile_0/20608099200/20200327163023563511.jpeg?336x336'
    },
    {
      roomNo: '91585301233729',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '책과함께  힐링해요~!!',
      people: 6,
      like: 1,
      name: '11100000008',
      url: 'https://photo.dalbitlive.com/profile_0/20608099200/20200327164138046799.jpeg?336x336'
    },
    {
      roomNo: '91585300740523',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '😊하리보의 24시간 음악방송💕',
      people: 6,
      like: 0,
      name: '하리보',
      url: 'https://photo.dalbitlive.com/profile_0/20608052400/20200327090700525559.png?336x336'
    },
    {
      roomNo: '91585301623808',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '이불밖은 위험한 음악 플레이리스트!!',
      people: 3,
      like: 0,
      name: '이불밖은위험해🛌🛌',
      url: 'https://photo.dalbitlive.com/profile_0/20605806000/20200325093555014050.jpeg?336x336'
    },
    {
      roomNo: '91585299358701',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: 'ㅡㅡㅡㅡㅡㅡㅡ',
      people: 17,
      like: 0,
      name: '수다수달(\u003e_\u003c)/',
      url: 'https://photo.dalbitlive.com/profile_0/20606976000/20200326170947263044.jpeg?336x336'
    },
    {
      roomNo: '91585301052106',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '🌹🌹🌹24시간 음악이나 들알까?',
      people: 8,
      like: 1,
      name: '🎉😝pqpq😝🎉',
      url: 'https://photo.dalbitlive.com/profile_0/20608099200/20200327163023563511.jpeg?336x336'
    },
    {
      roomNo: '91585301233729',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '책과함께  힐링해요~!!',
      people: 6,
      like: 1,
      name: '11100000008',
      url: 'https://photo.dalbitlive.com/profile_0/20608099200/20200327164138046799.jpeg?336x336'
    },
    {
      roomNo: '91585300740523',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '😊하리보의 24시간 음악방송💕',
      people: 6,
      like: 0,
      name: '하리보',
      url: 'https://photo.dalbitlive.com/profile_0/20608052400/20200327090700525559.png?336x336'
    },
    {
      roomNo: '91585301623808',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '이불밖은 위험한 음악 플레이리스트!!',
      people: 3,
      like: 0,
      name: '이불밖은위험해🛌🛌',
      url: 'https://photo.dalbitlive.com/profile_0/20605806000/20200325093555014050.jpeg?336x336'
    },
    {
      roomNo: '91585299358701',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: 'ㅡㅡㅡㅡㅡㅡㅡ',
      people: 17,
      like: 0,
      name: '수다수달(\u003e_\u003c)/',
      url: 'https://photo.dalbitlive.com/profile_0/20606976000/20200326170947263044.jpeg?336x336'
    },
    {
      roomNo: '91585301052106',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '🌹🌹🌹24시간 음악이나 들알까?',
      people: 8,
      like: 1,
      name: '🎉😝pqpq😝🎉',
      url: 'https://photo.dalbitlive.com/profile_0/20608099200/20200327163023563511.jpeg?336x336'
    },
    {
      roomNo: '91585301233729',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '책과함께  힐링해요~!!',
      people: 6,
      like: 1,
      name: '11100000008',
      url: 'https://photo.dalbitlive.com/profile_0/20608099200/20200327164138046799.jpeg?336x336'
    },
    {
      roomNo: '91585300740523',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '😊하리보의 24시간 음악방송💕',
      people: 6,
      like: 0,
      name: '하리보',
      url: 'https://photo.dalbitlive.com/profile_0/20608052400/20200327090700525559.png?336x336'
    },
    {
      roomNo: '91585301623808',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '이불밖은 위험한 음악 플레이리스트!!',
      people: 3,
      like: 0,
      name: '이불밖은위험해🛌🛌',
      url: 'https://photo.dalbitlive.com/profile_0/20605806000/20200325093555014050.jpeg?336x336'
    },
    {
      roomNo: '91585299358701',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: 'ㅡㅡㅡㅡㅡㅡㅡ',
      people: 17,
      like: 0,
      name: '수다수달(\u003e_\u003c)/',
      url: 'https://photo.dalbitlive.com/profile_0/20606976000/20200326170947263044.jpeg?336x336'
    },
    {
      roomNo: '91585301052106',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '🌹🌹🌹24시간 음악이나 들알까?',
      people: 8,
      like: 1,
      name: '🎉😝pqpq😝🎉',
      url: 'https://photo.dalbitlive.com/profile_0/20608099200/20200327163023563511.jpeg?336x336'
    },
    {
      roomNo: '91585301233729',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '책과함께  힐링해요~!!',
      people: 6,
      like: 1,
      name: '11100000008',
      url: 'https://photo.dalbitlive.com/profile_0/20608099200/20200327164138046799.jpeg?336x336'
    },
    {
      roomNo: '91585300740523',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '😊하리보의 24시간 음악방송💕',
      people: 6,
      like: 0,
      name: '하리보',
      url: 'https://photo.dalbitlive.com/profile_0/20608052400/20200327090700525559.png?336x336'
    },
    {
      roomNo: '91585301623808',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '이불밖은 위험한 음악 플레이리스트!!',
      people: 3,
      like: 0,
      name: '이불밖은위험해🛌🛌',
      url: 'https://photo.dalbitlive.com/profile_0/20605806000/20200325093555014050.jpeg?336x336'
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
