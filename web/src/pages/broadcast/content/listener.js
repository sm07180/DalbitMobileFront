/**
 * @title 방송방화면
 *
 */
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

//pages

// import Guide from ' pages/common/layout/guide.js'
<<<<<<< HEAD
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
=======
>>>>>>> d2dcd2d12566c3de4b3edd7231b8464e40862ed5

export default props => {
  //context
  const context = new useContext(Context)

  useEffect(() => {
    //방송방 페이지는 footer없음.
    context.action.updateState({footer: false})
    return () => {
      context.action.updateState({footer: true})
    }
  }, [])

  return (
    <Content>
      <Chat>{/* 채팅방 영역 */}여기서는 채팅을 입력할 수 있습니다!!</Chat>
      <Side>{/* side content 영역 */}이곳은 사이드 컨텐츠 영역으로 디테일한 방송 정보 등을 볼 수 있습니다!!!!!! </Side>
    </Content>
  )
}

//---------------------------------------------------------------------
//styled

const Content = styled.section`
  display: flex;
  width: 1210px;
  margin: 2.5vh auto 0 auto;

  & > * {
    height: calc(94vh - 80px);
  }
`

const Chat = styled.div`
  /* width: 802px; */
  width: 66.28%;
  background: #dcceff;
`

const Side = styled.div`
  width: 408px;
  min-width: 408px;
  background: #8556f6;
`
