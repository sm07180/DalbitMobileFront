import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'

//component

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = new useContext(Context)
  return (
    <>
      <Gnb className={context.gnb_visible ? 'on' : 'off'}>
        <Close
          onClick={() => {
            context.action.updateGnbVisible(false)
          }}>
          닫기
        </Close>
        <p>나는 찾기입니다. 나는 레이아웃이 달라요 !!</p>
      </Gnb>
    </>
  )
}

//---------------------------------------------------------------------
//styled

const Gnb = styled.div`
  overflow: hidden;
  position: fixed;
  top: -144px;
  width: 100%;
  height: 144px;
  background: ${COLOR_MAIN};
  z-index: 11;
  transition: top 0.5s ease-in-out;
  &.on {
    top: 0;
  }
`

const Close = styled.button``
