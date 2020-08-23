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
import EditeFan from './content/edite_fan'
import EditeStar from './content/edite_stars'
// static
import MenuNoticeIcon from './static/menu_broadnotice.svg'
import MenuFanBoardeIcon from './static/menu_fanboard.svg'
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
    {id: 2, type: 'wallet', component: Wallet, txt: '내 지갑'},
    {id: 3, type: 'report', component: Report, txt: '리포트'},
    {id: 4, type: 'alert', component: Alert, txt: '알림'},
    {id: 5, type: 'appAlarm2', component: AppAlarm2, txt: '어플알람'},
    {id: 6, type: 'bcsetting', component: BroadcastSetting, txt: '방송 설정'},
    {id: 7, type: 'edite_fan', component: EditeFan, txt: '팬 관리'},
    {id: 8, type: 'edite_star', component: EditeStar, txt: '스타 관리'}
  ]
  //타인 마이페이지 서브 컨텐츠 리스트
  const subNavList2 = [
    {type: 'notice', txt: '방송공지', icon: MenuNoticeIcon},
    {type: 'fanboard', txt: '팬보드', icon: MenuFanBoardeIcon}
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
  const [myPageNew, setMyPageNew] = useState({})
  // memNo navi check
  if (profile && profile.memNo !== memNo) {
    navigationList = navigationList.slice(0, 2)
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
    console.log(globalCtx)
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

  return (
    <Switch>
      {!token.isLogin && profile === null && <Redirect to={`/login`} />}
      <Layout2 {...props} webview={webview} status="no_gnb">
        {/* 2.5v 리뉴얼 상대방 마이페이지 */}
        <div id="profile">
          <Mypage2 webview={webview}>
            {/*webview && webview === 'new' && <img className="close-btn" src={closeBtn} onClick={clickCloseBtn} />*/}
            {!category && (
              <>
                <MyProfile profile={profileInfo} {...props} webview={webview} locHash={props.location} />
                <Sub2>
                  {subNavList2.map((value, idx) => {
                    const {type, txt, icon, component} = value
                    return (
                      <div className="link-list" key={`list-${idx}`} onClick={() => history.push(`/mypage/${memNo}/${type}`)}>
                        <div className="list">
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
        </div>
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
  position: relative;
  .close-btn {
    position: absolute;
    left: 6px;
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

        &--active {
          &:before {
            content: '';
            display: block;
            width: 24px;
            height: 24px;
            margin-left: -28px;
            background: url(${newCircle});
          }
        }
      }
    }
  }
`
