import React, {useEffect, useState} from 'react'
import styled from 'styled-components'

// component
import Header from '../component/header.js'

// static
import Home from '../static/ic_home.svg'
import Setting from '../static/ic_setting.svg'

// import

export default props => {
  const navList = [
    {value: 'broadcast', txt: '방송하기', img: ''},
    {value: 'mlive', txt: '라이브'},
    {value: 'ranking', txt: '랭킹'},
    {value: 'store', txt: '스토어'},
    {value: 'event', txt: '이벤트'},
    {value: 'customer', txt: '고객센터'}
  ]

  return (
    <div>
      <Header>
        <img src={Home} />
        <img src={Setting} />
      </Header>
      <div>
        {/* {navList.map(data => {
          const {value, txt} = data
          return (
            <NavBtnWrap>
              <button className="btn" />
              <div className="text">{txt}</div>
            </NavBtnWrap>
          )
        })} */}
      </div>
    </div>
  )
}

const NavBtnWrap = styled.div`
  display: inline-block;
  margin: 0 16px;

  .btn {
    display: block;
    width: 68px;
    height: 68px;
    border-radius: 26px;
    background-color: #eee;
  }
`
