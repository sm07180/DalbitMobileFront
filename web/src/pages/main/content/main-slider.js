/**
 * @file /content/context-list.js
 * @brief 메인 라이브, 캐스트 리스트 component
 */
import React from 'react'
import styled from 'styled-components'

//context
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'Context/color'

//components

export default props => {
  return (
    <Content>
      <MainSlider>
        <h5>오후 잠을 깨워줄 상큼한 목소리 들어요</h5>
      </MainSlider>
    </Content>
  )
}

//---------------------------------------------------------------------
//styled

const Content = styled.section``

const MainSlider = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 658px;
  text-align: center;

  &::before {
    display: inline-block;
    width: 920px;
    height: 920px;
    margin-top: -131px;
    background-color: ${COLOR_MAIN};
    border-radius: 50%;
    content: '';
  }
`
