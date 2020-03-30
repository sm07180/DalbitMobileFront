import React from 'react'
import styled from 'styled-components'

// static
import closeBtn from '../static/ic_close.svg'

export default props => {
  const goBack = () => {
    window.history.back()
  }

  return (
    <Header>
      <div className="child-bundle">{props.children}</div>
      <img className="close-btn" src={closeBtn} onClick={goBack} />
    </Header>
  )
}

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #d2d2d2;
  padding: 6px 0;
  box-sizing: border-box;

  .child-bundle {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .close-btn {
    display: block;
    width: 36px;
  }
`
