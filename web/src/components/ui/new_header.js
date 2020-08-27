import React from 'react'
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'

// static
import closeBtn from './ic_back.svg'

export default (props) => {
  const history = useHistory()

  let {goBack} = props
  if (goBack === undefined) {
    goBack = () => {
      return history.goBack()
    }
  }

  return (
    <div className={`header-wrap ${props.title.length > 18 && 'letter'}`}>
      <div className="child-bundle">{props.title}</div>
      <button className="close-btn" onClick={goBack}>
        <img src={closeBtn} alt="뒤로가기" />
      </button>
    </div>
    // <Header className={`header-wrap ${props.title.length > 18 && 'letter'}`}>
    //   <img className="close-btn" src={closeBtn} onClick={goBack} />
    //   <h1>{props.title}</h1>
    // </Header>
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

  &.letter h1 {
    padding-left: 10px;
    letter-spacing: -1.2px;
  }
  .close-btn {
    display: block;
    position: absolute;
    left: 6px;
    width: 36px;
  }
`
