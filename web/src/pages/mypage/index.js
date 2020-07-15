import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {Switch, Route, useParams, Redirect, useLocation, useHistory} from 'react-router-dom'
// component
import Layout from 'pages/common/layout'
import MyProfile from './content/myProfile.js'
//import Navigation from './content/navigation.js'
import Notice from './content/notice.js'
import FanBoard from './content/fanBoard.js'
import Wallet from './content/wallet.js'
import Report from './content/report.js'
import Alert from './content/alert.js'
import BroadcastSetting from './content/broadcastSetting.js'
import AppAlarm from './content/appAlarm'

import {saveUrlAndRedirect} from 'components/lib/link_control.js'

// static
import closeBtn from './static/ic_back.svg'
import NoticeIcon from './static/profile/ic_notice_m.svg'
import FanboardIcon from './static/profile/ic_fanboard_m.svg'
import {Context} from 'context'
import Api from 'context/api'
import {isHybrid, Hybrid} from 'context/hybrid'
import qs from 'query-string'

export default props => {
  const {webview} = qs.parse(location.search)

  //navi
  let navigationList = [
    {id: 0, type: 'notice', component: Notice, txt: '방송공지'},
    {id: 1, type: 'fanboard', component: FanBoard, txt: '팬 보드'},
    {id: 2, type: 'wallet', component: Wallet, txt: '내 지갑'},
    {id: 3, type: 'report', component: Report, txt: '리포트'},
    {id: 4, type: 'alert', component: Alert, txt: '알림'},
    {id: 5, type: 'appAlarm', component: AppAlarm, txt: '어플알람'},
    {id: 6, type: 'bcsetting', component: BroadcastSetting, txt: '방송 설정'}
  ]
  //context
  const context = useContext(Context)
  const globalCtx = useContext(Context)
  const {token, profile} = context
  let {memNo, category} = useParams()
  var urlrStr = props.location.pathname.split('/')[2]
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

  if (!token.isLogin) {
    props.history.push('/login')
    return null
  }

  useEffect(() => {
    const settingProfileInfo = async memNo => {
      const profileInfo = await Api.profile({params: {memNo: memNo}})
      if (profileInfo.result === 'success') {
        setProfileInfo(profileInfo.data)
        context.action.updateProfile(profileInfo.data)
        if (profileInfo.code === '-2') {
            context.action.alert({
                callback: () => {
                    window.history.back()
                },
                msg: '회원정보를 찾을 수 없습니다.'
            });
        }
      }else{
        context.action.alert({
          callback: () => {
              window.history.back()
          },
          msg: '회원정보를 찾을 수 없습니다.'
        });
      }
    }
    if (memNo) {
      settingProfileInfo(memNo)
    }
  }, [context.mypageFanCnt])

  //타인 마이페이지 서브 컨텐츠 리스트
  const subNavList = [
    {type: 'notice', txt: '방송공지', icon: NoticeIcon},
    {type: 'fanboard', txt: '팬보드', icon: FanboardIcon}
  ]
  if (urlrStr === token.memNo && webview) {
    window.location.href = '/menu/profile'
  }

  return (
    <Switch>
      {!token.isLogin && profile === null && <Redirect to={`/login`} />}
        <Layout {...props} webview={webview} status="no_gnb">
            <Mypage webview={webview}>
              {webview && webview === 'new' && <img className="close-btn" src={closeBtn} onClick={clickCloseBtn}/>}
              {!category && (
                <>
                  <MyProfile profile={profileInfo} {...props} webview={webview}/>
                  {
                    profileInfo &&
                    <Sub>
                      {subNavList.map((value, idx) => {
                        const {type, txt, icon, component} = value
                        return (
                          <div className="link-list" key={`list-${idx}`}
                             onClick={() => saveUrlAndRedirect(`/mypage/${memNo}/${type}`)}>
                            <div className="list">
                              <span className="text">{txt}</span>
                              <img className="icon" src={icon}/>
                            </div>
                          </div>
                        )
                      })}
                    </Sub>
                  }
                </>
              )}

              <SubContent>
                {navigationList.map(value => {
                  const {type, component} = value
                  return <Route exact path={`/mypage/${memNo}/${type}`} component={component} key={type}/>
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
  margin-top: ${props => (props.webview ? 0 : '0px')};
  width: 1210px;

  .close-btn {
    position: absolute;
    top: 6px;
    left: 2%;
  }

  @media (max-width: 1260px) {
    width: 91.11%;
  }
`
const Sub = styled.div`
  padding-bottom: 100px;
  transform: skew(-0.03deg);

  .link-list {
    display: block;
    .list {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      border-radius: 20px;
      background-color: #f2f2f2;
      box-sizing: border-box;
      padding: 0 18px;
      margin: 4px 0;

      .text {
        color: #000000;
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
