import React from 'react'
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'
// static
import closeBtn from './static/ic_back.svg'

export default props => {
  const history = useHistory()
  const goBack = () => {
    history.push(`/menu/profile`)
  }

  return (
    <Header>
      <div className="child-bundle">{props.children}</div>
      <div></div>
      <img className="close-btn" src={closeBtn} onClick={goBack} />
    </Header>
  )
}

const Header = styled.div`
  position: relative;
  display: flex;
  width: calc(100% + 32px);
  margin-left: -16px;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #d2d2d2;
  padding: 14px 16px;
  box-sizing: border-box;
  z-index: 1;
  .child-bundle {
    display: flex;
    flex-direction: row;
    align-items: center;

    .category-text {
      color: #000;
      font-size: 18px;
      letter-spacing: -0.45px;
      font-weight: 800;
      text-align: center;
    }
  }

  .close-btn {
    position: absolute;
    left: 6px;
    display: block;
    width: 36px;
  }
`
