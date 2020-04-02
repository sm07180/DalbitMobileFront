import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {Switch, Route, useParams} from 'react-router-dom'

// component
import Layout from 'pages/common/layout/new_index.js'
import MyProfile from './content/myProfile.js'
import Navigation from './content/navigation.js'
import Notice from './content/notice.js'
import FanBoard from './content/fanBoard.js'
import Cast from './content/cast.js'
import Wallet from './content/wallet.js'
import Report from './content/report.js'
import Alert from './content/alert.js'
import BroadcastSetting from './content/broadcastSetting.js'

import {Context} from 'context'
import Api from 'context/api'

export default props => {
  let navigationList = [
    {id: 0, type: 'notice', component: Notice, txt: '공지사항'},
    {id: 1, type: 'fanboard', component: FanBoard, txt: '팬 보드'},
    // //{id: 2, type: 'cast', component: Cast, txt: '캐스트'},
    {id: 3, type: 'wallet', component: Wallet, txt: '내 지갑'},
    {id: 4, type: 'report', component: Report, txt: '리포트'}
    // // {id: 5, type: 'alert', component: Alert, txt: '알림'},
    // // {id: 6, type: 'bcsetting', component: BroadcastSetting, txt: '방송 설정'}
  ]

  const globalCtx = useContext(Context)
  const {token, profile} = globalCtx
  let {memNo, type} = useParams()

  const [profileInfo, setProfileInfo] = useState(null)

  if (!token.isLogin && profile === null) {
    // props.history.push('/')
  }
  if (profile.memNo !== memNo) {
    navigationList = navigationList.slice(0, 2)
  } else {
    memNo = profile.memNo
  }

  useEffect(() => {
    const settingProfileInfo = async memNo => {
      const profileInfo = await Api.profile({params: {memNo: memNo}})
      if (profileInfo.result === 'success') {
        setProfileInfo(profileInfo.data)
      }
    }

    settingProfileInfo(memNo)
  }, [])

  return (
    <Layout {...props}>
      <MyProfile profile={profileInfo} />
      <Navigation list={navigationList} memNo={memNo} type={type} />
      <Mypage></Mypage>
    </Layout>
  )
}

const Mypage = styled.div``
