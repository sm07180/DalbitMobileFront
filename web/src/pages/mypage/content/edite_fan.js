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
import Recent from './edite_contents/recent'
import GiftMore from './edite_contents/gift_more'
import ListenRecent from './edite_contents/listen_edite'
import BroadMore from './edite_contents/broad_edite'
//---------------------------------------------------------------------------------

//---------------------------------------------------------------------------------
export default (props) => {
  const ctx = useContext(Context)
  //state
  const [title, setTitle] = useState(0)
  const [resetList, setResetList] = useState(-1)
  const [noList, setNoList] = useState(-1)
  //swiper
  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 4
  }

  // case divide
  const createContents = () => {
    switch (title) {
      case 0:
        return <Recent title={title} resetList={resetList} noList={noList} />
      case 1:
        return <GiftMore resetList={resetList} noList={noList} />
      case 2:
        return <ListenRecent resetList={resetList} noList={noList} />
      case 3:
        return <BroadMore resetList={resetList} noList={noList} />
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
    if (ctx.editeToggle === true) {
      ctx.action.confirm({
        callback: () => {
          ctx.action.updateFanEdite(-1)
        },
        cancelCallback: () => {
          if (resetList === -1) {
            setResetList(1)
          } else if (resetList !== -1) {
            setResetList(2)
          }
        },
        msg: '팬 삭제 시 메모도 삭제되며 <br/> 복구가 불가능합니다. <br/> <strong>정말 삭제하시겠습니까?<strong>'
      })
    }
    if (ctx.editeToggle === false) {
      ctx.action.alert({
        callback: () => {
          ctx.action.updateEditeToggle(false)
        },
        msg: '삭제할 팬을 선택해 주세요.'
      })
    }
  }
  return (
    <EditeWrap>
      <Header>
        <div className="category-text">
          팬
          {ctx.fanEdite === false ? (
            <button className="editeBtn" onClick={editeToggle} style={{display: ctx.fanEditeLength < 1 ? 'none' : 'block'}}>
              편집
            </button>
          ) : (
            <button className="editeBtn" onClick={AlertPop} style={{display: ctx.fanEditeLength < 1 ? 'none' : 'block'}}>
              완료
            </button>
          )}
        </div>
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
    title: '선물 많이 받은 순',
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
