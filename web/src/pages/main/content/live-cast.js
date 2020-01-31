/**
 * @file /content/context-list.js
 * @brief 메인 라이브, 캐스트 리스트 component
 */
import React from 'react'
import styled from 'styled-components'
import Select from 'components/ui/select'
import BroadContent from './broad-content'
import LiveCastBig from './live-cast-big'
import {WIDTH_MOBILE} from 'context/config'
import {WIDTH_TABLET} from 'context/config'
import {WIDTH_PC} from 'context/config'
//context
import {WIDTH_PC_S} from 'context/config'
const SelectInfo = {
  id: '1',
  selectUrl: 'https://devimage.dalbitcast.com/images/api/arrow-b.svg',
  selectName: '셀렉트네임',
  option1: '인기순',
  option2: '좋아요수',
  option3: '시청자수'
}
const LiveBigInfo = [
  {
    id: '1',
    title: '오후의 잠을 깨워줄 상큼한 목소리 들어요',
    url: 'https://www.sports-g.com/wp-content/uploads/2019/01/%EC%A0%84%EC%A7%80%ED%98%84-%EC%9D%B8%EC%8A%A4%ED%83%80%EA%B7%B8%EB%9E%A8.jpg',
    name: '★ 하늘하늘이에요',
    avata: 'http://static.news.zumst.com/images/53/2014/01/15/20140115163337743865.jpg',
    margin: ''
  },
  {
    id: '2',
    title: '오후를 밝혀줄 빛',
    url: 'https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F99A2AC3E5D15A5F629',
    name: '누운별',
    avata: 'https://yt3.ggpht.com/a/AGF-l7-xu02U-mAL2MHWKwpQ1S8ZObTyxbK7momrSw=s900-c-k-c0xffffffff-no-rj-mo'
  }
]
const broadContentInfo = [
  {
    id: '1',
    category: '고민/사연',
    margin: '5.32%',
    title: '태어난 김에 사는 여자 랍니다',
    url: 'http://www.topstarnews.net/news/photo/201908/661395_365144_452.jpg',
    name: '기안으로 부르진 마세요',
    people: '1,860',
    like: '5,200',
    icon: 'BEST',
    avata: 'https://file.namu.moe/file/5a5ed01a8cb79bc6a61a40d24aba990f415b6128b228ccd6cc166e6bf87c2fb1'
  },
  {
    id: '2',
    category: '건강/스포츠',
    title: '사랑합니다',
    margin: '5.32%',
    url: 'https://pbs.twimg.com/profile_images/822730965353054209/TrBCpHYT_400x400.jpg',
    name: '우리의 미래를 함께 할 DJ와 함께 해요',
    people: '1,230',
    like: '4,110',
    avata: 'https://yt3.ggpht.com/a/AGF-l78hYLHTlF83jBvQKAmWEhB91mcfEl_y3Mwwow=s900-c-k-c0xffffffff-no-rj-mo'
  },
  {
    id: '3',
    category: '고민/사연',
    title: '장비빨 노래빨 미모빨로 방송하는 남자',
    margin: '5.32%',
    url: 'http://the-star.co.kr/site/data/img_dir/2018/06/12/2018061202309_0.jpg',
    name: '다 가진 남자 다 가진 여자',
    people: '1,092',
    like: '8,999'
  },
  {
    id: '4',
    category: '책/스토리',
    title: '유럽 여행 중 라이브 방송',
    url: 'http://sccdn.chosun.com/news/html/2019/12/16/2019121701001190800076941.jpg',
    name: '남는 건 시간',
    people: '1,013',
    like: '1,818'
  },
  {
    id: '5',
    category: '건강/스포츠',
    margin: '5.32%',
    title: '패션을 사랑하자',
    url: 'http://image.cine21.com/resize/cine21/person/2019/0311/15_07_55__5c85fb3b335df[W680-].jpg',
    name: '패션을 논하다',
    people: '1,002',
    like: '8,212',
    avata:
      'data:image/jpeg;base64,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'
  },
  {
    id: '6',
    title: '이 밤에 달빛같은 방송',
    margin: '5.32%',
    category: '고민/사연',
    url: 'https://i.pinimg.com/736x/69/d0/09/69d009b4083e9f716023c6640848a4b2.jpg',
    name: '감성 재즈의 1인자',
    people: '772',
    like: '1,212'
  },
  {
    id: '7',
    category: '책/스토리',
    margin: '5.32%',
    title: '책 읽어주는 남자',
    url: 'http://nylonmedia.co.kr/wp-content/uploads/2019/08/%EC%9D%B4%EB%8F%99%EC%9A%B1-%EC%BB%A4%EB%B2%84%EC%8A%A4%ED%86%A0%EB%A6%AC6.jpg',
    name: '북 스토리텔러',
    people: '615',
    like: '5,409'
  },
  {
    id: '8',
    category: '건강/스포츠',
    title: '세상을 사랑하는 사람과 함께',
    url: 'https://yt3.ggpht.com/a/AGF-l7_cCXCuu6UJoV1QA-YY218wXyEH_eRghaSVZw=s900-c-k-c0xffffffff-no-rj-mo',
    name: '우리의 미래를 함께 할 DJ와 함께 해요',
    people: '599',
    like: '5,111',
    avata: 'http://www.ilemonde.com/news/photo/201802/8281_8536_4418.jpg'
  },
  {
    id: '9',
    category: '고민/사연',
    title: '하나둘셋넷 사연 여행',
    margin: '5.32%',
    url: 'http://img.asiatoday.co.kr/file/2019y/04m/09d/20190409010006347_1554792177_1.jpg',
    name: '아이린입니다.',
    people: '329',
    like: '9,212'
  },
  {
    id: '10',
    category: '건강/스포츠',
    margin: '5.32%',
    title: '개과천선',
    url: 'https://t1.daumcdn.net/cfile/tistory/99068C4C5D607A1518',
    name: '강형욱',
    people: '222',
    like: '3,212'
  },
  {
    id: '11',
    category: '건강/스포츠',
    title: '제목없는 방입니다.',
    margin: '5.32%',
    url: 'http://image.xportsnews.com/contents/images/upload/article/2017/1016/mb_1508123227185716.jpg',
    name: '신하균',
    people: '222',
    like: '3,212',
    avata: 'http://ny.kukminusa.com/allimg/20181217/201812171935_13180924047574_1.jpg'
  },
  {
    id: '12',
    category: '노래/댄스',
    title: '아융.',
    url: 'https://6.viki.io/image/a11230e2d98d4a73825a4c10c8c6feb0.jpg?x=b&a=0x0&s=460x268&e=t&f=t&cb=1',
    name: '이지은',
    people: '222',
    like: '3,212',
    icon: 'NEW'
  },
  {
    id: '13',
    category: '노래/댄스',
    title: '아융.',
    url: 'https://6.viki.io/image/a11230e2d98d4a73825a4c10c8c6feb0.jpg?x=b&a=0x0&s=460x268&e=t&f=t&cb=1',
    name: '이지은',
    people: '222',
    like: '3,212',
    icon: 'NEW'
  },
  {
    id: '14',
    category: '노래/댄스',
    title: '아융.',
    url: 'https://6.viki.io/image/a11230e2d98d4a73825a4c10c8c6feb0.jpg?x=b&a=0x0&s=460x268&e=t&f=t&cb=1',
    name: '이지은',
    people: '222',
    like: '3,212',
    icon: 'NEW'
  },
  {
    id: '15',
    category: '노래/댄스',
    title: '아융.',
    url: 'https://6.viki.io/image/a11230e2d98d4a73825a4c10c8c6feb0.jpg?x=b&a=0x0&s=460x268&e=t&f=t&cb=1',
    name: '이지은',
    people: '222',
    like: '3,212',
    icon: 'NEW'
  },
  {
    id: '16',
    category: '노래/댄스',
    title: '아융.',
    url: 'https://6.viki.io/image/a11230e2d98d4a73825a4c10c8c6feb0.jpg?x=b&a=0x0&s=460x268&e=t&f=t&cb=1',
    name: '이지은',
    people: '222',
    like: '3,212',
    icon: 'NEW'
  }
]

export default props => {
  //components

  return (
    <>
      <Content>
        <Stitle>실시간 Live</Stitle>
        {/* <Select Info={SelectInfo} /> */}
        <LiveCastBigWrap>
          <LiveCastBig ImgInfo={LiveBigInfo} />
          <LiveCastBig ImgInfo={LiveBigInfo} />
        </LiveCastBigWrap>
        <BroadContent BroadInfo={broadContentInfo} className="brContent"></BroadContent>
      </Content>
    </>
  )
}

const LiveCastBigWrap = styled.div`
  overflow: hidden;
  & div:nth-of-type(2) {
    margin-right: 0;
  }
`
const Content = styled.div`
  width: 100%;
  /* & div:nth-of-type(2) {
    margin-right: 0;
  } */

  @media (max-width: ${WIDTH_PC_S}) {
    width: 100%;
  }
  @media (max-width: ${WIDTH_TABLET}) {
    width: 100%;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 100%;
  }
`
const Stitle = styled.h2`
  font-size: 34px;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  letter-spacing: -0.85px;
  text-align: center;
  color: #8556f6;
  width: 100%;
  margin-top: 38px;
  margin-bottom: 37px;
`
