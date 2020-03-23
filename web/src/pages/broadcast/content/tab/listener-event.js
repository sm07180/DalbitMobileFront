/**
 * @title 청취자탭 클릭 event(드롭다운 메뉴 내 역활별 ui 및 기능)
 */
import React, {useEffect, useState, useContext} from 'react'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import styled from 'styled-components'
import {BroadCastStore} from 'pages/broadcast/store'
import Api from 'context/api'
import {Context} from 'context'
import qs from 'query-string'
//soket
const sc = require('context/socketCluster')
export default props => {
  //context
  const store = useContext(BroadCastStore)
  const context = useContext(Context)
  const {broadcastTotalInfo} = context
  const {roomNo} = qs.parse(location.search)
  ///////////////////////////////////
  let selectlistener = ''
  let res = ''

  //방송방 청취자 리스트 조회  Api
  async function broadListenListReload() {
    const res = await Api.broad_listeners({
      params: {
        roomNo: context.broadcastTotalInfo.roomNo
      }
    })
    if (res.result === 'success') {
      const {list} = res.data
      store.action.updateListenerList(list)
      if (list.length > 0) store.action.updateListenerUpdate(list)
    }
    return
  }

  //매니저 지정 , 해제 Api
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
      broadListenListReload()
      //console.log(res)
      //console.log(res.data.memNo)
      //이부분
      store.action.updateRoomInfo({auth: 1})

      console.log('broadManager  res = ' + res)
      store.action.updateListenTrues(false)
      //return (bjno = res.data.memNo)
    } else {
      console.log('broadManager  res = ' + res)
    }
  }

  // 강퇴 Api
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
      sc.SendMessageKickout(res)
      broadListenListReload()
    }
  }

  async function broadProfileInfo(obj) {
    const res = await Api.broad_member_profile({
      params: {
        memNo: obj.memNo,
        roomNo: roomNo
      },
      method: 'GET'
    })
    //Error발생시
    if (res.result === 'success') {
      console.log('## 선택 프로필 정보 res = ' + res.data)

      store.action.updateBroadcastProfileInfo(res.data)
    }
  }

  const drawListenList = idx => {
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
        store.action.updateTab(1)
        break
      case 4: //프로필 보기
        res = drawListenList(props.selectidx)
        broadProfileInfo(selectlistener)
        store.action.updateTab(6)
        break
      case 5: //신고하기
        res = drawListenList(props.selectidx)
        console.log('##신고하기 res = ' + props.selectidx)

        store.action.updateReportData({memNo: res[props.selectidx].memNo, nickNm: res[props.selectidx].nickNm, roomNo: roomNo})
        store.action.updateTab(7)
        break
      default:
        break
    }
  }

  const makeDropboxBtn = () => {
    const listenerView = ['', '', '', '', '프로필 보기', '신고 하기']
    const ManegerView = ['강퇴하기', '', '', '', '프로필 보기', '신고 하기']
    const BJView = ['강제퇴장', '매니저 등록', '', '게스트 초대', '프로필 보기', '신고하기']
    const BJViewManeger = ['강퇴하기', '', '매니저 해임', '게스트 초대', '프로필 보기', '신고하기']
    const {selectidx} = props
    //props.rcvData.data.user.auth
    if (context.broadcastTotalInfo.auth == 0) {
      //청취자
      if (store.listenerList[selectidx].auth === 0 || store.listenerList[selectidx].auth === 1) {
        return listenerView.map((list, index) => {
          return (
            <button
              key={index}
              onClick={e => {
                listenerStateChange(index)
              }}
              className={list === '' ? 'none' : ''}>
              {list}
            </button>
          )
        })
      }
    } else if (context.broadcastTotalInfo.auth == 1) {
      // 매니저
      if (store.listenerList[selectidx].auth === 0) {
        return ManegerView.map((list, index) => {
          return (
            <button
              key={index}
              onClick={e => {
                listenerStateChange(index)
              }}
              className={list === '' ? 'none' : ''}>
              {list}
            </button>
          )
        })
      } else if (store.listenerList[selectidx].auth === 1) {
        return listenerView.map((list, index) => {
          return (
            <button
              key={index}
              onClick={e => {
                listenerStateChange(index)
              }}
              className={list === '' ? 'none' : ''}>
              {list}
            </button>
          )
        })
      }
    } else if (context.broadcastTotalInfo.auth == 3) {
      // BJ
      if (store.listenerList[selectidx].auth === 0) {
        return BJView.map((list, index) => {
          return (
            <button
              key={index}
              onClick={e => {
                listenerStateChange(index)
              }}
              className={list === '' ? 'none' : ''}>
              {list}
            </button>
          )
        })
      } else if (store.listenerList[selectidx].auth === 1) {
        return BJViewManeger.map((list, index) => {
          console.log(list)
          return (
            <button
              key={index}
              onClick={e => {
                listenerStateChange(index)
              }}
              className={list === '' ? 'none' : ''}>
              {list}
            </button>
          )
        })
      }
    }
  }

  //--------------------------------------------------------
  return (
    <Event>
      {/* <ul>{store.roomInfo.auth != 0 ? makeDropboxBtn() : ''}</ul> */}
      <ul>{makeDropboxBtn()}</ul>
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
      &.none {
        display: none;
      }
      &:hover {
        background-color: #f8f8f8;
      }
    }
  }

  &.on {
    display: none;
  }
`
