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

  //---------------------------------------------------------------------
  return (
    <Layout {...props}>
      {/* 메인 최상단 슬라이드 */}
      <MainSlider />
      {/* 스타 랭킹 영역 */}
      <RangkingWrap>
        <StarRangking />
      </RangkingWrap>
      {/* 인기 DJ 영역 */}
      <PopularWrap>
        <PopularDJ />
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
