import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {SecssionStore} from '../store'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import Api from 'context/api'
import {Context} from 'context'
//components
import Exit from './exit'
import Header from 'components/ui/new_header.js'

//
const Index = (props) => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const store = useContext(SecssionStore)
  Index.store = store
  //---------------------------------------------------------------------
  return (
    <>
      <Header title="회원탈퇴" />
      <Exit />
    </>
  )
}
export default Index
//---------------------------------------------------------------------
/**
 * @title 스토어객체
 */
export const Store = () => {
  return Index.store
}
