import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'

//component

export default props => {
  const [search, setSearch] = useState('')
  const handleChange = event => {
    setSearch(event.target.value)
  }
  //---------------------------------------------------------------------
  //context
  const context = new useContext(Context)
  return (
    <>
      <Gnb className={context.gnb_visible ? 'on' : 'off'}>
        <Close
          onClick={() => {
            context.action.updateGnbVisible(false)
          }}></Close>
        <SearchWrap>
          <input type="text" placeholder="인기 DJ, 꿀보이스, 나긋한 목소리 등 검색어를 입력해 보세요" value={search} onChange={handleChange} />
        </SearchWrap>
      </Gnb>
    </>
  )
}

//---------------------------------------------------------------------
//styled

const Gnb = styled.div`
  overflow: hidden;
  position: fixed;
  top: -144px;
  width: 100%;
  height: 144px;
  background: ${COLOR_MAIN};
  z-index: 11;
  transition: top 0.5s ease-in-out;
  &.on {
    top: 0;
  }
`

const SearchWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 41.87%;
  height: 64px;
  transform: translate(-50%, -50%);
  & input {
    display: block;
    width: 100%;
    height: 100%;
    padding-left: 20px;
    border: 1px solid #fff;
    box-sizing: border-box;
    background-color: #8556f6;
    transform: skew(-0.03deg);
    position: relative;
  }
  & input::placeholder {
    opacity: 0.3;
    color: white;
    font-size: 16px;
    letter-spacing: -0.4px;
  }
  & input:focus {
    color: white;
    font-size: 16px;
    letter-spacing: -0.4px;
  }
  &:after {
    position: absolute;
    top: 50%;
    right: 0;
    width: 48px;
    height: 48px;
    background: url('https://devimage.dalbitcast.com/images/api/search6.png') no-repeat center center / cover;
    transform: translateY(-50%);
    content: '';
    cursor: pointer;
  }
`
const Close = styled.button`
  position: absolute;
  top: 16px;
  right: 10px;
  width: 48px;
  height: 48px;
  background: url('https://devimage.dalbitcast.com/images/api/ic_close.png') no-repeat center center / cover;
`
