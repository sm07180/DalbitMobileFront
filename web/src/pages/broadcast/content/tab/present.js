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

const testBox = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

//-------------------------------------------------------- declare start
export default props => {
  const [sendType, setSendType] = useState(0)
  const context = useContext(Context)
  const store = useContext(BroadCastStore)
  const [profile, setProfile] = useState()
  const [common, setCommon] = useState()
  const [state, setState] = useState(false)
  //-------------------------------------------------------- func start

  // 선물하기
  async function send(count, itemNo, flag) {
    if (itemNo < 0) {
      context.action.alert({
        callback: () => {
          return
        },
        // title: '달빛라디오',
        msg: '아이템을 선택해 주세요'
      })
    }
    const res = await Api.send_gift({
      data: {
        roomNo: store.roomInfo.roomNo,
        memNo: store.roomInfo.bjMemNo,
        itemNo: itemNo,
        itemCnt: count,
        isSecret: flag
      }
    })
    if (res.result === 'success') {
      // 프로필 업데이트 profile api에는 dalRate가 없어서 member_info_view 조회함 profile에 dalRate 추가 후 profile 만 호출하도록 변경해야 함
      broadProfile()
      // 선물 보내고 context.profile 업데이트
      const profile = await Api.profile({params: {memNo: context.token.memNo}})
      if (profile.result === 'success') {
        context.action.updateProfile(profile.data)
      }
    }
    setState(!state)
  }

  //방송 프로필
  const broadProfile = async () => {
    const res = await Api.member_info_view({
      method: 'GET'
    })
    if (res.result === 'success') {
      setProfile(res.data)
    }
  }

  // 공통
  async function commonData() {
    const res = await Api.splash({})
    if (res.result === 'success') setCommon(res.data)
  }

  //선물하기 진입 시 필요데이터 조회
  useEffect(() => {
    broadProfile()
    commonData()
  }, [])

  //-------------------------------------------------------- components start
  return (
    <Container>
      <Navi title={'선물'} prev={props.prev} _changeItem={props._changeItem} />
      {sendType == 0 ? (
        <SendItem testData={testData[0]} testBox={testBox} _sendType={setSendType} profile={profile} send={send} common={common} bjNickNm={store.roomInfo.bjNickNm} flag={state} />
      ) : (
        <SendDirect />
      )}
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
  /* justify-content: space-between; */
`
