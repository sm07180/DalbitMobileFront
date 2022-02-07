import React, {useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {Context} from "context";

// global components
import Header from 'components/ui/header/Header'
// components
import MenuList from './components/MenuList'
// contents
import Push from './contents/push'
import Forbid from './contents/forbid'
import Broadcast from './contents/broadcast'
import Manager from './contents/manager'
import BlackList from './contents/blackList'
import AlarmUser from './contents/alarmUser'


import './style.scss'

const SettingPage = () => {
  const params = useParams();
  const settingType = params.type;
  const context = useContext(Context)
  const {token} = context

  const menuListInfo = [
    {text:'Push알림 설정', path: '/setting/push'},
    {text:'방송/청취 설정', path: '/setting/broadcast'},
    {text:'금지어 관리', path: '/setting/forbid'},
    {text:'매니저 관리', path: '/setting/manager'},
    {text:'차단회원 관리', path: '/setting/blackList'},
    {text:'알림받기 설정 회원 관리', path: '/setting/alarmUser'},
  ]
  
  useEffect(() => {
    // if (!token.isLogin) {
    //   history.push('/login');
    // }
  }, [])


  // 페이지 시작
  return (
   <div id='setting'>
      {!settingType ?
        <>
          <Header position="sticky" title="설정" type="back"/>
          <div className='menuWrap'>
            {menuListInfo.map((list,index) => {
              return (
                <MenuList text={list.text} path={list.path} key={index} />
              )
            })}
          </div>
        </>
        :
        settingType === "push" ?
          <Push/>
        :
        settingType === "broadcast" ?
          <Broadcast/>
        :
        settingType === "forbid" ?
          <Forbid />
        :
        settingType === "manager" ?
          <Manager />
        :
        settingType === "blackList" ?
          <BlackList />
        :
          <AlarmUser />
      }
   </div>
  )
}

export default SettingPage
