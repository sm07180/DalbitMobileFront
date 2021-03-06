import React, {useContext, useEffect, useState} from 'react'
import styled from 'styled-components'
import Navi from './navibar'
import SendDirect from './present-direct'
import SendItem from './present-item.js'
import Api from 'context/api'
import {BroadCastStore} from 'pages/broadcast/store'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxUpdateProfile} from "redux/actions/globalCtx";

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
export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const [sendType, setSendType] = useState(0)
  const store = useContext(BroadCastStore)
  const [profile, setProfile] = useState()
  const [common, setCommon] = useState()
  const [state, setState] = useState(false)
  //-------------------------------------------------------- func start

  // 선물하기
  async function send(count, itemNo, flag) {
    if (itemNo < 0) {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        callback: () => {
          return
        },
        // title: '달라',
        msg: '아이템을 선택해 주세요'
      }))
    }

    const res = await Api.send_gift({
      data: {
        roomNo: globalState.broadcastTotalInfo.roomNo,
        memNo: globalState.broadcastTotalInfo.bjMemNo,
        itemNo: itemNo,
        itemCnt: count,
        isSecret: flag
      }
    })
    if (res.result === 'success') {
      // 프로필 업데이트 profile api에는 dalRate가 없어서 member_info_view 조회함 profile에 dalRate 추가 후 profile 만 호출하도록 변경해야 함
      broadProfile()
      // 선물 보내고 context.profile 업데이트
      const profile = await Api.profile({params: {memNo: globalState.token.memNo}})
      if (profile.result === 'success') {
        dispatch(setGlobalCtxUpdateProfile(profile.data));
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
      console.log('방송 프로필 = ' + res.data)
      store.action.updateBroadcastProfileInfo(res.data)
      //setProfile(res.data)
    }
  }

  // 공통
  async function commonData() {
    const res = await Api.splash({})
    if (res.result === 'success') {
      setCommon(res.data)
    }
  }

  //선물하기 진입 시 필요데이터 조회
  useEffect(() => {
    setProfile(store.broadcastProfileInfo)
    broadProfile()
    commonData()
  }, [])

  //-------------------------------------------------------- components start
  return (
    <Container>
      <Navi title={'선물'} prev={props.prev} _changeItem={props._changeItem} />
      {store.giftSendType == 0 ? (
        <SendItem
          // testData={testData[0]}
          // testBox={testBox}
          _sendType={setSendType}
          profile={store.broadcastProfileInfo}
          send={send}
          common={common}
          bjNickNm={globalState.broadcastTotalInfo.bjNickNm}
          flag={state}
        />
      ) : (
        <SendDirect profile={store.broadcastProfileInfo} />
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
