import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {Switch, Route, useParams, Redirect, useLocation} from 'react-router-dom'

// component
import Layout from 'pages/common/layout'
import MyProfile from './content/myProfile.js'
import Navigation from './content/navigation.js'
import Notice from './content/notice.js'
import FanBoard from './content/fanBoard.js'
import Cast from './content/cast.js'
import Wallet from './content/wallet.js'
import Report from './content/report.js'
import Alert from './content/alert.js'
import BroadcastSetting from './content/broadcastSetting.js'

// static
import closeBtn from 'pages/menu/static/ic_close.svg'

import {Context} from 'context'
import Api from 'context/api'
import qs from 'query-string'

export default props => {
  const {webview} = qs.parse(location.search)

  let navigationList = [
    {id: 0, type: 'notice', component: Notice, txt: '공지사항'},
    {id: 1, type: 'fanboard', component: FanBoard, txt: '팬 보드'},
    // //{id: 2, type: 'cast', component: Cast, txt: '캐스트'},
    {id: 3, type: 'wallet', component: Wallet, txt: '내 지갑'},
    {id: 4, type: 'report', component: Report, txt: '리포트'},
    {id: 5, type: 'alert', component: Alert, txt: '알림'},
    {id: 6, type: 'bcsetting', component: BroadcastSetting, txt: '방송 설정'}
  ]
  const context = useContext(Context)
  const globalCtx = useContext(Context)
  const {token, profile} = globalCtx
  let {memNo, type} = useParams()

  const [profileInfo, setProfileInfo] = useState(null)

  if (profile && profile.memNo !== memNo) {
    navigationList = navigationList.slice(0, 2)
  } else if (profile && profile.memNo === memNo) {
    memNo = profile.memNo
  }

  useEffect(() => {
    const settingProfileInfo = async memNo => {
      const profileInfo = await Api.profile({params: {memNo: memNo}})
      if (profileInfo.result === 'success') {
        setProfileInfo(profileInfo.data)
      }
    }

    if (memNo) {
      settingProfileInfo(memNo)
    }
  }, [context.mypageFanCnt])

  return (
    <Switch>
      {!token.isLogin && profile === null && <Redirect to={`/login`} />}
      {memNo && !type && <Redirect to={webview ? `/mypage/${memNo}/fanboard?webview=${webview}` : `/mypage/${memNo}/fanboard`} />}
      <Layout {...props} webview={webview}>
        <Mypage webview={webview}>
          <MyProfile profile={profileInfo} {...props} webview={webview} />
          {type && <Navigation list={navigationList} memNo={memNo} type={type} webview={webview} />}
          <SubContent>
            {navigationList.map(value => {
              const {type, component} = value
              return <Route exact path={`/mypage/${memNo}/${type}`} component={component} key={type} />
            })}
          </SubContent>
        </Mypage>
      </Layout>
    </Switch>
  )
}

const SubContent = styled.div`
  margin: 0 auto;
`

const Mypage = styled.div`
  margin: 0 auto 15px auto;
  margin-top: ${props => (props.webview ? 0 : '60px')};
  width: 1210px;

  @media (max-width: 1260px) {
    width: 91.11%;
  }
`
