/**
 * @file main.js
 * @brief 메인페이지
 */
import React, {useContext} from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE, WIDTH_TABLET_S, WIDTH_TABLET, WIDTH_PC_S} from 'context/config'
//context
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {Context} from 'context'

import MainSlider from './main-slider'
import StarRangking from './ranking'
import MyStar from './my-star'
import ContentList from './live'
//components
const Main = props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)

  //임시 데이터
  const slideInfo = [
    {
      id: '1',
      reco: '추천',
      popu: '인기',
      category: '노래/연주',
      title: '이 밤을 신나게 보내요',
      url: 'https://t1.daumcdn.net/cfile/tistory/99DC6A385CC11E5A26',
      name: '끝날 때까지 끝난게 아닌 인연을 위해',
      people: '1,860',
      like: '5,200',
      icon: 'BEST'
    },

    {
      id: '2',
      category: '책/스토리',
      title: '오후를 밝혀줄 빛',
      url: 'https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F99A2AC3E5D15A5F629',
      name: '누운별',
      people: '1,230',
      like: '4,110',
      icon: 'HOT',
      avata: 'https://yt3.ggpht.com/a/AGF-l7-xu02U-mAL2MHWKwpQ1S8ZObTyxbK7momrSw=s900-c-k-c0xffffffff-no-rj-mo'
    },
    {
      id: '3',
      category: '건강/스포츠',
      title: '아침을 위한 활기차게 반려견과 함께하는 방',
      url: 'https://image.dalbitcast.com/images/profile/main5.jpg',
      name: '견주 모여라',
      people: '1,092',
      like: '8,999',
      icon: 'NEW'
    },
    {
      id: '4',
      category: '노래/연주',
      title: '저녁엔 냥이와 함께 라이프 스타일',
      url: 'https://image.dalbitcast.com/images/profile/main4.jpg',
      name: '별빛이 내린다~',
      people: '1,013',
      like: '1,818',
      icon: 'NEW'
    },
    {
      id: '5',
      popu: '인기',
      category: '책/스토리',
      title: '감성 재즈의 1인자',
      url: 'https://image.dalbitcast.com/images/profile/main3.jpg',
      name: '속삭이는 달빛',
      people: '1,002',
      like: '8,212',
      icon: 'STAR'
    },
    {
      id: '6',
      title: '째즈와 함께 시간 여행을 떠나요',
      reco: '추천',
      popu: '인기',
      category: '건강/스포츠',
      url: 'https://mblogthumb-phinf.pstatic.net/20150707_79/icccaccc_1436274069809nV3TH_PNG/2015-07-07-21-49-13.png?type=w420',
      name: '감성 재즈의 1인자',
      people: '772',
      like: '1,212',
      icon: 'HOT',
      avata: 'http://www.nbnnews.co.kr/news/photo/201904/259849_311550_480.jpg'
    },
    {
      id: '7',
      category: '건강/스포츠',
      popu: '인기',
      title: '기분좋은 아침, 달콤 신청곡 라디오',
      url: 'https://image.dalbitcast.com/images/profile/main2.jpg',
      name: '천우희',
      people: '615',
      like: '5,409',
      icon: 'VIP'
    },
    {
      id: '8',
      category: '건강/스포츠',
      title: 'KIA KBO 중계',
      url: 'https://t1.daumcdn.net/cfile/tistory/146A5A4F4EED3F0A33',
      name: '종범신',
      people: '599',
      like: '5,111',
      icon: 'NEW'
    },
    {
      id: '9',
      category: '건강/스포츠',
      title: '존예보스 Music Radio ',
      reco: '추천',
      url: 'https://image.dalbitcast.com/images/profile/main1.jpg',
      name: '아이린',
      people: '329',
      like: '9,212',
      icon: 'BEST'
    },
    {
      id: '10',
      category: '건강/스포츠',
      title: '개과천선.',
      url: 'https://t1.daumcdn.net/cfile/tistory/99068C4C5D607A1518',
      name: '강형욱',
      people: '222',
      like: '3,212',
      icon: 'NEW',
      avata: 'https://yt3.ggpht.com/a/AGF-l787pD6U3KAytpFmBMo7bq-g0DP0IuNCtTd-Mg=s900-c-k-c0xffffffff-no-rj-mo'
    }
  ]
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
          <MyStar Info={slideInfo} />
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
