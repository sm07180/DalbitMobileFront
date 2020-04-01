import React from 'react'
import styled from 'styled-components'
import {NavLink} from 'react-router-dom'

//layout
import {WIDTH_PC} from 'context/config'

export default props => {
  const {list} = props

  return (
    <Navigation>
      {list.map((bundle, index) => {
        const {type, txt} = bundle
        return (
          <NavLink to={`/mypage/${type}`} activeClassName="active" key={index}>
            <TabText>{txt}</TabText>
          </NavLink>
        )
      })}
    </Navigation>
  )
}

const TabText = styled.div`
  color: #8556f6;
  cursor: pointer;
`

const Navigation = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #8556f6;

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 14.285%;
    height: 48px;
    box-sizing: border-box;
    border-top: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    min-width: 100px;
    box-sizing: border-box;

    &:first-child {
      border-left: 1px solid #e0e0e0;
    }

    &.active {
      border-top: 1px solid #8556f6;
      border-left: none;
      border-right: none;

      background-color: #8556f6;
      & > div {
        color: #fff;
      }
    }
  }
`
