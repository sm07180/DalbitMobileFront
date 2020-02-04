import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = new useContext(Context)
  //initalize
  const {children} = props

  return (
    <>
      <Gnb className={context.gnb_visible ? 'on' : 'off'}>
        <Close
          onClick={() => {
            context.action.updateGnbVisible(false)
          }}>
          닫기
        </Close>
        <Wrap>{children}</Wrap>
      </Gnb>
    </>
  )
}

//---------------------------------------------------------------------
//styled

const Gnb = styled.div`
  /* pc media query */
  overflow: hidden;
  position: fixed;
  top: 0;
  right: -320px;
  width: 320px;
  height: 100%;
  padding: 0;
  border-right: 1px solid #ccc;
  background: #8555f6;
  transition: right 0.5s ease-in-out;
  z-index: 11;

  &.on {
    right: 0;
  }

  a {
    display: block;
  }
`

const Close = styled.button``

const Wrap = styled.div``
