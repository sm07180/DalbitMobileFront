/**
 * @file /ranking/content/Figure.js
 * @brief 랭킹 리스트 컴포넌트
 */
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'

export default props => {
  const {url, click, name} = props
  //---------------------------------------------------------------------
  return (
    <>
      {props && (
        <Figure url={url} className="figure" onClick={click}>
          <img src={url} alt={name} />
        </Figure>
      )}
    </>
  )
}
//---------------------------------------------------------------------

const Figure = styled.figure`
  flex-basis: 80px !important;
  width: 80px;
  height: 80px;
  margin: 0 30px 0 10px;
  border-radius: 50%;
  background: url(${props => props.url}) no-repeat center center/ cover;
  img {
    display: none;
  }
`
