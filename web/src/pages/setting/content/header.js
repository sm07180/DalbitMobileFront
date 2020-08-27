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
    <div className="header-wrap">
      <div className="child-bundle">{props.children}</div>
      <button className="close-btn" onClick={goBack}>
        <img src={closeBtn} alt="뒤로가기" />
      </button>
    </div>
    // <Header>
    //   <div className="child-bundle">{props.children}</div>
    //   <div></div>
    //   <img className="close-btn" src={closeBtn} onClick={goBack} />
    // </Header>
  )
}

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #d2d2d2;
  box-sizing: border-box;
  margin-bottom: 10px;
  width: calc(100% + 32px) !important;
  margin-left: -16px !important;
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
    position: absolute;
    left: 0;
    display: block;
    width: 36px;
  }
`
