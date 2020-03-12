/**
 * @title 라이브탭 컨텐츠 -refresh button
 */
import React, {useState, useContext} from 'react'
import Api from 'context/api'
import {Context} from 'context'
import {BroadCastStore} from 'pages/broadcast/store'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import styled from 'styled-components'
export default props => {
  const context = useContext(Context)
  const store = useContext(BroadCastStore)
  //------------------------------------------------------------------
  const reset = () => {
    store.action.updatecategory('')
    store.action.updateselectchange('전체')
  }
  return (
    <>
      <Wrap>
        <button onClick={reset}></button>
        <p>새로고침</p>
      </Wrap>
    </>
  )
}
//------------------------------------------------------------------
//styled
const Wrap = styled.div`
  display: flex;
  width: 33.33%;
  margin-left: 12px;
  align-items: center;
  & button {
    display: inline-block;
    width: 18px;
    height: 18px;
    background: url(${IMG_SERVER}/images/api/ic_refresh.png) no-repeat center center / cover;
    cursor: pointer;
  }
  & p {
    margin-left: 6px;
    color: #bdbdbd;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
  }
`
