import {isHybrid, Hybrid} from 'context/hybrid'
import Api from 'context/api'

export default async function joinRoom(roomNo) {
  const res = await Api.broad_join({roomNo})
  console.log(res)
}
