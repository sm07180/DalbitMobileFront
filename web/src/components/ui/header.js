import React from 'react'
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'

// static
import closeBtn from './ic_back.svg'

export default (props) => {
  const history = useHistory()

  const goBack = () => {
    return history.goBack()
  }

  return (
    <Header className="header-wrap">
      <div className="child-bundle">{props.children}</div>
      <img className="close-btn" src={closeBtn} onClick={goBack} />
    </Header>
  )
}

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-bottom: 1px solid #d2d2d2;
  padding: 14px 0;
  box-sizing: border-box;
  margin-bottom: 10px;
  width: calc(100% + 32px);
  margin-left: -16px;
  padding: 12px 16px;
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
    display: block;
    width: 36px;
  }
`
