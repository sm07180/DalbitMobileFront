import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {Switch, Route, useParams, Redirect, useLocation, useHistory} from 'react-router-dom'
import {Context} from 'context'
import Api from 'context/api'
import {isHybrid, Hybrid} from 'context/hybrid'
import qs from 'query-string'
// components
import Layout2 from 'pages/common/layout2.5'
import MyProfile2 from './content/myProfile2.js'
//import Navigation from './content/navigation.js'
import {saveUrlAndRedirect} from 'components/lib/link_control.js'
import BroadcastSetting from './content/broadcastSetting.js'
import AppAlarm2 from './content/appAlarm2'
import Notice from './content/noticeBefore.js'
import FanBoard from './content/fanBoard.js'
import Wallet from './content/wallet.js'
import Report from './content/report.js'
import Alert from './content/alert.js'
import EditeFan from './content/edite_fan'
// static
import MenuNoticeIcon from './static/menu_broadnotice.svg'
import MenuFanBoardeIcon from './static/menu_fanboard.svg'
import Arrow from './static/arrow.svg'
import closeBtn from './static/ic_back.svg'
import NoticeIcon from './static/profile/ic_notice_m.svg'
import FanboardIcon from './static/profile/ic_fanboard_m.svg'

export default (props) => {
  const {webview} = qs.parse(location.search)
  //navi Array
  let navigationList = [
    {id: 0, type: 'notice', component: Notice, txt: '방송공지'},
    {id: 1, type: 'fanboard', component: FanBoard, txt: '팬 보드'},
    {id: 2, type: 'wallet', component: Wallet, txt: '내 지갑'},
    {id: 3, type: 'report', component: Report, txt: '리포트'},
    {id: 4, type: 'alert', component: Alert, txt: '알림'},
    {id: 5, type: 'appAlarm2', component: AppAlarm2, txt: '어플알람'},
    {id: 6, type: 'bcsetting', component: BroadcastSetting, txt: '방송 설정'},
    {id: 7, type: 'editeFan', component: EditeFan, txt: '팬 관리'}
  ]
  //타인 마이페이지 서브 컨텐츠 리스트
  const subNavList2 = [
    {type: 'notice', txt: '방송공지', icon: MenuNoticeIcon},
    {type: 'fanboard', txt: '팬보드', icon: MenuFanBoardeIcon},
    {type: 'editeFan', txt: '팬관리', icon: MenuFanBoardeIcon}
  ]
  //context
  const context = useContext(Context)
  const globalCtx = useContext(Context)
  const {token, profile} = context
  //memNo Info
  let {memNo, category} = useParams()
  var urlrStr = props.location.pathname.split('/')[2]
  //state
  //프로필정보
  const [profileInfo, setProfileInfo] = useState(null)
  const [codes, setCodes] = useState('')
  // memNo navi check
  if (profile && profile.memNo !== memNo) {
    navigationList = navigationList.slice(0, 2)
  } else if (profile && profile.memNo === memNo) {
    memNo = profile.memNo
  }
  // close hybrid func
  const clickCloseBtn = () => {
    if (isHybrid()) {
      Hybrid('CloseLayerPopup')
    }
  }
  //check login push login
  if (!token.isLogin) {
    props.history.push('/login')
    return null
  }
  //--------------------------------------------
  useEffect(() => {
    const settingProfileInfo = async (memNo) => {
      const profileInfo = await Api.profile({params: {memNo: memNo}})
      if (profileInfo.result === 'success') {
        setProfileInfo(profileInfo.data)
        context.action.updateProfile(profileInfo.data)
        if (profileInfo.code === '-2') {
          context.action.alert({
            callback: () => {
              window.history.back()
            },
            msg: '탈퇴한 회원입니다.'
          })
        }
      } else {
        context.action.alert({
          callback: () => {
            window.history.back()
          },
          msg: '탈퇴한 회원입니다.'
        })
      }
    }
    if (memNo) {
      settingProfileInfo(memNo)
    }
  }, [context.mypageFanCnt])

  // check 탈퇴회원
  useEffect(() => {
    if (codes === '-2') {
      context.action.alert({
        callback: () => {
          window.history.back()
        },
        msg: '탈퇴한 회원입니다.'
      })
    }
  }, [codes])
  // my MemNo vs Your check
  if (urlrStr === token.memNo && webview) {
    window.location.href = '/menu/profile'
  }
  if (codes !== '-2' && (!profileInfo || !profile)) {
    return null
  }
  return (
    <Switch>
      {!token.isLogin && profile === null && <Redirect to={`/login`} />}
      <Layout2 {...props} webview={webview} status="no_gnb">
        {/* 2.5v 리뉴얼 상대방 마이페이지 */}
        <Mypage2 webview={webview}>
          {webview && webview === 'new' && <img className="close-btn" src={closeBtn} onClick={clickCloseBtn} />}
          {!category && (
            <>
              <MyProfile2 profile={profileInfo} {...props} webview={webview} />
              <Sub2>
                {subNavList2.map((value, idx) => {
                  const {type, txt, icon, component} = value
                  return (
                    <div className="link-list" key={`list-${idx}`} onClick={() => saveUrlAndRedirect(`/mypage/${memNo}/${type}`)}>
                      <div className="list">
                        <img className="icon" src={icon} />
                        <span className="text">{txt}</span>
                        <span className="arrow"></span>
                      </div>
                    </div>
                  )
                })}
              </Sub2>
            </>
          )}
          <SubContent>
            {navigationList.map((value) => {
              const {type, component} = value
              return <Route exact path={`/mypage/${memNo}/${type}`} component={component} key={type} />
            })}
          </SubContent>
        </Mypage2>
      </Layout2>
    </Switch>
  )
}
// styled-------------------------------------------------------------------------
const SubContent = styled.div`
  margin: 0 auto;
`
const Mypage2 = styled.div`
  margin-top: ${(props) => (props.webview ? 0 : '0px')};
  width: 1210px;
  position: relative;
  .close-btn {
    position: absolute;
    left: 6px;
  }
  @media (max-width: 1260px) {
    width: 100%;
  }
`
const Sub2 = styled.div`
  transform: skew(-0.03deg);
  background-color: #eeeeee;
  margin-top: 12px;
  .link-list {
    display: block;
    .list {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 48px;
      background-color: #fff;
      box-sizing: border-box;
      padding: 0 16px;
      border-bottom: 1px solid #eee;
      .text {
        color: #000000;
        font-size: 14px;
        letter-spacing: -0.35px;
        font-weight: 800;
      }
      .icon {
        display: block;
        width: 32px;
        margin-right: 12px;
      }
      .arrow {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        width: 24px;
        height: 24px;
        background: url(${Arrow}) no-repeat center center / cover;
      }
    }
  }
`
