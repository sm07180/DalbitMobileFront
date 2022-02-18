import React, {useState, useEffect, useContext, useRef} from 'react'
import {Switch, Route, useParams, Redirect, useLocation, useHistory} from 'react-router-dom'
import {Context} from 'context'
import Api from 'context/api'
import {isHybrid, Hybrid} from 'context/hybrid'
import Utility from 'components/lib/utility'
import qs from 'query-string'
// components
import Layout2 from 'pages/common/layout2.5'
import MyProfile from './content/myProfile.js'
import BroadcastSetting from './content/broadcastSetting.js'
import AppAlarm2 from './content/appAlarm2'
import Notice from './content/notice'
import FanBoard from './content/fanBoard.js'
import Wallet from './content/wallet.js'
import Report from './content/report.js'
import Alert from './content/alert'
import EditFan from './content/edit_fan'
import EditStar from './content/edit_stars'
import MyClip from './content/myclip'

// static
import MenuNoticeIcon from './static/menu_broadnotice.svg'
import MenuFanBoardeIcon from './static/menu_fanboard.svg'
// scss
import ClipIcon from './static/menu_cast.svg'
import './index.scss'
import {OS_TYPE} from 'context/config'
// header scroll flag
export default (props) => {
  const location = useLocation()
  const {webview, tab} = qs.parse(location.search)
  let history = useHistory()
  //context
  const context = useContext(Context)
  const {token, profile} = context

  let {memNo, category, addpage} = useParams()

  if (webview && webview === 'new') {
    sessionStorage.setItem('webview', 'new')
  }
  //프로필정보
  const [profileInfo, setProfileInfo] = useState(null)
  const [codes, setCodes] = useState('')
  const [myPageNew, setMyPageNew] = useState({})
  const [tabSelected, setTabSelected] = useState(0)
  const mypageRef = useRef()
  const [showWriteBtn, setShowWriteBtn] = useState(false)
  const [mypageFixed, setMypageFixed] = useState(false)

  // scroll fixed func
  const windowScrollEvent = () => {
    if (mypageRef.current) {
      const myPageHeaderNode = mypageRef.current
      const myPageHeaderHeight = myPageHeaderNode.clientHeight
      // const TopSectionHeight = myPageHeaderHeight

      if (window.scrollY >= myPageHeaderHeight) {
        setShowWriteBtn(true)
        setMypageFixed(true)
      } else {
        setShowWriteBtn(false)
        setMypageFixed(false)
      }
    }
  }
  useEffect(() => {
    setMypageFixed(false)

    window.addEventListener('scroll', windowScrollEvent)
    return () => {
      window.removeEventListener('scroll', windowScrollEvent)
    }
  }, [memNo, category])

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
  let mypageNavList
  if (sessionStorage.getItem('webview') === 'new') {
    if (context.customHeader['os'] === OS_TYPE['IOS'] || context.customHeader['appBuild'] >= 35) {
      mypageNavList = [
        {type: 'notice', txt: '방송공지', component: Notice, icon: MenuNoticeIcon},
        {type: 'fanboard', txt: '팬보드', component: FanBoard, icon: MenuFanBoardeIcon},
        {type: 'my_clip', txt: '클립', component: MyClip, icon: ClipIcon}
      ]
    } else {
      mypageNavList = [
        {type: 'notice', txt: '방송공지', component: Notice, icon: MenuNoticeIcon},
        {type: 'fanboard', txt: '팬보드', component: FanBoard, icon: MenuFanBoardeIcon}
      ]
    }
  } else {
    mypageNavList = [
      {type: 'notice', txt: '방송공지', component: Notice, icon: MenuNoticeIcon},
      {type: 'fanboard', txt: '팬보드', component: FanBoard, icon: MenuFanBoardeIcon},
      {type: 'my_clip', txt: '클립', component: MyClip, icon: ClipIcon}
    ]
  }

  // if (
  //   __NODE_ENV === 'dev' &&
  //   (Utility.getCookie('listen_room_no') ||
  //     Utility.getCookie('listen_room_no') !== undefined ||
  //     Utility.getCookie('listen_room_no') !== 'null')
  // ) {
  //   mypageNavList = [
  //     {type: 'notice', txt: '방송공지', component: Notice, icon: MenuNoticeIcon},
  //     {type: 'fanboard', txt: '팬보드', component: FanBoard, icon: MenuFanBoardeIcon}
  //   ]
  // }
  // if (
  //   __NODE_ENV === 'dev' &&
  //   (Utility.getCookie('listen_room_no') === undefined || Utility.getCookie('listen_room_no') === 'null')
  // ) {
  //   mypageNavList = [
  //     {type: 'notice', txt: '방송공지', component: Notice, icon: MenuNoticeIcon},
  //     {type: 'fanboard', txt: '팬보드', component: FanBoard, icon: MenuFanBoardeIcon},
  //     {type: 'my_clip', txt: '클립', component: MyClip, icon: ClipIcon}
  //   ]
  // }

  if (__NODE_ENV === 'dev') {
    mypageNavList = [
      {type: 'notice', txt: '방송공지', component: Notice, icon: MenuNoticeIcon},
      {type: 'fanboard', txt: '팬보드', component: FanBoard, icon: MenuFanBoardeIcon},
      {type: 'my_clip', txt: '클립', component: MyClip, icon: ClipIcon}
    ]
  }

  // memNo navi check
  if (profile && profile.memNo !== memNo) {
    navigationList = navigationList.slice(0, 3)
  } else if (profile && profile.memNo === memNo) {
    // memNo = profile.memNo
  }

  // close hybrid func
  const clickCloseBtn = () => {
    if (isHybrid()) {
      sessionStorage.removeItem('webview')
      Hybrid('CloseLayerPopup')
      context.action.updatenoticeIndexNum('')
    } else {
      window.history.go(-1)
    }
  }
  useEffect(() => {
    const getMyPageNew = async () => {
      const res = await Api.getMyPageNew(memNo)
      setMyPageNew(res.data)
    }
    getMyPageNew()
  }, [])

  useEffect(() => {
    if (tab !== undefined) {
      setTabSelected(Number(tab))
    } else {
      setTabSelected(1)
    }
  }, [memNo])

  useEffect(() => {
    const settingProfileInfo = async (memNo) => {
      const {result, data, message, code} = await Api.profile({params: {memNo: memNo}})
      if (result === 'success') {
        setProfileInfo(data)
        if (code === '-2') {
          context.action.alert({
            callback: () => {
              window.history.back()
            },
            msg: '회원정보를 찾을 수 없습니다.'
          })
        }
      } else {
        if (code === '-5') {
          context.action.alert({
            callback: () => {
              window.history.back()
            },
            msg: message
          })
        } else {
          context.action.alert({
            callback: () => {
              window.history.back()
            },
            msg: '회원정보를 찾을 수 없습니다.'
          })
        }
      }
    }

    if (memNo) {
      settingProfileInfo(memNo)
    }
  }, [memNo, context.mypageFanCnt])

  useEffect(() => {
    context.action.updateUrlStr(memNo)
  }, [memNo])
  // check 탈퇴회원
  // useEffect(() => {
  //   if (codes === '-2') {
  //     context.action.alert({
  //       callback: () => {
  //         window.history.back()
  //       },
  //       msg: '회원정보를 찾을 수 없습니다.'
  //     })
  //   }
  // }, [codes])

  // my MemNo vs Your check

  if (memNo === token.memNo && webview && webview !== 'new') {
    window.location.href = '/myProfile?webview=' + webview
  }
  if (!profileInfo || !profile) {
    if (!token.isLogin) {
      window.location.href = '/login'
      return null
    }
  }
  const profileCount = (idx) => {
    if (profileInfo !== null) {
      switch (idx) {
        case 0:
          return profileInfo.count.notice
        case 1:
          return profileInfo.count.fanboard
        case 2:
          return profileInfo.count.clip

        default:
          break
      }
    }
  }
  // const locationNav = (type) => {
  //   context.action.updateFanboardReplyNum(false)
  //   context.action.updateFanboardReply(false)
  //   context.action.updateToggleAction(false)

  //   if (webview && webview === 'new') {
  //     history.push(`/mypage/${memNo}/${type}?webview=new`)
  //   } else {
  //     history.push(`/mypage/${memNo}/${type}`)
  //   }
  // }
  const changeTab = (type) => {
    if (type === 0) {
      setTabSelected(0)
    } else if (type === 1) {
      setTabSelected(1)
    } else if (type === 2) {
      setTabSelected(2)
    }
  }

  // useEffect(() => {
  //   if (locationSearch && locationSearch.search === '?clip') {
  //     setTabSelected(2)
  //   } else {
  //     return null
  //   }
  // }, [])

  return (
    <>
      {!token.isLogin && profile === null && <Redirect to={`/login`} />}
      <Layout2 {...props} webview={webview} status="no_gnb" type={webview && webview === 'new' ? 'clipBack' : ''}>
        {/* 2.5v 리뉴얼 상대방 마이페이지 */}
        {profileInfo !== null && (
          <div id="mypage">
            {/*webview && webview === 'new' && <img className="close-btn" src={closeBtn} onClick={clickCloseBtn} />*/}
            {!category ? (
              <>
                <div ref={mypageRef}>
                  <MyProfile
                    profile={profileInfo}
                    {...props}
                    webview={webview}
                    locHash={props.location}
                    setProfileInfo={setProfileInfo}
                  />
                </div>
                {mypageNavList && (
                  <React.Fragment>
                    <ul className={`profile-tab ${mypageFixed ? 'fixedOn' : ''}`}>
                      {mypageNavList.map((value, idx) => {
                        const {type, txt} = value
                        return (
                          <li className={tabSelected === idx ? `isSelected` : ``} key={`list-${idx}`}>
                            <button onClick={() => changeTab(idx)}>
                              {txt} ({profileCount(idx)})
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                    <div className="profile-tab__content" style={{paddingTop: mypageFixed ? '40px' : 0}}>
                      {tabSelected === 0 && <Notice type="userprofile" tabSelected={tabSelected} />}
                      {tabSelected === 1 && <FanBoard isShowBtn={showWriteBtn} type="userprofile" />}
                      {tabSelected === 2 && <MyClip type="userprofile" />}
                    </div>
                  </React.Fragment>
                )}
              </>
            ) : (
              <div ref={mypageRef} style={{display: 'none'}}></div>
            )}

            <Switch>
              {navigationList.map((value) => {
                const {type, component} = value
                return (
                  <Route
                    exact
                    path={addpage !== undefined ? `/mypage/:memNo/:category/:addpage` : `/mypage/:memNo/${type}`}
                    component={component}
                    key={type}
                  />
                )
              })}
            </Switch>
          </div>
        )}
      </Layout2>
    </>
  )
}
