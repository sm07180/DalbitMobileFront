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
import {Hybrid, isAndroid, isHybrid} from 'context/hybrid'

import {OS_TYPE} from 'context/config.js'
import Utility from 'components/lib/utility'
import {clipExit} from 'pages/common/clipPlayer/clip_func'
import {
  setGlobalCtxBroadcastAdminLayer,
  setGlobalCtxMessage,
  setGlobalCtxNativePlayerInfo,
  setGlobalCtxPlayer
} from "../redux/actions/globalCtx";
import {useDispatch, useSelector} from "react-redux";

//
const Room = () => {

  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  //useState
  const [roomInfo, setRoomInfo] = useState(null)
  const [auth, setAuth] = useState(false)
  const [itv, setItv] = useState(0)
  //interface
  Room.dispatch = dispatch;
  Room.globalState = globalState;
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
  /* 임시 업데이트 체크 --------------------- */
  /*const res = await Api.verisionCheck();
  if(res.data.isUpdate) {
    return Room.dispatch(setGlobalCtxMessage({type:'confirm',
      msg: '안정적인 서비스 제공을 위해 최신버전으로 업데이트가 필요합니다.',
      buttonText: {right: '업데이트'},
      callback: () => {
        if(isAndroid()) {
          Hybrid('goToPlayStore');
        }else {
          Hybrid('openUrl', res.data.storeUrl)
        }
      },
      cancelCallback: () => {
        return false;
      }
    })
  }*/
  /* -------------------------------------- */

  const {roomNo, callbackFunc, shadow, mode, memNo, nickNm, listener} = obj;

  //alert("???"+Room.globalState.nativePlayerState)
  if(Room.globalState.nativePlayerInfo.state === 'open'){
    if(Room.globalState.nativePlayerInfo.roomNo === roomNo){
      Room.dispatch(setGlobalCtxMessage({
        type:'toast',
        msg: `방에 입장중입니다. 잠시만 기다려주세요.`,
      }));
    }
    return;
  }
  if(Room.globalState.nativePlayerInfo.state === 'close' && Room.globalState.nativePlayer?.roomNo === roomNo){
    Room.dispatch(setGlobalCtxMessage({
      type:'toast',
      msg: `잠시만 기다려주세요.`,
    }))
    return;
  }

  const customHeader = JSON.parse(Api.customHeader)
  const sessionRoomNo = sessionStorage.getItem('room_no')
  localStorage.removeItem('prevRoomInfo')

  if (customHeader['os'] === OS_TYPE['Desktop']) {
    window.location.href = 'https://inforexseoul.page.link/Ws4t'
    return false
  }

  //클립나가기
  if (Utility.getCookie('clip-player-info')) {
    return Room.dispatch(setGlobalCtxMessage({type:'confirm',
      msg: '현재 재생 중인 클립이 있습니다.\n방송에 입장하시겠습니까?',
      callback: () => {
        clipExit(Room.dispatch)
        return RoomJoin({roomNo: roomNo, memNo:memNo, nickNm:nickNm, callbackFunc: callbackFunc, shadow: shadow, listener: 'clip'})
      },
      cancelCallback: () => {
      }
    }))
  }

  if (shadow === undefined) {
    if (Room.globalState.adminChecker === true && roomNo !== Utility.getCookie('listen_room_no')) {
      return Room.dispatch(setGlobalCtxBroadcastAdminLayer({
        ...Room.globalState.broadcastAdminLayer,
        status: `broadcast`,
        roomNo: roomNo,
        memNo:memNo,
        nickNm: nickNm === "noName" ? "" : nickNm,
      }))
    } else if (Room.globalState.adminChecker === true && roomNo === Utility.getCookie('listen_room_no')) {
      return Hybrid('EnterRoom', '')
    } else if (Room.globalState.adminChecker === false) {
      if (listener === 'listener' || listener === 'clip') {
        return RoomJoin({roomNo: roomNo, memNo:memNo, nickNm:nickNm, shadow: 0})
      } else if (Room.globalState.adminChecker === false && roomNo === Utility.getCookie('listen_room_no')) {
        // pip상태에서 같은방 입장
        return Hybrid('EnterRoom', '')
      } else {
        if(Utility.getCookie('listen_room_no') !== 'null' && Utility.getCookie('listen_room_no') !== undefined) {
          // pip상태에서 다른방 입장
          return Room.dispatch(setGlobalCtxMessage({type:'confirm',
            callback: () => {
              // pip 상태에서 다른방 입장시 다시 이전 방으로 접근하는 케이스 방지용
              Room.dispatch(setGlobalCtxNativePlayerInfo({nativePlayerInfo:{state:'open', roomNo: roomNo}}))
              return RoomJoin({roomNo: roomNo, memNo:memNo, nickNm:nickNm, shadow: 0})
            },
            cancelCallback: () => {
            },
            msg: '현재 청취 중인 방송방이 있습니다.\n방송에 입장하시겠습니까?',
          }))
        }else {
          // return RoomJoin({roomNo: roomNo, memNo:memNo, nickNm:nickNm, shadow: 0})
          return Room.dispatch(setGlobalCtxMessage({type:'confirm',
            callback: () => {
              return RoomJoin({roomNo: roomNo, memNo:memNo, nickNm:nickNm, shadow: 0})
            },
            cancelCallback: () => {
            },
            msg: nickNm === undefined ? `방송방에 입장하시겠습니까?` : `${nickNm} 님의 <br /> 방송방에 입장하시겠습니까?`
          }))
        }
      }
    }
  }

  /*const exdate = new Date()
  exdate.setHours(15)
  exdate.setMinutes(0)
  exdate.setSeconds(0)
  const now = new Date()
    if(exdate.getTime() < now.getTime()){
        Room.dispatch(setGlobalCtxMessage({type:'alert',
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
    //alert(JSON.stringify(Room.globalState.nativePlayerInfo))
    async function commonJoin() {
      let res = {}
      res = await Api.broad_join_vw({data: {roomNo}})
      const {code, result, data} = res
      if (code === '-3') {
        if (code === '-3') {
          Room.dispatch(setGlobalCtxMessage({type:'alert',
            msg: '종료된 방송입니다.',
            callback: () => {
              sessionStorage.removeItem('room_no')
              Utility.setCookie('listen_room_no', null)
              Room.dispatch(setGlobalCtxPlayer(false));
              setTimeout(() => {
                window.location.href = '/'
              }, 100)
            }
          }))
        } else {
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
          Room.dispatch(setGlobalCtxMessage({type:'alert',
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

    // 이전 청취방 퇴장
    if (sessionRoomNo !== undefined && sessionRoomNo !== null) {
      const exit = await Api.broad_exit({data: {roomNo: sessionRoomNo}})
      if (exit.result === 'success') {
        // Room.dispatch(setGlobalCtxNativePlayerState({nativePlayerState:'close'}));
        // Room.dispatch(nativeEnd({}));
        Hybrid('ExitRoom', '');
      }
    }

    console.log('sessionRoomNo : ' + sessionRoomNo)
    //방송JOIN
    //const res = await Api.broad_join({data: {roomNo: roomNo, shadow: shadow}})
    Room.dispatch(setGlobalCtxNativePlayerInfo({nativePlayerInfo:{state:'open', roomNo: roomNo}}))
    let res = {}
    res = await Api.broad_join_vw({data: {roomNo: roomNo, shadow: shadow}})
    //REST 'success'/'fail' 완료되면 callback처리 중복클릭제거
    if (callbackFunc !== undefined) callbackFunc()
    //
    if (res.result === 'fail') {
      Room.dispatch(setGlobalCtxNativePlayerInfo({nativePlayerInfo:{state:'ready', roomNo: roomNo}}))
      if (res.code === '-99') {
        Room.dispatch(setGlobalCtxMessage({type:'alert',
          buttonMsg: '로그인',
          msg: `<div id="nonMemberPopup"><p>로그인 후 DJ와 소통해보세요!<br/>DJ가 당신을 기다립니다 ^^</p><img style="width:166px;padding-top:12px;"src="https://image.dalbitlive.com/images/popup/non-member-popup.png" /></div>`,
          callback: () => {
            window.location.href = '/login'
          }
        }))
      } else if (res.code === '-4' || res.code === '-10') {
        try {
          Room.dispatch(setGlobalCtxMessage({type:'confirm',
            msg: '이미 로그인 된 기기가 있습니다.\n방송 입장 시 기존기기의 연결이 종료됩니다.\n그래도 입장하시겠습니까?',
            callback: () => {
              Room.dispatch(setGlobalCtxNativePlayerInfo({nativePlayerInfo:{state:'open', roomNo: roomNo}}))

              const callResetListen = async (mem_no) => {
                const fetchResetListen = await Api.postResetListen({})
                if (fetchResetListen.result === 'success') {
                  setTimeout(() => {
                    RoomJoin(obj)
                  }, 700)
                } else {
                  Room.dispatch(setGlobalCtxMessage({type:'alert',
                    msg: `${loginInfo.message}`
                  }))
                }
              }
              callResetListen('')
            },
            cancelCallback: () => {
            }
          }))
        } catch (er) {
          alert(er)
        }
      } else if (res.code === '-6') {
        //20세 이상방 입장 실패
        //비회원이 20세 이상방 입장 시도 시
        //본인인증을 완료한 20세 이하 회원이 입장 시도시
        Room.dispatch(setGlobalCtxMessage({type:'alert',
          msg: '20세 이상만 입장할 수 있는 방송입니다.'
        }))
      } else if (res.code === '-14') {
        //20세 이상방 입장 실패
        //본인인증을 하지 않은 회원이 입장 시도시
        Room.dispatch(setGlobalCtxMessage({type:'alert',
          msg: res.message,
          callback: () => {
            window.location.href = '/selfauth?type=adultJoin'
          }
        }))
      } else {
        Room.dispatch(setGlobalCtxMessage({type:'alert',
          msg: res.message,
          callback: () => {
            window.location.reload()
          },
          btnCloseCallback: () => {
          }
        }))
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
      Room.dispatch(setGlobalCtxMessage({type:'alert',visible: false}))
      sessionStorage.setItem('room_no', roomNo)
      Utility.setCookie('listen_room_no', roomNo)
      // console.log(`RoomJoin data =>`, data)

      Hybrid('RoomJoin', data)

      //alert('@@RoomJoin')
      // RoomJoin 이벤트 (회원 비회원 분리)
      const newRoomJoinCmd = Room.globalState.token.isLogin ? 'Room_Join_regit' : 'Room_Join_unregit';
      const oldRoomJoinCmd = 'RoomJoin';
      Utility.addAdsData(newRoomJoinCmd);
      Utility.addAdsData(oldRoomJoinCmd);

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
    Room.dispatch(setGlobalCtxMessage({type:'alert',
      title: res.messageKey,
      msg: res.message
    }))
    return false
  } else if (res.result === 'success') {
    return true
  }
}
/**
 * @title 방송방생성
 */
export const RoomMake = async ({dispatch, globalState}) => {
  /*const exdate = new Date()
    exdate.setHours(15)
    exdate.setMinutes(0)
    exdate.setSeconds(0)
    const now = new Date()
    if(exdate.getTime() < now.getTime()){
        Room.dispatch(setGlobalCtxMessage({type:'alert',
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
      dispatch(setGlobalCtxMessage({type:'confirm',
        msg: res.message,
        callback: () => {
          ;(async function () {
            const exit = await Api.broad_exit({data: {roomNo: roomNo}})
            //success,fail노출
            dispatch(setGlobalCtxMessage({type:'alert',
              msg: exit.message
            }))
          })()
        },
        buttonText: {
          left: '취소',
          right: '방송종료'
        }
      }))
      return false
    }
    //-----------------------------------
    if (res.result === 'success') {
      const {code} = res
      //비정상된 방이 있음 => 이어하기와 동일하게 수정
      if (code === '2') {
        const {roomNo} = res.data
        dispatch(setGlobalCtxMessage({type:'confirm',
          //msg: res.message,
          msg: '2시간 이내에 방송진행 내역이 있습니다. \n방송을 이어서 하시겠습니까?',
          subMsg: '※ 이어서 하면 모든 방송데이터 (방송시간, 청취자, 좋아요, 부스터, 선물)를 유지한 상태로 만들어집니다.',
          //새로 방송하기_클릭
          callback: () => {
            ;(async function () {
              const exit = await Api.broad_exit({data: {roomNo: roomNo}})
              //success,fail노출
              if (exit.result === 'success') {
                goRoomMake()
              } else {
                dispatch(setGlobalCtxMessage({type:'alert',
                  msg: exit.message
                }))
              }
            })()
          },
          //이어서 방송하기_클릭
          cancelCallback: () => {
            ;(async function () {
              let reToken = {}
              reToken = await Api.broadcast_normalize({data: {roomNo: roomNo}})
              console.log(reToken)
              if (reToken.result === 'success') {
                Hybrid('ReconnectRoom', reToken.data)
              } else {
                dispatch(setGlobalCtxMessage({type:'alert',
                  msg: reToken.message
                }))
              }
            })()
          },
          buttonText: {
            left: '이어서 방송하기',
            right: '새로 방송하기'
          }
        }))
        return false
      } else if (code === 'C100') {
        //방송 이어하기 가능
        dispatch(setGlobalCtxMessage({type:'confirm',
          msg: '2시간 이내에 방송진행 내역이 있습니다. \n방송을 이어서 하시겠습니까?',
          subMsg: '※ 이어서 하면 모든 방송데이터 (방송시간, 청취자, 좋아요, 부스터, 선물)를 유지한 상태로 만들어집니다.',
          callback: () => {
            goRoomMake()
          },
          cancelCallback: () => {
            ;(async function () {
              const continueRes = await Api.broad_continue({})
              if (continueRes.result === 'success') {
                Hybrid('ReconnectRoom', continueRes.data)
              } else {
                dispatch(setGlobalCtxMessage({type:'alert',
                  msg: continueRes.message
                }))
              }
            })()
          },
          buttonText: {
            left: '이어서 방송하기',
            right: '새로 방송하기'
          }
        }))
        return false
      }
      return true
    } else if (res.result === 'fail') {
      if(!res.message){
        dispatch(setGlobalCtxMessage({
          type:'alert',
          msg: res.message
        }))
      }
    }
  }
  //-----------------------------------------------------
  const {customHeader, token} = globalState || Room.globalState
  const _os = customHeader['os']

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
  goRoomMake()
}

async function goRoomMake() {
  let broadSetting = {}
  broadSetting['djListenerIn'] = false
  broadSetting['djListenerOut'] = false
  broadSetting['liveBadgeView'] = true
  broadSetting['isSpecial'] = false

  const apiSetting = await Api.getBroadcastSetting()
  if (apiSetting && apiSetting.result === 'success' && apiSetting.data) {
    broadSetting['djListenerIn'] = apiSetting.data['djListenerIn']
    broadSetting['djListenerOut'] = apiSetting.data['djListenerOut']
    broadSetting['liveBadgeView'] = apiSetting.data['liveBadgeView']
    broadSetting['isSpecial'] = apiSetting.data['isSpecial']
  }

  Hybrid('RoomMake', broadSetting)
}
