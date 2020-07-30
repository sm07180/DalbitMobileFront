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
import Recent from './edite_star/recent'
import GiftMore from './edite_star/gift_more'
import ListenRecent from './edite_star/listen_edite'
import BroadMore from './edite_star/broad_edite'
//---------------------------------------------------------------------------------

//---------------------------------------------------------------------------------
export default (props) => {
  const ctx = useContext(Context)
  //state
  const [title, setTitle] = useState(0)
  //swiper
  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 4
  }

  // case divide
  const createContents = () => {
    switch (title) {
      case 0:
        return <Recent title={title} />
      case 1:
        return <GiftMore />
      case 2:
        return <ListenRecent />
      case 3:
        return <BroadMore />
      default:
        break
    }
  }
  // tabs
  const tabLocation = (id) => {
    setTitle(id)
    ctx.action.updateFanTab(id)
  }
  const editeToggle = () => {
    if (ctx.fanEdite === -1) {
      ctx.action.updateFanEdite(false)
    } else {
      ctx.action.updateFanEdite(true)
    }
  }
  const AlertPop = () => {
    ctx.action.confirm({
      callback: () => {
        ctx.action.updateFanEdite(-1)
      },
      msg: '팬 삭제 시 메모도 삭제되며 <br/> 복구가 불가능합니다. <br/> <strong>정말 삭제하시겠습니까?<strong>'
    })
  }
  return (
    <EditeWrap>
      <Header>
        <div className="category-text">스타</div>
      </Header>
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

      {createContents()}
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
      background-color: #632beb;
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
      background-color: #632beb;
    }
  }
`
//Arr
const tabArry = [
  {
    id: 0,
    title: '최신 순',
    value: 'new'
  },
  {
    id: 1,
    title: '선물 많이 보낸 순',
    value: 'gift'
  },
  {
    id: 2,
    title: '최근 청취 순',
    value: 'listen'
  },
  {
    id: 3,
    title: '방송 많이 들은 순',
    value: 'broad'
  }
]