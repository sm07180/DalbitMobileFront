import React from 'react'
import styled from 'styled-components'
export default props => {
  //const {url} = item
  return (
    <>
      <Wrap>{props.children}</Wrap>
    </>
  )
}

const Wrap = styled.div`
  width: 100%;
  height: 190px;
  margin-bottom: 26px;
`
