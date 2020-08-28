/**
 * @title 방송방입장 및 퇴장 (하이브리드앱전용)
 * @code 
 
    import Room, {RoomJoin} from 'context/room'

    //function
    RoomJoin(roomNo + '', () => {
        clicked = false
    })

    //render추가
    return (   <Room />   )
 */
import React, {useEffect, useState, useContext} from 'react'

//context
import Api from 'context/api'
import {Hybrid} from 'context/hybrid'
import {Context} from 'context'

import {OS_TYPE} from 'context/config.js'
import Utility from 'components/lib/utility'

//
const Room = () => {
  //context
  const context = useContext(Context)
  //useState
  const [roomInfo, setRoomInfo] = useState(null)
  const [auth, setAuth] = useState(false)
  const [itv, setItv] = useState(0)
  //interface
  Room.context = context
  Room.auth = auth
  Room.itv = itv
  Room.roomInfo = roomInfo
  Room.setItv = (num) => setItv(num)
  Room.setRoomInfo = (obj) => setRoomInfo(obj)
  Room.setAuth = (bool) => setAuth(bool)
  //-----------------------------------------------------------

  //-----------------------------------------------------------
  return <React.Fragment />
}
export default Room
//-----------------------------------------------------------
/**
 * @title 방송방입장
 * @param {roomNo} string           //방송방번호
 * @param {callbackFunc} function   //여러번 클릭을막기위해 필요시 flag설정
 */
export const RoomJoin = async (obj) => {
  const {roomNo, callbackFunc, shadow, mode} = obj
  /*const exdate = new Date()
  exdate.setHours(15)
  exdate.setMinutes(0)
  exdate.setSeconds(0)
  const now = new Date()
    if(exdate.getTime() < now.getTime()){
        Room.context.action.alert({
            msg: '시스템 점검중입니다.\n잠시만 기다려주세요.'
        })
        return
    }*/
  const today = new Date()
  const _day = today.getUTCDate() + ''
  const _hour = Number(today.getHours())
  const _min = Number(today.getMinutes())
  const customHeader = JSON.parse(Api.customHeader)

  if (customHeader['os'] === OS_TYPE['Desktop']) {
    window.location.href = 'https://inforexseoul.page.link/Ws4t'
    return false
  }
  const sessionRoomNo = sessionStorage.getItem('room_no')
  //const sessionRoomActive = sessionStorage.getItem('room_active')

  if (sessionStorage.getItem('room_active') === 'N') {
    Room.context.action.alert({
      msg: '방에 입장중입니다.\n 잠시만 기다려주세요.'
    })
  } else {
    if (sessionStorage.getItem('room_active') === null) {
      sessionStorage.setItem('room_active', 'N')
    }
  }

  /**
   * @title Room.roomNo , roomNo 비교
   */
  if (sessionRoomNo === roomNo) {
    async function commonJoin() {
      let res = {}
      res = await Api.broad_join_vw({data: {roomNo}})
      const {code, result, data} = res

      if (code === '-3') {
        context.action.alert({
          msg: '종료된 방송입니다.',
          callback: () => {
            sessionStorage.removeItem('room_no')
            Utility.setCookie('listen_room_no', null)
            context.action.updatePlayer(false)
            setTimeout(() => {
              window.location.href = '/'
            }, 100)
          }
        })
      } else {
        Hybrid('EnterRoom', '')
      }
    }
    commonJoin()
    return false
  } else {
    //-------------------------------------------------------------
    //authCheck
    //Hybrid('AuthCheck')
    //RoomAuth가 맞지않으면실행하지않음
    /*if (!Room.auth) {
      setTimeout(() => {
        //재귀함수
        Room.setItv(Room.itv + 1)
        if (Room.itv * 80 >= 5000) {
          Room.context.action.alert({
            msg: `방송방 입장이 원활하지 않습니다.\n잠시 후 다시 시도해주십시오.\n정식 오픈 전 미진한 상황에서도\n 이용해주셔서 감사드립니다.`,
            callback: () => {
              // window.location.reload()
              window.location.href = '/'
            }
          })
          return
        }
        RoomJoin(roomNo)
      }, 80)
      return
    }*/

    //방송강제퇴장
    if (sessionRoomNo !== undefined && sessionRoomNo !== null) {
      const exit = await Api.broad_exit({data: {roomNo: sessionRoomNo}})
      if (exit.result === 'success') {
        sessionStorage.removeItem('room_no')
        Utility.setCookie('listen_room_no', null)
        Room.context.action.updatePlayer(false)
        Hybrid('ExitRoom', '')
        //--쿠기
      } else {
      }
      console.log(exit)
    }
    console.log('sessionRoomNo : ' + sessionRoomNo)
    //방송JOIN
    //const res = await Api.broad_join({data: {roomNo: roomNo, shadow: shadow}})
    let res = {}
    res = await Api.broad_join_vw({data: {roomNo: roomNo, shadow: shadow}})
    //REST 'success'/'fail' 완료되면 callback처리 중복클릭제거
    if (callbackFunc !== undefined) callbackFunc()
    //
    if (res.result === 'fail') {
      if (res.code === '-4' || res.code === '-10') {
        try {
          Room.context.action.confirm({
            msg: '이미 로그인 된 기기가 있습니다.\n방송 입장 시 기존기기의 연결이 종료됩니다.\n그래도 입장하시겠습니까?',
            callback: () => {
              const callResetListen = async (mem_no) => {
                const fetchResetListen = await Api.postResetListen({})
                if (fetchResetListen.result === 'success') {
                  setTimeout(() => {
                    RoomJoin(obj)
                  }, 700)
                } else {
                  globalCtx.action.alert({
                    msg: `${loginInfo.message}`
                  })
                }
              }
              callResetListen('')
            }
          })
        } catch (er) {
          alert(er)
        }
      } else {
        Room.context.action.alert({
          msg: res.message,
          callback: () => {
            // window.location.reload()
            window.location.href = '/'
          }
        })
      }
      return false
    } else if (res.result === 'success' && res.data !== null) {
      //성공일때
      const {data} = res
      //하이브리드앱실행
      Room.setRoomInfo(data)
      Room.setAuth(false)
      //--
      //Room.setItv(0)
      Room.context.action.alert({visible: false})
      sessionStorage.setItem('room_active', 'N')
      sessionStorage.setItem('room_no', roomNo)
      Utility.setCookie('listen_room_no', roomNo)
      Hybrid('RoomJoin', data)
      Hybrid('adbrixEvent', {eventName: 'roomJoin', attr: {}})
      //Facebook,Firebase 이벤트 호출
      try {
        fbq('track', 'RoomJoin')
        firebase.analytics().logEvent('RoomJoin')
      } catch (e) {}
      return true
    }
  }
}
/**
 * @title 방송방종료
 * @param {roomNo} string           //방송방번호
 */
