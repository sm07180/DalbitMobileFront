/**
 * @file content-bottom.js
 * @brief 메인페이지-중간컨텐츠wrap
 */
import React from 'react'
import styled from 'styled-components'
import ChoiceSlider from './slider/choice-slider'
import RankSlider from './slider/rank-slider'

export default () => {
  const ChoiceInfo = [
    {
      id: '1',
      title: '[생]300일, 감사합니다 노래해요!',
      url: 'http://admin.img.afreecatv.com/thema_group_vod/2020/01/03/48425e0f04ff04ccb.jpg',
      name: '노래하는딩D͙ɪɴɢ♡̷ 300일❣️',
      people: '1,860',
      like: '5,200'
    },
    {
      id: '2',
      title: '💕💕 버 프 녀 💕💕',
      url: 'http://iflv14.afreecatv.com/clip/20191212/812/73baff05-de14-4fa2-9474-5b2548f4693c/93812_l.jpg',
      name: '핀엘',
      people: '1,230',
      like: '4,110'
    },
    {
      id: '3',
      title: '스푼가왕 예선전🎶 마지막 예선🔊!!!!!',
      url: 'http://admin.img.afreecatv.com/thema_group_vod/2020/01/05/32345e11c8d469853.jpg',
      name: '속삭이는원이',
      people: '1,092',
      like: '8,999'
    },
    {
      id: '4',
      title: '[생] 그대와 영원히 !',
      url: 'http://admin.img.afreecatv.com/thema_group_vod/2020/01/01/77365e0c77dad011e.jpg',
      name: '𐂴백설 Ꮆᴴᴺ',
      people: '1,013',
      like: '1,818'
    },
    {
      id: '5',
      title: '[생] 신입3일차)저도..잘나가고싶습니다🥺',
      url: 'http://iflv14.afreecatv.com/save/afreeca/station/2020/0104/02/thumb/1578074215240253_L_8.jpg',
      name: '🍯허밍보이스🐝',
      people: '772',
      like: '5,212'
    }
  ]
  const RankInfo = [
    {
      id: '1',
      url: 'https://kr-cdn.spooncast.net/casts/u/q3jv9uzBXPql/0955a7dd-7d52-4376-88a1-594eac1e6d95-M.jpg',
      name: '리야',
      gold: '9,860',
      like: '5,200'
    },
    {
      id: '2',

      url: 'https://kr-cdn.spooncast.net/casts/0/vOAG40SDdxmmr/a8c3331b-3421-45f5-8b01-7ab13f31fd2a-M.jpg',
      name: '베베베베',
      gold: '5,230',
      like: '4,110'
    },
    {
      id: '3',

      url: 'https://kr-cdn.spooncast.net/casts/n/Ja2n4nTe4xXxJ/7685cd8c-1019-4906-9a00-a874a2e6aaa8-M.jpg',
      name: '메 린🌊',
      gold: '4,092',
      like: '8,999'
    },
    {
      id: '4',

      url: 'https://kr-cdn.spooncast.net/casts/f/Gkn6JfnkDXE3/ad3a66c5-6079-4091-a15e-1cac6bee01aa-M.jpg',
      name: '∴ 한 아 연 ∵',
      gold: '3,013',
      like: '1,818'
    },
    {
      id: '5',

      url: 'https://kr-cdn.spooncast.net/casts/5/m08QZ5c4wJAzb/d7174049-d79e-44de-823a-ff4530f492e9-M.jpg',
      name: '새 벽 ☆.ﾟ"',
      gold: '2,974',
      like: '5,212'
    }
  ]
  return (
    <>
      <ContentTop>
        <ChoiceSlider Info={ChoiceInfo}></ChoiceSlider>
        <RankSlider Info={RankInfo}></RankSlider>
      </ContentTop>
    </>
  )
}

const ContentTop = styled.section`
  width: 100%;
  height: 300px;
  background-color: #fff;
  padding: 10px 20px;
  box-sizing: border-box;
`
