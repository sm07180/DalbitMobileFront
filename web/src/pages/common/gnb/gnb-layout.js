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
          }}></Close>
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

const Close = styled.button`
  position: absolute;
  top: 16px;
  right: 10px;
  width: 48px;
  height: 48px;
  background: url('https://devimage.dalbitcast.com/images/api/ic_close.png') no-repeat center center / cover;
`

const Wrap = styled.div`
  height: 100%;
`
