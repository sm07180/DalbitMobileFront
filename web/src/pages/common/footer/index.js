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
  const context = useContext(Context)
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
    <Footer className={context.state.isOnCast ? 'on-cast' : 'off-cast'}>
      {show && (
        <Menu>
          {/* <button
            onClick={() => {
              context.action.alert({
                msg: `준비중입니다.`
              })
            }}>
            서비스 소개
          </button> */}
          <button
            onClick={() => {
              context.action.updatePopup('TERMS', 'service')
            }}>
            서비스 이용약관
          </button>
          <button
            onClick={() => {
              context.action.updatePopup('TERMS', 'privacy')
            }}>
            개인정보 취급방침
          </button>
          <button
            onClick={() => {
              context.action.updatePopup('TERMS', 'youthProtect')
            }}>
            청소년 보호정책
          </button>
          <button
            onClick={() => {
              context.action.updatePopup('TERMS', 'operating')
            }}>
            운영정책
          </button>
          {/* <button
            onClick={() => {
              context.action.updatePopup('TERMS', 'maketing')
            }}>
            마케팅 수신 동의약관
          </button>
          <button>서비스 SNS 채널</button> */}
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
  position: relative;
  display: block;
  padding-bottom: 116px;
  background: #fff;
  text-align: center;

  &.on-cast {
    display: none;
  }
`
const Info = styled.ul`
  font-size: 12px;

  li {
    display: inline-block;
    font-size: 14px;
    line-height: 28px;
    color: #bdbdbd;
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
  button {
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
