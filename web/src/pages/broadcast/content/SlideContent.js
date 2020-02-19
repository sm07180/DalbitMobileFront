/**
 * @title 404페이지
 */
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import Live from './live'
import LiveListener from './live-listener'
import LiveGuest from './live-guest'
import NaviBar from './navibar'
import Charge from './charge'
import Present from './present'
import Boost from './boost'

export default props => {
  //context
  const context = useContext(Context)
  //tab
  const {currentItem, changeItem} = useTabs(0, tabConent)
  return (
    <>
      <Tab>
        {tabConent.map((section, index) => (
          <button onClick={() => changeItem(index)} key={index} className={currentItem.id === index ? 'on' : ''}>
            {section.tab}
          </button>
        ))}
      </Tab>
      {currentItem.tab === '청취자' && <LiveListener Info={ManegerInfo} Info2={ListenInfo} Info3={BJInfo} />}
      {currentItem.tab === '게스트' && <LiveGuest Info={ManegerInfo} Info2={ListenInfo} Info3={GuestInfo} />}
      {currentItem.tab === '라이브' && <Live Info={LiveInfo} />}
      {currentItem.tab === '충전' && <Charge />}
      {currentItem.tab === '선물' && <Present />}
      {currentItem.tab === '부스트' && <Boost />}
    </>
  )
}
//tab------------------------------------------------------------------
const tabConent = [
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
  {
    id: 3,
    tab: '충전'
  },
  {
    id: 4,
    tab: '선물'
  },
  {
    id: 5,
    tab: '부스트'
  }
]

const useTabs = (initialTab, allTabs) => {
  if (!allTabs || !Array.isArray(allTabs)) {
    return
  }
  const [currentIndex, SetCurrentIndex] = useState(initialTab)
  return {
    currentItem: allTabs[currentIndex],
    changeItem: SetCurrentIndex
  }
}
//---------------------------------------------------------------------
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
const BJInfo = {
  bjMemNo: '@gdgerg',
  bjNickNm: '하늘에서 비가와요~',
  url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg/290px-%EC%9C%A0%EC%95%84%EC%9D%B8_Yoo_Ah-in_20190103.jpg'
}
const GuestInfo = {
  bjMemNo: '@guest0070',
  bjNickNm: '◆뚜비두밥 :D',
  url: 'https://file.mk.co.kr/meet/neds/2020/02/image_readtop_2020_103512_15805116424071678.jpg'
}

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
