import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {Switch, Route, useParams, Redirect, useLocation, useHistory} from 'react-router-dom'
// component
import Layout from 'pages/common/layout'
import MyProfile from './content/myProfile.js'
//import Navigation from './content/navigation.js'
import Notice from './content/notice.js'
import FanBoard from './content/fanBoard.js'
import Initial from './content/initial.js'
import Wallet from './content/wallet.js'
import Report from './content/report.js'
import Alert from './content/alert.js'
import BroadcastSetting from './content/broadcastSetting.js'

// static
import closeBtn from 'pages/menu/static/ic_close.svg'

import InfoIcon from './static/profile/ic_info_m.svg'
import NoticeIcon from './static/profile/ic_notice_m.svg'
import FanboardIcon from './static/profile/ic_fanboard_m.svg'
import WalletIcon from './static/profile/ic_wallet_m.svg'
import ReportIcon from './static/profile/ic_report_m.svg'
import AlarmIcon from './static/profile/ic_alarm_m.svg'
import SettingIcon from './static/profile/ic_broadcastingsetting_m.svg'

import TimeIcon from './static/profile/ic_time_m_p.svg'
import HeadphoneIcon from './static/profile/ic_headphones_m_p.svg'
import HeartIcon from './static/profile/ic_headphones_m_p.svg'
import ByeolIcon from './static/profile/ic_star_m_p.svg'
import DalIcon from './static/profile/ic_moon_m_p.svg'

import NeedLoginImg from './static/profile/need_login.png'
import {Context} from 'context'
import Api from 'context/api'
import {isHybrid, Hybrid} from 'context/hybrid'
import qs from 'query-string'

export default props => {
  const {webview} = qs.parse(location.search)
  const urlrStr = props.location.pathname.split('/')[2]
  const history = useHistory()
  //navi
  let navigationList = [
    {id: 0, type: 'notice', component: Notice, txt: '공지사항'},
    {id: 1, type: 'fanboard', component: FanBoard, txt: '팬 보드'},
    {id: 2, type: 'initial', component: Initial, txt: 'initial'},
    {id: 3, type: 'wallet', component: Wallet, txt: '내 지갑'},
    {id: 4, type: 'report', component: Report, txt: '리포트'},
    {id: 5, type: 'alert', component: Alert, txt: '알림'},
    {id: 6, type: 'bcsetting', component: BroadcastSetting, txt: '방송 설정'}
  ]
  //context
  const context = useContext(Context)
  const globalCtx = useContext(Context)
  const {token, profile} = globalCtx
  let {memNo, type} = useParams()

  //프로필정보
  const [profileInfo, setProfileInfo] = useState(null)
  if (profile && profile.memNo !== memNo) {
    navigationList = navigationList.slice(0, 2)
  } else if (profile && profile.memNo === memNo) {
    memNo = profile.memNo
  }

  const clickCloseBtn = () => {
    if (isHybrid()) {
      Hybrid('CloseLayerPopup')
    }
  }
  //api:profile
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
  //타인 마이페이지 서브 컨텐츠 리스트
  const subNavList = [
    {type: 'notice', txt: '공지사항', icon: NoticeIcon},
    {type: 'fanboard', txt: '팬보드', icon: FanboardIcon}
  ]
  return (
    <Switch>
      {!token.isLogin && profile === null && <Redirect to={`/login`} />}
      {memNo && !type && <Redirect to={webview ? `/mypage/${memNo}/initial?webview=${webview}` : `/mypage/${memNo}/initial`} />}
      <Layout {...props} webview={webview}>
        <Mypage webview={webview}>
          {webview && webview === 'new' && <img className="close-btn" src={closeBtn} onClick={clickCloseBtn} />}
          {/* 초기 진입부 분기:type === 'initial' */}
          {type === 'initial' && <MyProfile profile={profileInfo} {...props} webview={webview} />}
          {type === 'initial' && (
            <Sub className={type === 'initial' ? 'on' : ''}>
              {subNavList.map((value, idx) => {
                const {type, txt, icon, component} = value
                return (
                  <a href={`/mypage/${memNo}/${type}`} key={idx}>
                    <div className="list">
                      <span className="text">{txt}</span>
                      <img className="icon" src={icon} />
                    </div>
                  </a>
                )
              })}
            </Sub>
          )}
          {/* {type && <Navigation list={navigationList} memNo={memNo} type={type} webview={webview} />} */}
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

  .close-btn {
    position: absolute;
    top: 6px;
    right: 2%;
  }

  @media (max-width: 1260px) {
    width: 91.11%;
  }
`
const Sub = styled.div`
  padding-bottom: 100px;
  transform: skew(-0.03deg);
  &.on {
    padding-bottom: 0;
  }
  a {
    display: block;
    .list {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      border-radius: 20px;
      border: 1px solid #eee;
      box-sizing: border-box;
      padding: 0 18px;
      margin: 4px 0;

      .text {
        color: #424242;
        font-size: 14px;
        letter-spacing: -0.35px;
        font-weight: 600;
      }
      .icon {
        display: block;
        width: 24px;
      }
    }
  }
`
