import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

// global components
import Header from 'components/ui/header/Header'

import Title from './title'
import Greeting from './greeting'
import Message from './message'

import '../../style.scss'

const SettingBroadcast = () => {
  const params = useParams();
  const settingCategory = params.category;
  let history = useHistory()

  const golink = (path) => {
    history.push("/setting/broadcast/" + path);
  }

  // 페이지 시작
  return (
    <>
      {
        !settingCategory ?
        <>
          <Header position={'sticky'} title={'방송/청취 설정'} type={'back'}/>
          <div className='content'>
            <div className='menuWrap'>
              <div className='menuList' onClick={() => {golink("title")}}>
                <div className='menuName'>방송 제목<span>최대 3개</span></div>
                <span className='arrow'></span>                  
              </div>
              <div className='menuList' onClick={() => {golink("greeting")}}>
                <div className='menuName'>DJ 인사말<span>최대 3개</span></div>
                <span className='arrow'></span>                  
              </div>
              <div className='menuList' onClick={() => {golink("message")}}>
                <div className='menuName'>퀵 메시지<span>최대 6개</span></div>
                <span className='arrow'></span>                  
              </div>
              <div className='menuList' onClick={() => {golink("infoOpen")}}>
                <div className='menuName'>방송 청취 정보 공개</div>
                <span className='arrow'></span>                  
              </div>
              <div className='menuList'>
                <div className='menuName'>선물 시 자동 스타 추가</div>            
                <label className="inputLabel">
                  <input type="checkbox" className={`blind`} name={"autoAddStar"}/>
                  <span className={`switchBtn`}></span>
                </label>
              </div>
              <div className='menuList' onClick={() => {golink("inOutMessage")}}>
                <div className='menuName'>배지 / 입·퇴장 메시지</div>
                <span className='arrow'></span>                  
              </div>
            </div>
          </div>
        </>        
        :
        settingCategory === "title" ?
          <Title/>
        :
        settingCategory === "greeting" ?
          <Greeting/>
        :
        settingCategory === "message" ?
          <Message/>
        :
        settingCategory === "infoOpen" ?
          <>방송 청취 정보 공개</>
        :
        settingCategory === "inOutMessage" ?
          <>배지 / 입·퇴장 메시지</>
        :
          <></>
      }      
    </>
  )
}

export default SettingBroadcast
