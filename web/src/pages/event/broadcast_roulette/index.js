import React from 'react'
import styled from 'styled-components'
import {IMG_SERVER} from 'context/config'
import Header from 'components/ui/new_header'

export default function broadRouletteEvent() {
  return (
    <Content>
      <Header title="룰렛 게임 가이드" />

      <Content id="broadRouletteEventPage">
        <img src={`${IMG_SERVER}/event/broad_roulette/210308/visual.png`} alt="방송방 룰렛 게임 OPEN" />
        <img
          src={`${IMG_SERVER}/event/broad_roulette/210308/content_img01.png`}
          alt="dj님! 우측 하단 더보기 메뉴에서 미니게임 아이콘을 선택해주세요. 룰렛 게임을 선택해주세요!"
        />
        <img
          src={`${IMG_SERVER}/event/broad_roulette/210308/content_img02.png`}
          alt="룰렛 설정 창에서 금액을 설정해주세요! 룰렛 옵션을 작성해주세요. 2개부터 6개까지 등록이 가능합니다! 설정을 완료하면 화면 상단에
          룰렛 아이콘이 생겨요!"
        />

        <img
          src={`${IMG_SERVER}/event/broad_roulette/210308/content_img03.png`}
          alt="설정을 완료하면 화면 상단에
          룰렛 아이콘이 생겨요! 상단 룰렛을 선택하면
          화면 중앙에 돌림판이 나타납니다! "
        />
        <div className="text">※다른 사람이 룰렛을 돌릴 경우에는 중복해서 돌릴 수 없습니다.</div>
        <img
          src={`${IMG_SERVER}/event/broad_roulette/210308/content_img04.png`}
          alt=" 이제 GO를 눌러 결과를 확인하세요! 채팅 영역에도 당첨 결과가 확인됩니다~"
        />

        <img
          src={`${IMG_SERVER}/event/broad_roulette/210308/content_img05.png`}
          alt=" 콘텐츠에 힘이 되기를! 앞으로 유익하고 재밌게 이용해주셨으면 좋겠습니다! 오늘도 달라! 감사합니다."
        />
      </Content>
    </Content>
  )
}

const Content = styled.div`
  position: relative;
  img {
    width: 100%;
  }
  .text {
    text-indent: -9999px;
    position: absolute;
    left: -9999px;
    top: -9999px;
  }
  .btnBack {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 40px;
    height: 40px;
  }
`
