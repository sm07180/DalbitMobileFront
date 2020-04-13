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
import React, {useState, useContext} from 'react'

//context
import Api from 'context/api'
import {Hybrid} from 'context/hybrid'
import {Context} from 'context'

import {OS_TYPE} from 'context/config.js'

//
const Room = () => {
  //context
  const context = useContext(Context)
  //useState
  const [roomNo, setRoomNo] = useState('')
  const [auth, setAuth] = useState(false)
  //interface
  Room.context = context
  Room.roomNo = roomNo
  Room.auth = auth
  Room.setRoomNo = num => setRoomNo(num)
  Room.setAuth = bool => setAuth(bool)
  //-----------------------------------------------------------
  // useEffect(() => {
  //   console.log('Room.roomNo : ' + Room.roomNo)
  // }, [Room.roomNo])
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
export const RoomJoin = async (roomNo, callbackFunc) => {
  /**
   * @title Room.roomNo , roomNo 비교
   */
  if (Room.roomNo === roomNo) {
    const join = await Api.broad_join({data: {roomNo: roomNo}})
    console.log(join)
    if (join.result === 'fail') {
      Room.context.action.alert({
        title: join.messageKey,
        msg: join.message
      })
    } else if (join.result === 'success') {
      Hybrid('RoomJoin', join.data)
      console.log(
        '%c' + `Native: Room.roomNo === roomNo,RoomJoin실행`,
        'display:block;width:100%;padding:5px 10px;font-weight:bolder;font-size:14px;color:#fff;background:navy;'
      )
    }
    //
    if (callbackFunc !== undefined) callbackFunc()
    return false
  } else {
    //-------------------------------------------------------------
    //authCheck
    Hybrid('AuthCheck')
    if (!Room.setAuth) {
      alert('Room.setAuth ' + Room.setAuth)
      return
    }
    Room.setRoomNo(roomNo)
    //방송강제퇴장
    const exit = await Api.broad_exit({data: {roomNo: roomNo}})
    console.log(exit)
    //방송JOIN
    const res = await Api.broad_join({data: {roomNo: roomNo}})
    console.log(res)
    //REST 'success'/'fail' 완료되면 callback처리 중복클릭제거
    if (callbackFunc !== undefined) callbackFunc()
    //
    if (res.result === 'fail') {
      switch (res.code) {
        case '-4': //----------------------------이미 참가 되어있습니다
          Room.context.action.confirm({
            callback: () => {
              //강제방송종료
              ;(async () => {
                //입장되어있으면 퇴장처리 이후,success 일때 다시 재귀RoomJoin
                const result = await RoomExit(roomNo + '')
                if (result) RoomJoin(roomNo + '')
              })()
            },
            title: res.messageKey,
            msg: res.message
          })
          break
        default:
          //----------------------------
          Room.context.action.alert({
            title: res.messageKey,
            msg: res.message
          })
          break
      }
      return false
    } else if (res.result === 'success') {
      //성공일때
      const {data} = res
      console.log(
        '%c' + `Native: RoomJoin실행`,
        'display:block;width:100%;padding:5px 10px;font-weight:bolder;font-size:14px;color:#000;background:orange;'
      )
      //하이브리드앱실행
      Hybrid('RoomJoin', data)
      Room.setAuth(false)
      return true
    }
  }
}
/**
 * @title 방송방종료
 * @param {roomNo} string           //방송방번호
 */
export const RoomExit = async roomNo => {
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
export const RoomMake = async context => {
  /**
   * @title 방송방체크
   * @code (1: 방송중, 2:마이크Off, 3:통화중, 4:방송종료, 5: 비정상(dj 종료된상태))
   */
  async function broadCheck(obj) {
    const res = await Api.broad_check()
    console.log(res)
    //진행중인 방송이 없습니다
    if (res.code === '0') return true
    //진행중인 방송이 있습니다
    if (res.code === '1') {
      context.action.alert({
        msg: res.message
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
            ;(async function() {
              const reToken = await Api.broadcast_reToken({data: {roomNo: roomNo}})
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
            ;(async function() {
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
