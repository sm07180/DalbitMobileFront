import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

//component
import Gnb from './gnb-layout'

export default props => {
  //---------------------------------------------------------------------

  return (
    <>
      <Gnb>
        <p>나는 기본 메뉴입니다. 나는 레이아웃의 차일드에요.</p>
      </Gnb>
    </>
  )
}

//---------------------------------------------------------------------
//styled
