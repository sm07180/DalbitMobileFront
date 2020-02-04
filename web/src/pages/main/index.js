/**
 * @file main.js
 * @brief 메인페이지
 */
import React from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE, WIDTH_TABLET_S, WIDTH_TABLET, WIDTH_PC_S} from 'context/config'
//context
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
//layout
import Layout from 'pages/common/layout'
import MainSlider from './content/main-slider'
import StarRangking from './content/ranking'
import PopularDJ from './content/my-star'
import ContentList from './content/live'
//components
const Main = props => {
  //---------------------------------------------------------------------
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
      popu: '인기',
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
      url: 'http://www.namooactors.com/data/file/nm3001/2038834755_jNS8hmG4_ECB29CEC9AB0ED9DAC_370_2.jpg',
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
      url: 'http://img.asiatoday.co.kr/file/2019y/04m/09d/20190409010006347_1554792177_1.jpg',
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
    },
    {
      id: '11',
      category: '건강/스포츠',
      title: '제목없는 방입니다.',
      reco: '추천',
      popu: '인기',
      url: 'http://image.xportsnews.com/contents/images/upload/article/2017/1016/mb_1508123227185716.jpg',
      name: '신하균',
      people: '222',
      like: '3,212',
      icon: 'NEW'
    },
    {
      id: '12',
      category: '건강/스포츠',
      title: '아융.',
      url: 'https://6.viki.io/image/a11230e2d98d4a73825a4c10c8c6feb0.jpg?x=b&a=0x0&s=460x268&e=t&f=t&cb=1',
      name: '이지은',
      people: '222',
      like: '3,212',
      icon: 'NEW',
      avata: 'https://qtum.or.kr/files/attach/images/528597/268/657/001/9c1e6d44ba7c805cff09d3a0636254db.png'
    }
  ]
  //---------------------------------------------------------------------
  return (
    <Layout {...props} type="main">
      {/* 메인 최상단 슬라이드 */}
      <MainSlider Info={slideInfo} />
      {/* 스타 랭킹 영역 */}
      <RangkingWrap>
        <StarRangking />
      </RangkingWrap>
      {/* 인기 DJ 영역 */}
      <PopularWrap>
        <Border />
        <PopularDJ Info={slideInfo} />
      </PopularWrap>
      {/* 라이브 list 영역, 캐스트 list 영역 */}
      <ContentListWrap>
        <Border2 />
        <ContentList type="live" />
      </ContentListWrap>
    </Layout>
  )
}
export default Main

//---------------------------------------------------------------------
// styled

const RangkingWrap = styled.section``

const PopularWrap = styled.section`
  max-width: 1467px;
  width: 94.53%;
  margin: 0 auto;
  @media (max-width: ${WIDTH_PC_S}) {
    width: 100%;
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
  }
`
const Border = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  border-top: 1px solid ${COLOR_MAIN};
  &:after {
    display: block;
    position: absolute;
    top: 0px;
    left: 50%;
    width: 1px;
    height: 40px;
    content: '';
    background-color: ${COLOR_MAIN};
    @media (max-width: ${WIDTH_MOBILE}) {
      height: 21px;
    }
  }
  @media (max-width: ${WIDTH_PC_S}) {
    width: 95.47%;
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 95.47%;
  }
`

const ContentListWrap = styled.section`
  max-width: 1467px;
  width: 94.53%;
  margin: 0 auto;
  &:after {
    display: block;
    clear: both;
    content: '';
  }

  @media (max-width: ${WIDTH_PC_S}) {
    width: 95.47%;
  }
  @media (max-width: ${WIDTH_TABLET}) {
    width: 95.47%;
  }
`
const Border2 = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  border-top: 1px solid ${COLOR_MAIN};
  &:after {
    display: block;
    position: absolute;
    top: 0px;
    left: 50%;
    width: 1px;
    height: 40px;
    background-color: ${COLOR_MAIN};
    content: '';
    @media (max-width: ${WIDTH_MOBILE}) {
      height: 21px;
    }
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 100%;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 100%;
  }
`
