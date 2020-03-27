import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'
import {Scrollbars} from 'react-custom-scrollbars'
import {useHistory} from 'react-router-dom'

//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //history
  let history = useHistory()
  //initalize
  const {children} = props
  //ref
  const scrollbars = useRef(null) // 채팅창 스크롤 영역 선택자

  const onUpdate = e => {
    scrollbars.current.children[0].children[0].style.height = `calc(${document.body.clientHeight}px + 17px)`
  }

  return (
    <>
      <Gnb className={context.gnb_visible ? 'on' : 'off'} ref={scrollbars} state={context.gnb_state}>
        <Scrollbars autoHeight autoHide autoHeightMax={'100%'} onUpdate={onUpdate}>
          <Close
            onClick={() => {
              context.action.updateGnbVisible(false)
              history.push(`${history.location.pathname}`)
              document.body.classList.remove('on')
            }}></Close>
          <Wrap>{children}</Wrap>
        </Scrollbars>
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
  background: #fff;
  background: ${props => (props.state == 'menu' ? COLOR_MAIN : '#fff')};
  transition: right 0.5s ease-in-out;
  z-index: 11;

  @media (max-width: ${WIDTH_TABLET_S}) {
  }

  &.on {
    right: 0;
  }

  a {
    display: block;
  }
`

const Close = styled.button`
  position: absolute;
  top: 8px;
  right: 10px;
  width: 40px;
  height: 40px;
  background: url('${IMG_SERVER}/images/api/ic_close.png') no-repeat center center / cover;
  @media (max-width: ${WIDTH_MOBILE_S}) {
    top: 10px;
    right: 8px;
    width: 36px;
    height: 36px;
  }
`

const Wrap = styled.div`
  height: 100%;
`
