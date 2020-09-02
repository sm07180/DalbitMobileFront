import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {Switch, Route, useParams, Redirect, useLocation, useHistory} from 'react-router-dom'
import {Context} from 'context'
import Api from 'context/api'
import {isHybrid, Hybrid} from 'context/hybrid'
import qs from 'query-string'
// components
import Layout2 from 'pages/common/layout2.5'
import MyProfile from './content/myProfile.js'
//import Navigation from './content/navigation.js'
import {saveUrlAndRedirect} from 'components/lib/link_control.js'
import BroadcastSetting from './content/broadcastSetting.js'
import AppAlarm2 from './content/appAlarm2'
import Notice from './content/notice.js'
import FanBoard from './content/fanBoard.js'
import Wallet from './content/wallet.js'
import Report from './content/report.js'
import Alert from './content/alert.js'
import EditFan from './content/edit_fan'
import EditStar from './content/edit_stars'
import MyClip from './content/myclip'
// static
import MenuNoticeIcon from './static/menu_broadnotice.svg'
import MenuFanBoardeIcon from './static/menu_fanboard.svg'
import ClipIcon from './static/menu_cast.svg'
import Arrow from './static/arrow.svg'
import newCircle from './static/new_circle.svg'
import NoticeIcon from './static/profile/ic_notice_m.svg'
import FanboardIcon from './static/profile/ic_fanboard_m.svg'

import './index.scss'

//new State
let NewState = {
  fanboard: false,
  notice: false,
  wallet: false
}
export default (props) => {
  const {webview} = qs.parse(location.search)
  let history = useHistory()

  //navi Array
  let navigationList = [
    {id: 0, type: 'notice', component: Notice, txt: '방송공지'},
    {id: 1, type: 'fanboard', component: FanBoard, txt: '팬 보드'},
    {id: 9, type: 'my_clip', component: MyClip, txt: '클립'},
    {id: 2, type: 'wallet', component: Wallet, txt: '내 지갑'},
    {id: 3, type: 'report', component: Report, txt: '리포트'},
    {id: 4, type: 'alert', component: Alert, txt: '알림'},
    {id: 5, type: 'appAlarm2', component: AppAlarm2, txt: '어플알람'},
    {id: 6, type: 'bcsetting', component: BroadcastSetting, txt: '방송 설정'},
    {id: 7, type: 'edit_fan', component: EditFan, txt: '팬 관리'},
    {id: 8, type: 'edit_star', component: EditStar, txt: '스타 관리'}
  ]
  //타인 마이페이지 서브 컨텐츠 리스트
  const subNavList2 = [
    {type: 'notice', txt: '방송공지', icon: MenuNoticeIcon},
    {type: 'fanboard', txt: '팬보드', icon: MenuFanBoardeIcon},
    {type: 'my_clip', txt: '클립', icon: ClipIcon}
  ]
  //context
  const context = useContext(Context)
  const globalCtx = useContext(Context)
  const {token, profile} = context
  //memNo Info
  let {memNo, category} = useParams()
  useEffect(() => {
    context.action.updateUrlStr(memNo)
  }, [])
  //state
  //프로필정보
  const [profileInfo, setProfileInfo] = useState(null)
  const [codes, setCodes] = useState('')
  const [myPageNew, setMyPageNew] = useState({})
  // memNo navi check
  if (profile && profile.memNo !== memNo) {
    navigationList = navigationList.slice(0, 3)
  } else if (profile && profile.memNo === memNo) {
    // memNo = profile.memNo
  }

  // close hybrid func
  const clickCloseBtn = () => {
    if (isHybrid()) {
      Hybrid('CloseLayerPopup')
      context.action.updatenoticeIndexNum('')
    } else {
      window.history.go(-1)
    }
  }
  //check login push login
  if (!token.isLogin) {
    props.history.push('/login')
    return null
  }
  //--------------------------------------------
  useEffect(() => {
    const getMyPageNew = async () => {
      const res = await Api.getMyPageNew(memNo)
      setMyPageNew(res.data)
    }
    getMyPageNew()
  }, [])

  useEffect(() => {
    const settingProfileInfo = async (memNo) => {
      const profileInfo = await Api.profile({params: {memNo: memNo}})
      if (profileInfo.result === 'success') {
        setProfileInfo(profileInfo.data)
        if (profileInfo.code === '-2') {
          context.action.alert({
            callback: () => {
              window.history.back()
            },
            msg: '회원정보를 찾을 수 없습니다.'
          })
        }
      } else {
        context.action.alert({
          callback: () => {
            window.history.back()
          },
          msg: '회원정보를 찾을 수 없습니다.'
        })
      }
    }

    if (memNo) {
      settingProfileInfo(memNo)
    }
  }, [memNo, context.mypageFanCnt])

  // check 탈퇴회원
  useEffect(() => {
    if (codes === '-2') {
      context.action.alert({
        callback: () => {
          window.history.back()
        },
        msg: '회원정보를 찾을 수 없습니다.'
      })
    }
  }, [codes])
  // my MemNo vs Your check
  if (memNo === token.memNo && webview && webview !== 'new') {
    window.location.href = '/menu/profile?webview=' + webview
  }
  if (codes !== '-2' && (!profileInfo || !profile)) {
    return null
  }

  const locationNav = (type) => {
    context.action.updateFanboardReplyNum(false)
    context.action.updateFanboardReply(false)
    context.action.updateToggleAction(false)
    history.push(`/mypage/${memNo}/${type}`)
  }
  return (
    <Switch>
      {!token.isLogin && profile === null && <Redirect to={`/login`} />}
      <Layout2 {...props} webview={webview} status="no_gnb">
        {/* 2.5v 리뉴얼 상대방 마이페이지 */}
        <div id="mypage">
          {/*webview && webview === 'new' && <img className="close-btn" src={closeBtn} onClick={clickCloseBtn} />*/}
          {!category && (
            <>
              <MyProfile profile={profileInfo} {...props} webview={webview} locHash={props.location} />
              <div className="profile-menu">
                {subNavList2.map((value, idx) => {
                  const {type, txt, icon, component} = value
                  return (
                    <button className="list" key={`list-${idx}`} onClick={() => locationNav(type)}>
                      <img className="icon" src={icon} />
                      <span className="text">{txt}</span>
                      <span
                        className={
                          type === 'notice'
                            ? myPageNew.broadNotice
                              ? 'arrow arrow--active'
                              : 'arrow'
                            : type === 'fanboard'
                            ? myPageNew.fanBoard
                              ? 'arrow arrow--active'
                              : 'arrow'
                            : 'arrow'
                        }></span>
                    </button>
                  )
                })}
              </div>
            </>
          )}
          <React.Fragment>
            {navigationList.map((value) => {
              const {type, component} = value
              return <Route exact path={`/mypage/${memNo}/${type}`} component={component} key={type} />
            })}
          </React.Fragment>
        </div>
      </Layout2>
    </Switch>
  )
}
