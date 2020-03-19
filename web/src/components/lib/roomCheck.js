import {isHybrid, Hybrid} from 'context/hybrid'
import Api from 'context/api'

export default async function roomCheck(roomNo, ctx, errorCallback) {
  const res = await Api.broad_join({data: {roomNo}})
  const {code, result, data} = res
  if (code === '-4') {
    const roomExit = await Api.broad_exit({data: {roomNo}})
    if (roomExit.result === 'success') {
      const roomJoin = await Api.broad_join({data: {roomNo}})
      if (roomJoin.result === 'success') {
        return roomJoin.data
      }
    }
  } else if (code === '-2') {
    ctx.action.alert({
      msg: 'BJ가 없습니다.',
      callback: () => {
        if (errorCallback) errorCallback()
      }
    })
  } else if (code === '-3') {
    ctx.action.alert({
      msg: '종료된 방송입니다.',
      callback: () => {
        if (errorCallback) errorCallback()
      }
    })
  } else if (code === '-5') {
    ctx.action.alert({
      msg: '입장이 제한되었습니다.',
      callback: () => {
        if (errorCallback) errorCallback()
      }
    })
  } else if (result === 'success') {
    return data
  }
  return null
}
