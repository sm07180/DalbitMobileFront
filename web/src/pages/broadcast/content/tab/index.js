/**
 * @title 사이드 컨텐츠(탭)
 */
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {BroadCastStore} from '../../store'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import Live from './live'
import LiveListener from './listen'
import LiveGuest from './guest'
import Charge from './charge'
import Present from './present'
import Profile from './profile'
import Profile2 from './profileLisner'
import Boost from './boost'
import Report from './report'
import Notice from './notice'
import Story from './story'
import Macro from './macro'
import BroadModify from './broad-setting-modify'
import PresentGiven from './present-given'
import Navi from './navibar'

export default props => {
  const [roomInfo, setRoomInfo] = useState({...props.location.state})
  const [state, setState] = useState({
    prev: '청취자',
    next: '청취자'
  })
  //console.log(props)
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const store = useContext(BroadCastStore)
  //---------------------------------------------------------------------
  //tab:탭클릭 index정의 state
  const {currentItem, changeItem} = useTabs(0, store.currentTab)
  //---------------------------------------------------------------------
  const usePrev = index => {
    if (index !== state.next) {
      setState({
        prev: state.next,
        next: index
      })
    }
    changeItem(index)
  }

  useEffect(() => {
    changeItem(store.tabIdx)
    console.log('## index.js - tabContent :', store.currentTab)
  }, [store.flag])

  // console.log('## store: ', store)
  return (
    <>
      {/* 탭버튼 */}
      <Tab>
        {/* {store.tabItem.map((
          section,
          index // prevState를 사용하기 위해 usePrev 함수 생성
        ) => (
          <button onClick={() => usePrev(index)} key={index} className={section.id === index ? 'on' : ''}>
            {section.tab}
          </button>
        ))} */}
        {store.currentTab.map((data, index) => {
          return (
            <button onClick={() => usePrev(data.id)} key={index} className={currentItem.tab === data.tab ? 'on' : ''}>
              {data.tab}
            </button>
          )
        })}
      </Tab>
      {/* 탭컨텐츠영역 */}
      {currentItem.tab === '청취자' && <LiveListener {...props} Info={ManegerInfo} Info3={BJInfo} />}
      {currentItem.tab === '게스트' && <LiveGuest Info={ManegerInfo} Info2={ListenInfo} Info3={GuestInfo} {...props} />}
      {currentItem.tab === '라이브' && <Live Info={LiveInfo} {...props} />}
      {currentItem.tab === '충전' && <Charge prev={state.prev} _changeItem={usePrev} />}
      {currentItem.tab === '선물' && <Present prev={state.prev} _changeItem={usePrev} />}
      {currentItem.tab === '부스트' && <Boost />}
      {currentItem.tab === '프로필' && <Profile2 Info={Profiledata} {...props} />}
      {currentItem.tab === '신고하기' && <Report Info={Reportdata} />}
      {currentItem.tab === '공지사항' && <Notice />}
      {currentItem.tab === '사연' && <Story />}
      {currentItem.tab === '방송수정' && <BroadModify {...props} />}
      {currentItem.tab === '빠른 말' && <Macro prev={state.prev} _changeItem={usePrev} />}
      {currentItem.tab === '받은선물' && <PresentGiven prev={state.prev} _changeItem={usePrev} />}
    </>
  )
}
//------------------------------------------------------------------
//tab function
const useTabs = (initialTab, allTabs) => {
  if (!allTabs || !Array.isArray(allTabs)) {
    return
  }
  const [currentIndex, SetCurrentIndex] = useState(initialTab)
  if (!allTabs[currentIndex]) {
    return {
      currentItem: allTabs[3],
      changeItem: SetCurrentIndex
    }
  } else {
    return {
      currentItem: allTabs[currentIndex],
      changeItem: SetCurrentIndex
    }
  }
}
//------------------------------------------------------------------
//styled
const Tab = styled.div`
  & button {
    width: 25%;
    height: 48px;
    display: inline-block;
    border: 1px solid #e0e0e0;
    border-bottom: 1px solid ${COLOR_MAIN};
    margin-left: -1px;
    &:first-child {
      margin-left: 0;
    }
    &.on {
      border: 1px solid ${COLOR_MAIN};
      background-color: ${COLOR_MAIN};
      color: white;
    }
  }
  & button:focus {
    outline: none;
  }
`
//------------------------------------------------------------------
//탭 셀렉트 배열

