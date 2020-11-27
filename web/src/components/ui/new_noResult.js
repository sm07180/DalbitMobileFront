import React from 'react'
import styled from 'styled-components'

import NoResultIcon from './ic_noResult.svg'

export default function NoResult(props) {
  const {type, text, height} = props
  return (
    <ResultWrap>
      <div className="noResultWrap" style={height ? {minHeight: `${height}px`} : {minHeight: '300px'}}>
        <span className={`${type === 'default' ? 'noResult' : ''}`}>{text}</span>
      </div>
    </ResultWrap>
  )
}

const ResultWrap = styled.div`
  width: 100%;
`
