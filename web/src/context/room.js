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
import {clipExit} from 'pages/common/clipPlayer/clip_func'

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
  const customHeader = JSON.parse(Api.customHeader)
  const sessionRoomNo = sessionStorage.getItem('room_no')
  //const sessionRoomActive = sessionStorage.getItem('room_active')

  if (sessionStorage.getItem('room_active') === 'N') {
    Room.context.action.alert({
      msg: '방에 입장중입니다.\n 잠시만 기다려주세요.'
    })
    return false
  } else {
    if (sessionStorage.getItem('room_active') === null) {
      sessionStorage.setItem('room_active', 'N')
    }
  }

  if (customHeader['os'] === OS_TYPE['Desktop']) {
    window.location.href = 'https://inforexseoul.page.link/Ws4t'
    return false
  }

  //클립나가기
  if (Utility.getCookie('clip-player-info')) {
    return Room.context.action.confirm({
      msg: '현재 재생 중인 클립이 있습니다.\n방송에 입장하시겠습니까?',
      callback: () => {
        clipExit(Room.context)
        sessionStorage.removeItem('room_active')
        return RoomJoin(obj)
      },
      cancelCallback: () => {
        sessionStorage.removeItem('room_active')
      }
    })
  }

  if (shadow === undefined) {
    if (Room.context.adminChecker === true && roomNo !== Utility.getCookie('listen_room_no')) {
      return Room.context.action.confirm_admin({
        callback: () => {
          sessionStorage.removeItem('room_active')
          return RoomJoin({roomNo: roomNo, shadow: 1})
        },
        cancelCallback: () => {
          sessionStorage.removeItem('room_active')
          return RoomJoin({roomNo: roomNo, shadow: 0})
        },
        msg: '관리자로 입장하시겠습니까?'
      })
    } else if (Room.context.adminChecker === true && roomNo === Utility.getCookie('listen_room_no')) {
      return Hybrid('EnterRoom', '')
    }
  }

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
   * @title Room.roomNo , roomNo 비교
   */
  if (sessionRoomNo === roomNo) {
    async function commonJoin() {
      let res = {}
      res = await Api.broad_join_vw({data: {roomNo}})
      const {code, result, data} = res
      if (code === '-3') {
        if (code === '-3') {
          context.action.alert({
            msg: '종료된 방송입니다.',
            callback: () => {
              sessionStorage.removeItem('room_no')
              sessionStorage.removeItem('room_active')
              Utility.setCookie('listen_room_no', null)
              context.action.updatePlayer(false)
              setTimeout(() => {
                window.location.href = '/'
              }, 100)
            }
          })
        } else {
          sessionStorage.removeItem('room_active')
          Hybrid('EnterRoom', '')
        }
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
        sessionStorage.removeItem('room_active')
        Utility.setCookie('listen_room_no', null)
        Room.context.action.updatePlayer(false)
        Hybrid('ExitRoom', '')
        //--쿠기
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
      if (res.code === '-99') {
        Room.context.action.alert({
          msg: res.message,
          callback: () => {
            sessionStorage.removeItem('room_active')
            window.location.href = '/login'
          }
        })
      } else if (res.code === '-4' || res.code === '-10') {
        try {
          Room.context.action.confirm({
            msg: '이미 로그인 된 기기가 있습니다.\n방송 입장 시 기존기기의 연결이 종료됩니다.\n그래도 입장하시겠습니까?',
            callback: () => {
              const callResetListen = async (mem_no) => {
                const fetchResetListen = await Api.postResetListen({})
                if (fetchResetListen.result === 'success') {
                  setTimeout(() => {
                    sessionStorage.removeItem('room_active')
                    RoomJoin(obj)
                  }, 700)
                } else {
                  sessionStorage.removeItem('room_active')
                  globalCtx.action.alert({
                    msg: `${loginInfo.message}`
                  })
                }
              }
              sessionStorage.removeItem('room_active')
              callResetListen('')
            },
            cancelCallback: () => {
              sessionStorage.removeItem('room_active')
            }
          })
        } catch (er) {
          sessionStorage.removeItem('room_active')
          alert(er)
        }
      } else if (res.code === '-6') {
        async function fetchData() {
          const authCheck = await Api.self_auth_check()
          if (authCheck.result === 'success') {
            Room.context.action.alert({
              msg: '20세 이상만 입장할 수 있는 방송입니다.',
              callback: () => {
                sessionStorage.removeItem('room_active')
              }
            })
          } else {
            Room.context.action.alert({
              msg: '20세 이상만 입장할 수 있는 방송입니다. 본인인증 후 이용해주세요.',
              callback: () => {
                sessionStorage.removeItem('room_active')
                window.location.href = '/private'
              }
            })
          }
        }

        fetchData()
      } else {
        Room.context.action.alert({
          msg: res.message,
          callback: () => {
            sessionStorage.removeItem('room_active')
            window.location.reload()
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
      //TODO:Facebook,Firebase 이벤트 호출 추후 앱 배포 되면 삭
      try {
        fbq('track', 'RoomJoin')
        firebase.analytics().logEvent('RoomJoin')
        kakaoPixel('114527450721661229').viewCart('RoomJoin')
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
      }else if(code === 'C100'){ //방송 이어하기 가능
        context.action.confirm({
          msg: "2시간 이내에 방송진행 내역이 있습니다. \n방송을 이어서 하시겠습니까?",
          subMsg: "※ 이어서 하면 모든 방송데이터(방송시간,청취자,좋아요,부스터,선물)를 유지한 상태로 만들어집니다.",
          callback: () => {
            goRoomMake()
          },
          cancelCallback: () => {
            ;(async function () {
              const continueRes = await Api.broad_continue({})
              if(continueRes.result === 'success'){
                Hybrid('ReconnectRoom', continueRes.data)
              }else{
                context.action.alert({
                  msg: continueRes.message
                })
              }
            })()
          },
          buttonText: {
            left: '이어서 방송하기',
            right: '새로 방송하기'
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
  let appBuild = customHeader['appBuild']
  if (appBuild === undefined) {
    appBuild = 1
  }
  //#1 로그인체크
  if (!token.isLogin) {
    window.location.href = '/login'
    return
  }

  //#2 본인인증 임시 막기
  // const selfAuth = await Api.self_auth_check(token)
  // if (selfAuth.result === 'fail') {
  //   window.location.href = '/selfauth?type=create'
  //   return
  // }

  //#3 방상태확인 ("진행중인 방송이 있습니다.")
  const result = await broadCheck()
  if (!result) return
  //## 실행 리얼 주석 시작
  let broadSetting = {}
  broadSetting['djListenerIn'] = false
  broadSetting['djListenerOut'] = false

  if (__NODE_ENV === 'dev' || (_os === 1 && appBuild > 32) || (_os === 2 && appBuild > 141)) {
    const apiSetting = await Api.getBroadcastSetting()
    if (apiSetting && apiSetting.result === 'success' && apiSetting.data) {
      broadSetting['djListenerIn'] = apiSetting.data['djListenerIn']
      broadSetting['djListenerOut'] = apiSetting.data['djListenerOut']
    }
  }
  if (__NODE_ENV !== 'dev' && _os === 1 && appBuild < 32) {
    Hybrid('RoomMake')
  } else {
    Hybrid('RoomMake', broadSetting)
  }
  //## 실행 리얼 주석 종료
  //Hybrid('RoomMake') //원소스
}