const tabContent = [
  {
    id: 0,
    tab: '청취자'
  },
  {
    id: 1,
    tab: '게스트'
  },
  {
    id: 2,
    tab: '라이브'
  },
  // {
  //   id: 3,
  //   tab: '충전'
  // },
  {
    id: 4,
    tab: '선물'
  }
  // {
  //   id: 5,
  //   tab: '부스트'
  // },
  // {
  //   id: 6,
  //   tab: '프로필'
  // },
  // {
  //   id: 7,
  //   tab: '신고하기'
  // },
  // {
  //   id: 8,
  //   tab: '공지사항'
  // },
  // {
  //   id: 9,
  //   tab: '사연'
  // },
  // ,
  // {
  //   id: 10,
  //   tab: '방송수정'
  // },
  // {
  //   id: 11,
  //   tab: '빠른 말'
  // },
  // {
  //   id: 12,
  //   tab: '받은선물'
  // }
]
//data------------------------------------------------------------------
//라이브 가데이터
const LiveInfo = [
  {
    category: '일상',
    title: '포근한 아침 라디오입니다.',
    name: '★하늘하늘이에요',
    bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg/290px-%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg',
    reco: '추천',
    newby: '신입',
    nowpeople: 85,
    like: 850,
    totalpeople: '23,533',
    thumb:
      'https://lh3.googleusercontent.com/proxy/rNffynT7M8L4UdWNYqT69v1OnKupd75mZZPUjepXfvzhvJKfNBhyd9hABmPYbReNXeV9DJOaPGnXhOKG30omzXc5g7ZsegpoO4U7WWJMDlQftG71As_Xz4vl6cDvlrXxAEGhaRFC6WjmakkVusaAmnvV8YCAW1xTLwCVI3pNx6MEJx1xd3fC5V-Ndhc8koB9FGgjRJcyXKW1iEqKhRdH8F9RnurcPlL7tRVLsVMYY_H7C2jbxCgg9ELAWm9zzajZCcElhgAy56a9eIOKLFlIia4Tmdi_lTfHGkzrBxm4HmGL69dWyVjy8QXTMIzpp4FEi1rxuExPks6L0r75jwQ'
  },
  {
    category: '고민/사연',
    title: '월요병을 함께 이겨낼 힐링 타임..',
    name: '꿈많은 냥이',
    bg: 'https://www.vrfan360.com/files/2018/10/19/66209ee43d3c2a5877a73bd99ded6a86222229.jpg',
    reco: '추천',
    nowpeople: 32,
    like: '1,020',
    totalpeople: '81,289'
  },
  {
    category: '일상',
    title: '포근한 아침 오후 잠을 깨워줄 상큼한 목소리...',
    name: '✨솜사탕사탕✨',
    bg: 'https://pbs.twimg.com/media/Dcqu5I4UQAA8JC9.jpg',
    nowpeople: 85,
    like: 850,
    totalpeople: '23,533',
    thumb: 'https://www.topstarnews.net/news/photo/201902/590155_269319_70.jpg'
  },
  {
    category: '일상',
    title: '포근한 아침 라디오입니다.',
    name: '★하늘하늘이에요',
    bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg/290px-%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg',
    reco: '추천',
    newby: '신입',
    nowpeople: 85,
    like: 850,
    totalpeople: '23,533',
    thumb:
      'https://lh3.googleusercontent.com/proxy/rNffynT7M8L4UdWNYqT69v1OnKupd75mZZPUjepXfvzhvJKfNBhyd9hABmPYbReNXeV9DJOaPGnXhOKG30omzXc5g7ZsegpoO4U7WWJMDlQftG71As_Xz4vl6cDvlrXxAEGhaRFC6WjmakkVusaAmnvV8YCAW1xTLwCVI3pNx6MEJx1xd3fC5V-Ndhc8koB9FGgjRJcyXKW1iEqKhRdH8F9RnurcPlL7tRVLsVMYY_H7C2jbxCgg9ELAWm9zzajZCcElhgAy56a9eIOKLFlIia4Tmdi_lTfHGkzrBxm4HmGL69dWyVjy8QXTMIzpp4FEi1rxuExPks6L0r75jwQ'
  },
  {
    category: '일상',
    title: '포근한 아침 라디오입니다.',
    name: '★하늘하늘이에요',
    bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg/290px-%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg',
    reco: '추천',
    newby: '신입',
    nowpeople: 85,
    like: 850,
    totalpeople: '23,533',
    thumb:
      'https://lh3.googleusercontent.com/proxy/rNffynT7M8L4UdWNYqT69v1OnKupd75mZZPUjepXfvzhvJKfNBhyd9hABmPYbReNXeV9DJOaPGnXhOKG30omzXc5g7ZsegpoO4U7WWJMDlQftG71As_Xz4vl6cDvlrXxAEGhaRFC6WjmakkVusaAmnvV8YCAW1xTLwCVI3pNx6MEJx1xd3fC5V-Ndhc8koB9FGgjRJcyXKW1iEqKhRdH8F9RnurcPlL7tRVLsVMYY_H7C2jbxCgg9ELAWm9zzajZCcElhgAy56a9eIOKLFlIia4Tmdi_lTfHGkzrBxm4HmGL69dWyVjy8QXTMIzpp4FEi1rxuExPks6L0r75jwQ'
  },
  {
    category: '일상',
    title: '포근한 아침 라디오입니다.',
    name: '★하늘하늘이에요',
    bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg/290px-%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg',
    reco: '추천',
    newby: '신입',
    nowpeople: 85,
    like: 850,
    totalpeople: '23,533',
    thumb:
      'https://lh3.googleusercontent.com/proxy/rNffynT7M8L4UdWNYqT69v1OnKupd75mZZPUjepXfvzhvJKfNBhyd9hABmPYbReNXeV9DJOaPGnXhOKG30omzXc5g7ZsegpoO4U7WWJMDlQftG71As_Xz4vl6cDvlrXxAEGhaRFC6WjmakkVusaAmnvV8YCAW1xTLwCVI3pNx6MEJx1xd3fC5V-Ndhc8koB9FGgjRJcyXKW1iEqKhRdH8F9RnurcPlL7tRVLsVMYY_H7C2jbxCgg9ELAWm9zzajZCcElhgAy56a9eIOKLFlIia4Tmdi_lTfHGkzrBxm4HmGL69dWyVjy8QXTMIzpp4FEi1rxuExPks6L0r75jwQ'
  },
  {
    category: '일상',
    title: '포근한 아침 라디오입니다.',
    name: '★하늘하늘이에요',
    bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg/290px-%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg',
    reco: '추천',
    newby: '신입',
    nowpeople: 85,
    like: 850,
    totalpeople: '23,533',
    thumb:
      'https://lh3.googleusercontent.com/proxy/rNffynT7M8L4UdWNYqT69v1OnKupd75mZZPUjepXfvzhvJKfNBhyd9hABmPYbReNXeV9DJOaPGnXhOKG30omzXc5g7ZsegpoO4U7WWJMDlQftG71As_Xz4vl6cDvlrXxAEGhaRFC6WjmakkVusaAmnvV8YCAW1xTLwCVI3pNx6MEJx1xd3fC5V-Ndhc8koB9FGgjRJcyXKW1iEqKhRdH8F9RnurcPlL7tRVLsVMYY_H7C2jbxCgg9ELAWm9zzajZCcElhgAy56a9eIOKLFlIia4Tmdi_lTfHGkzrBxm4HmGL69dWyVjy8QXTMIzpp4FEi1rxuExPks6L0r75jwQ'
  }
]
//BJ가데이터
const BJInfo = {
  bjMemNo: '@gdgerg',
  bjNickNm: '하늘에서 비가와요~',
  url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg/290px-%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg'
}
//Guest가데이터
const GuestInfo = {
  bjMemNo: '@guest0070',
  bjNickNm: '◆뚜비두밥 :D',
  url: 'https://file.mk.co.kr/meet/neds/2020/02/image_readtop_2020_103512_15805116424071678.jpg'
}
//Maneger가데이터
const ManegerInfo = [
  {
    bjMemNo: '@gdgerg',
    bjNickNm: '하늘에서 비가와요~',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg/290px-%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg'
  },
  {
    bjMemNo: '@gdgerg',
    bjNickNm: '눈바람 비가와요~',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg/290px-%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg'
  }
]
//리스너가데이터
const ListenInfo = [
  {
    bjMemNo: '@gdgerg',
    bjNickNm: '하늘에서 비가와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@gdgerg',
    bjNickNm: '하늘에서 비가와요~',

    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@gdgerg',
    bjNickNm: '하늘에서 비가와요~',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg/290px-%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg/290px-%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg'
  },
  {
    bjMemNo: '@gdgerg',
    bjNickNm: '하늘에서 비가와요~',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg/290px-%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg/290px-%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg'
  },
  {
    bjMemNo: '@gdgerg',
    bjNickNm: '하늘에서 비가와요~',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg/290px-%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg/290px-%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg'
  },
  {
    bjMemNo: '@gdgerg',
    bjNickNm: '하늘에서 비가와요~',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg/290px-%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg/290px-%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg'
  },
  {
    bjMemNo: '@gdgerg',
    bjNickNm: '하늘에서 비가와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  },
  {
    bjMemNo: '@kfc43',
    bjNickNm: '하늘에서 눈이와요~',
    url: 'https://pbs.twimg.com/media/EOF2QQ8UwAAKOnW.jpg'
  }
]
//프로필 데이터
const Profiledata = {
  profImg: 'https://lh3.googleusercontent.com/proxy/RmQV5QRjLDB43l5YJsC7Nx6of4OF-x9eFdV2P9CjfAFNvbgqiorz7O586gPrL9VjP1sWdv4afuKU7uujFuB3wE6Ryi92f4h-Q430XDGmPfuvzcw3KIycLu5f',
  exp: 140,
  grade: '골드',
  level: 31,
  nickNm: 'BJ라디오라디오😍',
  memId: '@bjradio',
  fanCnt: 12000,
  starCnt: 870
}
//신고하기 데이터
const Reportdata = {
  nickNm: '솜사탕사탕'
}
