/**
 * @file main.js
 * @brief 메인페이지
 */
import React from 'react'
import styled from 'styled-components'

//context
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'Context/color'

//layout
import Layout from 'Pages/common/layout'
import MainSlider from './content/main-slider'
import StarRangking from './content/ranking'
import PopularDJ from './content/popular'
import ContentList from './content/live-cast'

//components

const Main = props => {
  //---------------------------------------------------------------------
  //context
  //state
  const slideInfo = [
    {
      id: '1',
      category: '노래/연주',
      title: '이 밤을 신나게 보내요',
      url: 'http://img.khan.co.kr/news/2017/07/11/l_2017071201001381500111321.jpg',
      name: '끝날 때까지 끝난게 아닌인연을 위해',
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
      icon: 'HOT'
    },
    {
      id: '3',
      category: '건강/스포츠',
      title: '아침을 위한 활기차게 반려견과 함께하는 방',
      url: 'http://image.cine21.com/resize/cine21/person/2019/0729/11_42_45__5d3e5d25ef4fb[H800-].jpg',
      name: '견주 모여라',
      people: '1,092',
      like: '8,999',
      icon: 'NEW'
    },
    {
      id: '4',
      category: '노래/연주',
      title: '저녁엔 냥이와 함께 라이프 스타일',
      url: 'http://image.cine21.com/resize/cine21/person/2018/0205/10_31_41__5a77b3fdde0a6[W680-].jpg',
      name: '별빛이 내린다~',
      people: '1,013',
      like: '1,818',
      icon: 'NEW'
    },
    {
      id: '5',
      category: '책/스토리',
      title: '감성 재즈의 1인자',
      url: 'http://image.cine21.com/resize/cine21/person/2019/0311/15_07_55__5c85fb3b335df[W680-].jpg',
      name: '속삭이는 달빛',
      people: '1,002',
      like: '8,212',
      icon: 'STAR'
    },
    {
      id: '6',
      title: '째즈와 함께 시간 여행을 떠나요',
      category: '건강/스포츠',
      url: 'https://mblogthumb-phinf.pstatic.net/20150707_79/icccaccc_1436274069809nV3TH_PNG/2015-07-07-21-49-13.png?type=w420',
      name: '감성 재즈의 1인자',
      people: '772',
      like: '1,212',
      icon: 'HOT'
    },
    {
      id: '7',
      category: '건강/스포츠',
      title: '기분좋은 아침, 달콤 신청곡 라디오',
      url: 'http://iflv14.afreecatv.com/save/afreeca/station/2019/1230/11/thumb/1577672974671669_L_8.jpg',
      name: '볼빵°.°',
      people: '615',
      like: '5,409',
      icon: 'VIP'
    },
    {
      id: '8',
      category: '건강/스포츠',
      title: '가야금 , ㅎㅎㅎㅎㅎㅎㅎㅎ 💌',
      url: 'http://admin.img.afreecatv.com/thema_group_vod/2020/01/05/24985e11c9b1a63ce.jpg',
      name: '비익연리',
      people: '599',
      like: '5,111',
      icon: 'NEW'
    },
    {
      id: '9',
      category: '건강/스포츠',
      title: '존예보스 💿 Music Radio 📻',
      url: 'http://admin.img.afreecatv.com/thema_group_vod/2020/01/07/23745e144e84e8f72.jpg',
      name: '라온제나☆°',
      people: '329',
      like: '9,212',
      icon: 'BEST'
    },
    {
      id: '10',
      category: '건강/스포츠',
      title: '제목없는 방입니다.',
      url: 'http://admin.img.afreecatv.com/thema_group_vod/2020/01/02/94445e0dbacda8bec.jpg',
      name: '공신:강성태',
      people: '222',
      like: '3,212',
      icon: 'NEW'
    }
  ]
  //---------------------------------------------------------------------
  return (
    <Layout {...props} type="main">
      {/* 메인 최상단 슬라이드 */}
      <MainSlider />
      {/* 스타 랭킹 영역 */}
      <RangkingWrap>
        <StarRangking />
      </RangkingWrap>
      {/* 인기 DJ 영역 */}
      <PopularWrap>
        <PopularDJ Info={slideInfo} />
      </PopularWrap>
      {/* 라이브 list 영역, 캐스트 list 영역 */}
      <ContentListWrap>
        <ContentList type="live" />
        <ContentList type="cast" />
      </ContentListWrap>
    </Layout>
  )
}
export default Main

//---------------------------------------------------------------------
// styled

const RangkingWrap = styled.section``

const PopularWrap = styled.section``

const ContentListWrap = styled.section``
