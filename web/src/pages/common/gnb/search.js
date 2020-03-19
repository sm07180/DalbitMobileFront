import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {Context} from 'context'
import API from 'context/api'

//context
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

//component

export default props => {
  const context = useContext(Context)

  const ClickLink = async () => {
    if (search === '') {
      return
    }

    props.history.push(`/search?query=${search}`)
    context.action.updateGnbVisible(false)
  }
  const [search, setSearch] = useState('')
  const handleChange = event => {
    setSearch(event.target.value)
  }
  const searchOnKeyDown = e => {
    const {currentTarget} = e
    if (currentTarget.value === '') {
      return
    }
    if (e.keyCode === 13) {
      props.history.push(`/search?query=${search}`)
      context.action.updateGnbVisible(false)
    }
  }
  //---------------------------------------------------------------------
  //context

  return (
    <>
      <Gnb className={context.gnb_visible ? 'on' : 'off'}>
        <Close
          onClick={() => {
            context.action.updateGnbVisible(false)
          }}></Close>
        <SearchWrap>
          <input type="text" placeholder="인기 DJ, 꿀보이스, 나긋한 목소리 등 검색어를 입력해 보세요" value={search} onChange={handleChange} onKeyDown={searchOnKeyDown} />
          <button onClick={ClickLink}></button>
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
  width: 802px;
  height: 64px;
  transform: translate(-50%, -50%);
  @media (max-width: ${WIDTH_PC_S}) {
    top: calc(50% + 28px);
    width: 91.11%;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    top: calc(50% + 20px);
  }
  & input {
    display: block;
    width: 100%;
    height: 100%;
    padding-left: 20px;
    border: 1px solid #fff;
    box-sizing: border-box;
    color: white;
    font-size: 16px;
    letter-spacing: -0.4px;
    background-color: #8556f6;
    transform: skew(-0.03deg);
    position: relative;
    @media (max-width: ${WIDTH_MOBILE}) {
      padding-right: 48px;
    }
  }
  & input::placeholder {
    opacity: 0.3;
    color: white;
    font-size: 16px;
    letter-spacing: -0.4px;
  }

  & button {
    position: absolute;
    top: 50%;
    right: 8px;
    width: 48px;
    height: 48px;
    background: url('${IMG_SERVER}/images/api/search6.png') no-repeat center center / cover;
    transform: translateY(-50%);
    cursor: pointer;
    @media (max-width: ${WIDTH_MOBILE}) {
      width: 36px;
      height: 36px;
    }
  }
`
const Close = styled.button`
  position: absolute;
  top: 16px;
  right: 10px;
  width: 48px;
  height: 48px;
  background: url('${IMG_SERVER}/images/api/ic_close.png') no-repeat center center / cover;
  @media (max-width: ${WIDTH_MOBILE}) {
    top: 10px;
    right: 8px;
    width: 36px;
    height: 36px;
  }
`
