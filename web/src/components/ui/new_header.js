import React from 'react'
import styled from 'styled-components'

// static
import closeBtn from './ic_back.svg'

export default (props) => {
  const goBack = () => {
    if (props.goBack) {
      props.goBack()
    } else {
      window.history.back()
    }
  }

  return (
    <Header className="header-wrap">
      <img className="close-btn" src={closeBtn} onClick={goBack} />
      <h1>{props.title}</h1>
    </Header>
  )
}

const Header = styled.header`
  display: flex;
  width: 100%;
  height: 40px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  justify-content: center;

  h1 {
    display: inline-block;
    font-size: 18px;
    font-weight: 800;
    color: #000;
    line-height: 40px;
  }
  .close-btn {
    display: block;
    position: absolute;
    left: 6px;
    width: 36px;
  }
`
