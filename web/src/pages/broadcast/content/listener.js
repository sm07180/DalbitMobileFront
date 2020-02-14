/**
 * @title 404페이지
 */
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//components
import Charge from './charge'
import NaviBar from './navibar'

export default props => {
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

  //context
  const context = new useContext(Context)
  //state
  const [isSideOn, setIsSideOn] = useState(true)

  useEffect(() => {
    //방송방 페이지는 footer없음.
    context.action.updateState({isOnCast: true})
    return () => {
      context.action.updateState({isOnCast: false})
    }
  }, [])
  //tab
  const {currentItem, changeItem} = useTabs(0, tabConent)
  return (
    <Content className={isSideOn ? 'side-on' : 'side-off'}>
      <Chat>{/* 채팅방 영역 */}여기서는 채팅을 입력할 수 있습니다!!</Chat>
      <Side>
        {/* side content 영역 */}
        <button
          onClick={() => {
            setTimeout(() => {
              setIsSideOn(!isSideOn)
            }, 100)
          }}>
          사이드 영역 열고 닫기
        </button>
        <SideContent>
          <NaviBar title={'타이틀'} />
          <Charge />
        </SideContent>
      </Side>
    </Content>
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
    tab: '프로필'
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

const Content = styled.section`
  position: relative;
  width: 1210px;
  margin: 2.5vh auto 0 auto;

  & > * {
    height: calc(95vh - 80px);
    transition: width 0.5s ease-in-out;

    @media (max-width: ${WIDTH_TABLET_S}) {
      height: 100vh;
    }
  }

  &.side-off > div:first-child {
    width: calc(100% - 20px);
  }
  &.side-off > div:last-child {
    width: 20px;
  }

  @media (max-width: 1260px) {
    width: 95%;
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 100%;
    margin: 0;
  }
`

//채팅창 레이아웃
const Chat = styled.div`
  /* width: 802px; */
  width: 66.28%;
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 100%;
  }
`
//side영역
const Side = styled.div`
  overflow:hidden;
  position: absolute;
  right:0;
  top:0;
  width: 408px;
  /* min-width: 408px; */
  @media (max-width: ${WIDTH_TABLET_S}) {
    display: none;
  }

  & > button {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%
    width: 20px;
    background: #f2f2f2;
    transform: none;
    text-indent: -9999px;

    &:after {
      display: block;
      margin: 0 auto;
      width: 0; 
      height: 0; 
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-left: 8px solid #757575;
      content: '';
      
    }
  }
`

const SideContent = styled.div`
  padding-left: 20px;
  height: 100%;
`
