import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import Navi from './navibar'
import SendDirect from './present-direct'
import SendItem from './present-item.js'
import Api from 'context/api'
import {Context} from 'context'
import {BroadCastStore} from '../../store'

const testData = [
  {
    level: 11,
    expNext: 160,
    exp: 140,
    guestYn: 'Y'
  }
]

const targetData = [
  {
    nickname: 'BJ라디오~~',
    type: 0
  },
  {
    nickname: '러브angel~~',
    type: 1
  }
]

const testBox = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

//-------------------------------------------------------- declare start
export default props => {
  const [sendType, setSendType] = useState(0)
  const context = useContext(Context)
  const store = useContext(BroadCastStore)
  //-------------------------------------------------------- func start

  // 선물하기
  async function send() {
    const res = await Api.send_gift({
      data: {
        roomNo: store.roomInfo.roomNo.toString(),
        memNo: context.token.memNo.toString(),
        itemNo: '1001',
        itemCnt: 1
      }
    })

    console.log('## res :', res)
  }

  useEffect(() => {}, [])

  //-------------------------------------------------------- components start
  console.log('## sendType : ', sendType)
  console.log('## store :', store)
  console.log('## context :', context)
  return (
    <Container>
      <Navi title={'선물'} />
      {sendType == 0 ? <SendItem targetData={targetData} testData={testData[0]} testBox={testBox} _sendType={setSendType} /> : <SendDirect />}
    </Container>
  )
}
//-------------------------------------------------------- styled start
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #fff;
  flex-direction: column;
  justify-content: space-between;
`
