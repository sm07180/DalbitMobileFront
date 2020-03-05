/**
 * @title 클릭 event
 */
import React, {useEffect, useState, useContext} from 'react'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import styled from 'styled-components'
import {BroadCastStore} from 'pages/broadcast/store'
import Api from 'context/api'
import {Context} from 'context'
const sc = require('context/socketCluster')

export default props => {
  const store = useContext(BroadCastStore)
  const context = useContext(Context)
  let selectlistener = ''
  let res = ''

  async function broadManager(type, obj) {
    const methodType = type === 1 ? 'POST' : 'DELETE'
    const res = await Api.broad_manager({
      data: {
        roomNo: store.roomInfo.roomNo,
        memNo: obj.memNo
      },
      method: methodType
    })
    //Error발생시
    if (res.result === 'success') {
      //sc.sendMessage()
      console.log('broadManager  res = ' + res)
    } else {
      console.log('broadManager  res = ' + res)
    }
  }

  async function broadkickout(obj) {
    const res = await Api.broad_kickout({
      data: {
        roomNo: store.roomInfo.roomNo,
        blockNo: obj.memNo
      },
      method: 'POST'
    })
    //Error발생시
    if (res.result === 'success') {
      //sc.sendMessage()
    } else {
    }
  }

  const drawListenList = idx => {
    console.log('store.listenerList = ' + store.listenerList)
    if (store.listenerList === null) return
    return store.listenerList.map((live, index) => {
      if (index === idx) {
        return (selectlistener = live)
      }
    })
  }
  const listenerStateChange = idx => {
    switch (idx) {
      case 0: //강제퇴장
        res = drawListenList(props.selectidx)
        if (selectlistener) {
          context.action.confirm({
            //콜백처리
            callback: () => {
              broadkickout(selectlistener)
            },
            //캔슬콜백처리
            cancelCallback: () => {},
            msg: selectlistener.nickNm + ' 님을 강제퇴장 하시겠습니까?'
          })
        }
        break
      case 1: //매니저 등록
        res = drawListenList(props.selectidx)
        if (selectlistener) {
          context.action.confirm({
            //콜백처리
            callback: () => {
              broadManager(idx, selectlistener)
            },
            //캔슬콜백처리
            cancelCallback: () => {},
            msg: selectlistener.nickNm + ' 님을 매니저로 지정 하시겠습니까?'
          })
        }

        break
      case 2: //매니저 해임
        res = drawListenList(props.selectidx)
        if (selectlistener) {
          context.action.confirm({
            //콜백처리
            callback: () => {
              broadManager(idx, selectlistener)
            },
            //캔슬콜백처리
            cancelCallback: () => {},
            msg: selectlistener.nickNm + ' 님을 매니저에서 해임 하시겠습니까?'
          })
        }
        break
      case 3: //게스트 초대
        break
      case 4: //프로필 보기
        break
      case 5: //신고하기
        break
      default:
        break
    }
  }

  const makeDropboxBtn = () => {
    const menulist = ['강제퇴장', '매니저 등록', '매니저 해임', '게스트 초대', '프로필 보기', '신고하기']
    return menulist.map((list, index) => {
      return (
        <button
          key={index}
          onClick={e => {
            listenerStateChange(index)
          }}>
          {list}
        </button>
      )
    })
  }
  //--------------------------------------------------------
  return (
    <Event>
      <ul>{store.roomInfo.auth != 0 ? makeDropboxBtn() : ''}</ul>
    </Event>
  )
}
//--------------------------------------------------------
//styled
const Event = styled.div`
  position: absolute;
  right: 23px;
  width: 105px;
  padding: 13px 0;
  background-color: #fff;
  z-index: 3;
  border: 1px solid #e0e0e0;
  .scrollbar > div:nth-last-child(3) & {
    bottom: 0;
  }

  & ul {
    & button {
      display: block;
      width: 100%;
      padding: 7px 0;
      box-sizing: border-box;
      color: #757575;
      font-size: 14px;
      text-align: center;
      letter-spacing: -0.35px;
      &:hover {
        background-color: #f8f8f8;
      }
    }
  }

  &.on {
    display: none;
  }
`
