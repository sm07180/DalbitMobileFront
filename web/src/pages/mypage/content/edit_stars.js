import React, {useEffect, useState, useContext, useRef, useReducer} from 'react'
import qs from 'query-string'
//styled
import styled from 'styled-components'
//context
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import {COLOR_MAIN} from 'context/color'
import Api from 'context/api'
import {Context} from 'context'
//scroll
import {Scrollbars} from 'react-custom-scrollbars'
import Swiper from 'react-id-swiper'
//components

import Header from '../component/header'
import StarManage from './edite_star/starmanage'

//---------------------------------------------------------------------------------

//---------------------------------------------------------------------------------
export default (props) => {
  const ctx = useContext(Context)
  //state
  const [title, setTitle] = useState(2)
  //swiper
  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 4
  }

  // tabs
  const tabLocation = (id) => {
    setTitle(id)
    ctx.action.updateFanTab(id)
  }
  return (
    <EditeWrap>
      <Header title="스타 관리" />
      <div className="tabContainer">
        <Swiper {...swiperParams}>
          {tabArry.map((item, idx) => {
            return (
              <button
                key={item.id}
                onClick={() => tabLocation(item.id)}
                className={title === item.id ? 'tabList tabList--active' : 'tabList'}>
                {item.title}
              </button>
            )
          })}
        </Swiper>
      </div>
      <StarManage sortNum={title} />
    </EditeWrap>
  )
}

//styled
const EditeWrap = styled.div`
  .header-wrap {
    position: relative;
    .editeBtn {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 58px;
      height: 32px;
      border-radius: 16px;
      background-color: #FF3C7B;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: -0.35px;
      text-align: center;
      color: #ffffff;
    }
  }

  .tabContainer {
    width: 100%;

    height: 52px;
    padding: 12px 0px 8px 16px;
    box-sizing: border-box;
  }
  .tabList {
    width: auto !important;
    padding: 6px 13px;
    box-sizing: border-box;
    border-radius: 12px;
    background-color: #fff;
    font-size: 14px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.43;
    letter-spacing: -0.35px;
    text-align: left;
    color: #000000;

    &--active {
      color: #fff;
      background-color: #FF3C7B;
    }
  }
`
//Arr
const tabArry = [
  {
    id: 2,
    title: '선물 보낸 순',
    value: 'gift'
  },
  {
    id: 1,
    title: '방송 들은 순',
    value: 'broad'
  },
  {
    id: 3,
    title: '최근 청취 순',
    value: 'listen'
  },

  {
    id: 0,
    title: '등록 순',
    value: 'new'
  }
]