export const RoomExit = async (roomNo) => {
  const res = await Api.broad_exit({data: {roomNo: roomNo}})
  if (res.result === 'fail') {
    Room.context.action.alert({
      title: res.messageKey,
      msg: res.message
    })
    return false
  } else if (res.result === 'success') {
    return true
  }
}
/**
 * @title 방송방생성
 * @param {context} object            //context
 */
export const RoomMake = async (context) => {
  /*const exdate = new Date()
    exdate.setHours(15)
    exdate.setMinutes(0)
    exdate.setSeconds(0)
    const now = new Date()
    if(exdate.getTime() < now.getTime()){
        Room.context.action.alert({
            msg: '시스템 점검중입니다.\n잠시만 기다려주세요.'
        })
        return
    }*/
  const today = new Date()
  const _day = today.getUTCDate() + ''
  const _hour = Number(today.getHours())
  const _min = Number(today.getMinutes())

  /**
   * @title 방송방체크
   * @code (1: 방송중, 2:마이크Off, 3:통화중, 4:방송종료, 5: 비정상(dj 종료된상태))
   */
  async function broadCheck(obj) {
    const res = await Api.broad_check()
    //진행중인 방송이 없습니다
    if (res.code === '0') return true
    //진행중인 방송이 있습니다
    if (res.code === '1') {
      const {roomNo} = res.data
      context.action.confirm({
        msg: res.message,
        callback: () => {
          ;(async function () {
            const exit = await Api.broad_exit({data: {roomNo: roomNo}})
            //success,fail노출
            context.action.alert({
              msg: exit.message
            })
          })()
        },
        buttonText: {
          left: '취소',
          right: '방송종료'
        }
      })
      return false
    }
    //-----------------------------------
    if (res.result === 'success') {
      const {code} = res
      //비정상된 방이 있음
      if (code === '2') {
        const {roomNo} = res.data
        context.action.confirm({
          msg: res.message,
          //방송하기_클릭
          callback: () => {
            ;(async function () {
              let reToken = {}
              reToken = await Api.broadcast_info({data: {roomNo: roomNo}})
              console.log(reToken)
              if (reToken.result === 'success') {
                Hybrid('ReconnectRoom', reToken.data)
              } else {
                context.action.alert({
                  msg: reToken.message
                })
              }
            })()
          },
          //방송종료_클릭
          cancelCallback: () => {
            ;(async function () {
              const exit = await Api.broad_exit({data: {roomNo: roomNo}})
              //success,fail노출
              context.action.alert({
                msg: exit.message
              })
            })()
          },
          buttonText: {
            left: '방송종료',
            right: '방송하기'
          }
        })
        return false
      }
      return true
    } else if (res.result === 'fail') {
      context.action.alert({
        msg: res.message !== undefined && res.message
      })
    }
  }
  //-----------------------------------------------------
  const {customHeader, token} = context || Room.context
  const _os = customHeader['os']
  //#1 로그인체크
  if (!token.isLogin) {
    window.location.href = '/login'
    return
  }

  //#2 본인인증 (Android만 실행 개발중)
  /*---------20.04.08 임시로 막아둠
  if (_os === OS_TYPE['Android']) {
    const selfAuth = await Api.self_auth_check(token)
    if (selfAuth.result === 'fail') {
      window.location.href = '/selfauth'
      return
    }
  }
  */

  //#3 방상태확인 ("진행중인 방송이 있습니다.")
  const result = await broadCheck()
  if (!result) return
  //## 실행
  Hybrid('RoomMake')
  console.log(
    '%c' + `Native: RoomMake`,
    'display:block;width:100%;padding:5px 10px;font-weight:bolder;font-size:14px;color:#fff;background:blue;'
  )
}
