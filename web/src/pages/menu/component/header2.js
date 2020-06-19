import React from 'react'
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'
// static
import closeBtn from '../static/ic_close.svg'

export default props => {
  const history = useHistory()
  const goBack = () => {
    window.location.href = '/'
  }

  return (
    <Header className="header-wrap">
      <div className="child-bundle">{props.children}</div>
      <div></div>
      <img className="close-btn" src={closeBtn} onClick={goBack} />
    </Header>
  )
}

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #d2d2d2;
  box-sizing: border-box;
  /* width: calc(100% + 32px); */
  /* margin-left: -16px; */
  padding: 6px 16px;

  .child-bundle {
    display: flex;
    flex-direction: row;
    align-items: center;

    .category-text {
      color: #000;
      font-size: 18px;
      letter-spacing: -0.45px;
      font-weight: 800;
    }
  }

  .close-btn {
    display: block;
    width: 36px;
  }
`
