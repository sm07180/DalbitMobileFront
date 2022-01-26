import React, {useEffect, useState, useContext} from 'react'
import {useHistory, Switch, Route, useParams} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
// global components
import Header from '../../components/ui/header/Header'
// components
import MyInfo from './components/MyInfo'
import MydalDetail from './components/MydalDetail'
import MyMenu from './components/MyMenu'
// contents
import Profile from './contents/profile/profile'
import ProfileWrite from './contents/profile/profileWrite'
import ProfileDetail from './contents/profile/profileDetail'
import ProfileEdit from './contents/profileEdit/profileEdit'
import Notice from './contents/notice/notice'

import './style.scss'

const Remypage = (props) => {
  const history = useHistory()
  //context
  const context = useContext(Context)
  const {splash, token, profile} = context
  const mymenuItem = [
    {menuNm: '리포트'},
    {menuNm: '클립'},
    {menuNm: '설정'},
    {menuNm: '공지사항'},
    {menuNm: '고객센터'},
  ]

  let {memNo, category, addpage} = useParams()


  //useState
  const [myProfile, setMyProfile] = useState(true)

  const openMyprofile = () => {
    setMyProfile(true)
  }

  // 페이지 셋팅
  useEffect(() => {
    if (!token.isLogin) {
      history.push('/login')
    }
  }, [])

  const data = profile

  // 페이지 시작
  return (
    <React.Fragment>
      {myProfile === false && data && 
        <div id="remypage">
          <Header title={'MY'} />
          <section className="myInfo" onClick={openMyprofile}>
            <MyInfo data={profile} />
          </section>
          <section className='mydalDetail'>
            <MydalDetail data={profile.dalCnt} />
          </section>
          <section className="myMenu">
            <MyMenu data={mymenuItem} />
            <div className="versionInfo">
              <span className="title">버전정보</span>
              <span className="version">현재 버전 {splash.version}</span>
            </div>
          </section>
          <button className='logout'>로그아웃</button>
        </div>
      }
      {myProfile === true && <Profile />}
    </React.Fragment>
  )
}

export default Remypage
