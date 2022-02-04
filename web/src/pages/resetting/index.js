import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

// global components
import Header from 'components/ui/header/Header'

import Push from './contents/push'
import Forbid from './contents/forbid'
import Manager from './contents/manager'


import './style.scss'

const SettingPage = () => {
  const params = useParams();
  const settingType = params.type;
  let history = useHistory()

  const golink = (path) => {
    history.push("/setting/" + path);
  }

  // 페이지 시작
  return (
   <div id='setting'>     
      {
        !settingType ?
          <>
            <Header position={'sticky'} title={'설정'} type={'back'}/>
            <div className='content'>
              <div className='menuWrap'>
                <div className='menuList' onClick={() => {golink("push")}}>
                  <div className='menuName'>Push알림 설정</div>
                  <span className='arrow'></span>                  
                </div>
                <div className='menuList' onClick={() => {golink("broadcast")}}>
                  <div className='menuName'>방송/청취 설정</div>
                  <span className='arrow'></span>                  
                </div>
                <div className='menuList' onClick={() => {golink("forbid")}}>
                  <div className='menuName'>금지어 관리</div>
                  <span className='arrow'></span>                  
                </div>
                <div className='menuList' onClick={() => {golink("manager")}}>
                  <div className='menuName'>매니저 관리</div>
                  <span className='arrow'></span>                  
                </div>
                <div className='menuList' onClick={() => {golink("blockList")}}>
                  <div className='menuName'>차단회원 관리</div>
                  <span className='arrow'></span>                  
                </div>
                <div className='menuList' onClick={() => {golink("alarmUser")}}>
                  <div className='menuName'>알림받기 설정 회원 관리</div>
                  <span className='arrow'></span>
                </div>
              </div>
            </div>
          </>
        :
        settingType === "push" ?
          <Push/>
        :
        settingType === "broadcast" ?
          <>방송/청취 설정</>
        :
        settingType === "forbid" ?
          <Forbid />
        :
        settingType === "manager" ?
          <Manager />
        :
        settingType === "blockList" ?
          <>차단회원 관리</>
        :
          <>알림받기 설정 회원 관리</>
      }
   </div>
  )
}

export default SettingPage
