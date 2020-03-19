import {isHybrid, Hybrid} from 'context/hybrid'
import Api from 'context/api'

export default async function joinRoom(roomNo) {
  const res = await Api.broad_join({data: {roomNo}})
  const {code, result, data} = res
  if (code === '-4') {
    const roomExit = await Api.broad_exit({data: {roomNo}})
    if (roomExit.result === 'success') {
      const roomJoin = await Api.broad_join({data: {roomNo}})
      if (roomJoin.result === 'success') {
        return data
      }
    }
  } else if (result === 'success') {
    return data
  } else {
    return null
  }
}
