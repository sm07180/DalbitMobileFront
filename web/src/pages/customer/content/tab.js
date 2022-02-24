/**
 * @file 모바일/tab.js
 * @brief 고객센터 공통 탭
 *
 */
import React, {useState, useRef, useEffect, useContext} from 'react'
//styled-component
import styled from 'styled-components'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//context
import {Store} from './index'
import {useHistory} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";

export default props => {
  //----------------------------------------------------------------------------
  let history = useHistory()
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const typeTab = history.location.pathname.split('/')[2]

  //info
  const tabInfo = [
    {
      id: 0,
      tab: '공지사항',
      type: 'notice'
    },
    {
      id: 1,
      tab: 'FAQ',
      type: 'faq'
    },
    {
      id: 2,
      tab: '1:1 문의',
      type: 'personal'
    }
    // {
    //   id: 3,
    //   tab: '방송 가이드',
    //   type: 'broadcast_guide'
    // }
  ]

  //makeContents
  const {customHeader, token} = globalState
  const makeContents = () => {
    if (tabInfo === null) return
    return tabInfo.map((list, index) => {
      const {tab, type} = list
      const push = () => {
        if (!token.isLogin && type === 'personal') {
          history.push(`/login`)
        } else {
          history.push(`/customer/${type}`)
          Store().action.updateCode(type)
          Store().action.updatenoticePage('')
        }
      }
      return (
        <button onClick={() => push()} key={index} className={Store().menuCode === type ? 'on' : ''}>
          {tab}
        </button>
      )
    })
  }
  //----------------------------------------------------------------------------
  useEffect(() => {
    if (typeTab === 'faq') {
      Store().action.updateCode('faq')
    } else if (typeTab === '1on1') {
      Store().action.updateCode('personal')
    }
  }, [typeTab])
  return (
    <Wrap>
      <div>{makeContents()}</div>
    </Wrap>
  )
}
//--------------------------------------------------------------------
const Wrap = styled.div`
  /* width: 109%; */
  width: calc(100% + 32px);
  margin-left: -16px;
  & > div {
    display: flex;
    margin-top: -1px;
    border-bottom: 1px solid ${COLOR_MAIN};
    & button {
      flex: 1;
      height: 40px;
      border: 1px solid #d2d2d2;
      border-bottom: 0;
      border-right: none;
      color: ${COLOR_MAIN};
      font-size: 15px;
      letter-spacing: -0.3px;
      &:nth-child(3) {
        border-right: 1px solid #d2d2d2;
      }
    }
    @media (max-width: ${WIDTH_MOBILE}) {
      /* margin-top: 26px; */
    }
    & button.on {
      background-color: ${COLOR_MAIN};
      border: 1px solid ${COLOR_MAIN};
      color: #fff;
      border-right: 0;
    }
    & button.on + button {
      border-left: 0;
    }
  }
`
