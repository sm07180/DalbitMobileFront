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
  //const [roomInfo, setRoomInfo] = useState({...props.location.state})
  const store = useContext(BroadCastStore)
  const context = useContext(Context)
  //console.log(roomInfo)
  //const {state} = props.roomInfo
  let selectlistener = ''
  let res = ''

  //신고하기
  // async function broadListenListReload() {
  //   const res = await Api.member_declar({
  //     data: {
  //       memNo: store.roomInfo.roomNo,
  //       reason : ,
  //       cont :

  //     }
  //   })
  //   if (res.result === 'success') {
  //     const {list} = res.data
  //     store.action.updateListenerList(list)
  //   }
  //   return
  // }

  //방송방 청취자 리스트 조회  Api
  async function broadListenListReload() {
    const res = await Api.broad_listeners({
      params: {
        roomNo: store.roomInfo.roomNo
      }
    })
    if (res.result === 'success') {
      const {list} = res.data
      store.action.updateListenerList(list)
    }
    return
  }
  setInterval(() => {
    //console.log(store.roomInfo.auth)
    //console.log()
  }, 5000)
  //매니저 지정 , 해제 Api
  async function broadManager(type, obj) {
    const methodType = type === 1 ? 'POST' : 'DELETE'

    const res = await Api.broad_manager({
      data: {
        roomNo: store.roomInfo.roomNo,
        memNo: obj.memNo,
        auth: store.roomInfo.auth
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
      return (bjno = res.data.memNo)
    } else {
      console.log('broadManager  res = ' + res)
    }
  }

  async function joinRoom() {
    // const res = await Api.broad_join({data: {roomNo: store.roomInfo.roomNo}})
    // if (res.result === 'success') {
    //   if (store.roomInfo.auth < 2) store.action.updateRoomInfo(res.data)
    // }
    // return
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
        store.action.updateTab(6)
        break
      case 5: //신고하기
        store.action.updateTab(7)
        break
      default:
        break
    }
  }

  // const makeDropboxBtn = () => {
  //   const menulist = ['강제퇴장', '매니저 등록', '매니저 해임', '게스트 초대', '프로필 보기', '신고하기']
  //   return menulist.map((list, index) => {
  //     return (
  //       <button
  //         key={index}
  //         onClick={e => {
  //           listenerStateChange(index)
  //         }}>
  //         {list}
  //       </button>
  //     )
  //   })
  // }
  const makeDropboxBtn = () => {
    const listenerView = ['', '', '', '', '프로필 보기', '신고 하기']
    const ManegerView = ['강퇴하기', '', '', '', '프로필 보기', '신고 하기']
    const BJView = ['강제퇴장', '매니저 등록', '매니저 해임', '게스트 초대', '프로필 보기', '신고하기']
    const BJViewManeger = ['강퇴하기', '', '매니저 해임', '게스트 초대', '프로필 보기', '신고하기']
    const {selectidx} = props
    //props.rcvData.data.user.auth
    if (store.roomInfo.auth == 0) {
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
    } else if (store.roomInfo.auth == 1) {
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
    } else if (store.roomInfo.auth == 3) {
      // 매니저
      if (store.listenerList[selectidx].auth === 0) {
        return BJView.map((list, index) => {
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
