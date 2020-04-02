import React, {useEffect, useContext} from 'react'
import styled from 'styled-components'
import {Switch, Route, useParams} from 'react-router-dom'

// component
import Layout from 'pages/common/layout/new_index.js'

import {Context} from 'context'
import Api from 'context/api'

export default props => {
  let navigationList = [
    // {id: 0, type: 'notice', component: Notice, txt: '공지사항'},
    // {id: 1, type: 'fanboard', component: FanBoard, txt: '팬 보드'},
    // //{id: 2, type: 'cast', component: Cast, txt: '캐스트'},
    // {id: 3, type: 'wallet', component: Wallet, txt: '내 지갑'},
    // {id: 4, type: 'report', component: Report, txt: '리포트'}
    // // {id: 5, type: 'alert', component: Alert, txt: '알림'},
    // // {id: 6, type: 'bcsetting', component: BroadcastSetting, txt: '방송 설정'}
  ]

  const globalCtx = useContext(Context)
  const {token, profile} = globalCtx
  const {memNo, sub} = useParams()

  console.log(token.isLogin)
  console.log(profile)
  console.log(memNo)

  return (
    <Layout {...props}>
      <Mypage>dfdf</Mypage>
    </Layout>
  )
}

const Mypage = styled.div``
