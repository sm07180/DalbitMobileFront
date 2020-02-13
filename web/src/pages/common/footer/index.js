/**
 * @title footer
 */
import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
import ToggleBtn from './toggle-footer'
import {Context} from 'context'
//pages
//---------------------------------------------------------------------
export default props => {
  //context
  const context = new useContext(Context)
  const [show, setShow] = useState(false)
  //console.log(props.Ftype)
  const showing = () => {
    if (props.Ftype === 'mainFooter') {
      setShow(true)
    } else {
      setShow(false)
    }
  }

  useEffect(() => {
    showing()
  }, [])

  return (
    <Footer className={context.state.footer ? 'on' : 'off'}>
      {show && (
        <Menu>
          <a href="/guide">회사 소개</a>
          <a href="#">서비스 소개</a>
          <a href="#">인재채용</a>
          <a href="#">개인정보 처리방침</a>
          <a href="#">서비스 이용약관</a>
          <a href="#">청소년 보호정책</a>
          <a href="#">운영정책</a>
        </Menu>
      )}
      <Info>
        <ToggleBtn Ttype="on" />
      </Info>
    </Footer>
  )
}

//---------------------------------------------------------------------
const Footer = styled.footer`
  display: block;
  padding-bottom: 116px;
  text-align: center;

  &.off {
    display: none;
  }
`
const Info = styled.ul`
  font-size: 12px;

  li {
    display: inline-block;
    font-size: 14px;
    line-height: 28px;
    color: #757575;
    span {
      padding-right: 10px;
      color: #bdbdbd;
    }
  }
  li + li {
    margin-left: 20px;
  }
`
const Menu = styled.div`
  margin-bottom: 63px;
  border-top: 1px solid #8556f6;
  border-bottom: 1px solid #e0e0e0;
  padding: 18px 0;
  a {
    display: inline-block;
    margin-right: 10px;
    padding: 5px;
    color: #8556f6;
    font-size: 14px;
  }
`

const Logo = styled.div`
  margin: 70px 0 20px 0;
`
const Copyright = styled.p`
  color: #bdbdbd;
  font-size: 14px;
`
