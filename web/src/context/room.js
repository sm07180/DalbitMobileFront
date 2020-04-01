/**
 *
 */
import React, {useContext} from 'react'
//context
import Api from 'context/api'
import {Hybrid} from 'context/hybrid'
import {Context} from 'context'
//
const Room = () => {
  //context
  const context = useContext(Context)
  //interface
  Room.context = context
  //-----------------------------------------------------------
  return <React.Fragment />
}
export default Room
//-----------------------------------------------------------
/**
 * @title 방송방입장
 * @param {roomNo} string
 * @param {callbackFunc} function //여러번 클릭을막기위해 필요시 flag설정
 */
export const RoomJoin = async (roomNo, callbackFunc) => {
  const res = await Api.broad_join({data: {roomNo: roomNo}})
  if (callbackFunc !== undefined) callbackFunc()
  if (res.result === 'fail') {
    switch (res.code) {
      case '-4': //----------------------------이미 참가 되어있습니다
        Room.context.action.confirm({
          callback: () => {
            //강제방송종료
            ;(async () => {
              //입장되어있으면 퇴장처리 이후,success 일때 다시RoomJoin
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
      '%c' + `Native: RoomJoin`,
      'display:block;width:100%;padding:5px 10px;font-weight:bolder;font-size:14px;color:#000;background:orange;'
    )
    //하이브리드앱실행
    Hybrid('RoomJoin', data)
    return true
  }
}
/**
 * @title 방송방종료
 * @param {roomNo} string
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
