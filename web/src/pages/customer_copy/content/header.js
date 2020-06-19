import React, {useEffect, useContext} from 'react'
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'
// static
import closeBtn from './static/ic_back.svg'
import {Store} from './index'
import {Context} from 'context'
export default props => {
  const history = useHistory()
  const context = useContext(Context)

  const goBack = () => {
    if (context.noticeIndexNum.split('/')[3] !== undefined) {
      window.location.href = '/'
    } else {
      window.history.back()
    }
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
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #d2d2d2;
  margin-right: 16px;
  padding: 12px 16px;
  box-sizing: border-box;
  background-color: white;
  z-index: 1;
  .child-bundle {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 16px;
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
