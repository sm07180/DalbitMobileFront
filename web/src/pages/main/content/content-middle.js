/**
 * @file content-bottom.js
 * @brief 메인페이지-중간컨텐츠wrap
 */
import React from 'react'
import styled from 'styled-components'
import LiveSlider from './slider/live-slider'
import {DEVICE_MOBILE} from 'Context/config'

export default () => {
  const LiveSliderInfo = [
    {
      id: '1',
      title: '🖤큐트 목평이 뭔지 보여줄게🖤',
      url: 'http://admin.img.afreecatv.com/hotissue_vod/2020/01/07/81865e144e65ad3c4.jpg',
      name: '𐄛비 비˚₊*̥ 𝓑.ﻬ',
      people: '1,860',
      like: '5,200',
      icon: 'BEST'
    },
    {
      id: '2',
      title: '[고음질] Pop PlayList📻 ',
      url: 'http://admin.img.afreecatv.com/hotissue_vod/2020/01/07/39825e144df700f2b.jpg',
      name: '은잉*🎖*',
      people: '1,230',
      like: '4,110',
      icon: 'HOT'
    },
    {
      id: '3',
      title: '[생] 남여부족) 소개팅하러와용~빨리~언넝~ !',
      url: 'http://admin.img.afreecatv.com/thema_group_vod/2020/01/03/84135e0f042b3f58a.jpg',
      name: '째니',
      people: '1,092',
      like: '8,999',
      icon: 'NEW'
    },
    {
      id: '4',
      title: '[생] 못부름) 신청곡 받고 부릅니다🔈!',
      url: 'http://admin.img.afreecatv.com/thema_group_vod/2019/12/31/42835e0ae4c62c1db.jpg',
      name: '갓 선 미 💖｡・*',
      people: '1,013',
      like: '1,818',
      icon: 'NEW'
    },
    {
      id: '5',
      title: '너에게 잠겨 ❤︎',
      url: 'http://admin.img.afreecatv.com/thema_group_vod/2020/01/07/55775e144e3953c18.jpg',
      name: 'ⅅ℃ 윰⠀⠀⠀⠀⠀⠀⠀⠀⠀𝑜𝑛 _Ꮆ',
      people: '1,002',
      like: '8,212',
      icon: 'STAR'
    },
    {
      id: '6',
      title: '자우림 ♥',
      url: 'http://admin.img.afreecatv.com/thema_group_vod/2020/01/07/73985e144d8e01ce0.jpg',
      name: '📿ѕтя.좐 *̣̥',
      people: '772',
      like: '1,212',
      icon: 'HOT'
    },
    {
      id: '7',
      title: '기분좋은 아침, 달콤 신청곡 라디오',
      url: 'http://iflv14.afreecatv.com/save/afreeca/station/2019/1230/11/thumb/1577672974671669_L_8.jpg',
      name: '볼빵°.°',
      people: '615',
      like: '5,409',
      icon: 'VIP'
    },
    {
      id: '8',
      title: '가야금 , ㅎㅎㅎㅎㅎㅎㅎㅎ 💌',
      url: 'http://admin.img.afreecatv.com/thema_group_vod/2020/01/05/24985e11c9b1a63ce.jpg',
      name: '비익연리',
      people: '599',
      like: '5,111',
      icon: 'NEW'
    },
    {
      id: '9',
      title: '존예보스 💿 Music Radio 📻',
      url: 'http://admin.img.afreecatv.com/thema_group_vod/2020/01/07/23745e144e84e8f72.jpg',
      name: '라온제나☆°',
      people: '329',
      like: '9,212',
      icon: 'BEST'
    },
    {
      id: '10',
      title: '제목없는 방입니다.',
      url: 'http://admin.img.afreecatv.com/thema_group_vod/2020/01/02/94445e0dbacda8bec.jpg',
      name: '공신:강성태',
      people: '222',
      like: '3,212',
      icon: 'NEW'
    }
  ]
  return (
    <>
      <ContentMiddle>
        <LiveSlider Info={LiveSliderInfo}></LiveSlider>
      </ContentMiddle>
    </>
  )
}

const ContentMiddle = styled.section`
  width: 100%;
  height: 300px;
  background-color: #fff;
  padding: 10px 2rem;
  box-sizing: border-box;
  @media (max-width: ${DEVICE_MOBILE}) {
    height: 340px;
  }
  @media (max-width: 420px) {
    padding: 10px 1rem;
  }
`
