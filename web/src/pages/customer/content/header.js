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
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #d2d2d2;
  padding: 14px 0;
  box-sizing: border-box;
  margin-bottom: 10px;
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
    left: 0;
    display: block;
    width: 36px;
  }
`
