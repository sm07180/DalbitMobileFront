import React from 'react'
import styled from 'styled-components'
// context
import {COLOR_WHITE} from 'context/color'
// static
import closeBtn from 'components/ui/ic_back.svg'

export default props => {
  const goBack = () => {
    if (document.referrer) {
      window.location.href = document.referrer
    } else {
      window.history.back()
    }
  }

  return (
    <Header>
      <h2 className="child-bundle">{props.children}</h2>
      <img className="close-btn" src={closeBtn} onClick={goBack} />
    </Header>
  )
}

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 12px 16px;
  background: ${COLOR_WHITE};
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
