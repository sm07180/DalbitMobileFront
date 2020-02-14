/**
 * @title
 */
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
//pages

export default props => {
  const livemap = liveInfo.map((live, index) => {
    const {} = live
    return (
      <>
        <LiveList key={index}>
          <ImgWrap></ImgWrap>
          <InfoWrap></InfoWrap>
        </LiveList>
      </>
    )
  })
  return <></>
}
const LiveList = styled.div`
  width: 362px;
`
const ImgWrap = styled.div`
  width: 362px;
`
const InfoWrap = styled.div`
  width: 362px;
`
