/**
 * @file /ranking/content/Figure.js
 * @brief 랭킹 리스트 컴포넌트
 */
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

export default props => {
  const context = useContext(Context)
  const {url, name, memNo, link} = props
  //---------------------------------------------------------------------

console.log(props)

  return (
    <>
      {props && (
        <Figure
          url={url}
          className="figure"
          onClick={() => {
            window.location.href = link
          }}>
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
  cursor: pointer;
  img {
    display: none;
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    flex-basis: 59px !important;
    width: 59px;
    height: 59px;
    margin: 0 12px 0 0;
  }
`
