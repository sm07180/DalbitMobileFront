import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

// global components
import Header from 'components/ui/header/Header'
// components
import MenuList from '../../components/MenuList'
// sub contensts
import Title from './title'
import Greeting from './greeting'
import Message from './message'
import InfoOpen from './infoOpen'
import InOutMessage from './inOutMessage'

import './broadcast.scss'

const SettingBroadcast = () => {
  const params = useParams();
  const settingCategory = params.category;

  const menuListInfo = [
    {text:'방송 제목', path: '/setting/broadcast/title'},
    {text:'DJ 인사말', path: '/setting/broadcast/greeting'},
    {text:'퀵 메시지', path: '/setting/broadcast/message'},
    {text:'방송 청취 정보 공개', path: '/setting/broadcast/infoOpen'},
    {text:'선물 시 자동 스타 추가', path: ''},
    {text:'배지 / 입·퇴장 메시지', path: '/setting/broadcast/inOutMessage'},
  ]

  const golink = (path) => {
    history.push("/setting/broadcast/" + path);
  }

  // 페이지 시작
  return (
    <>
      {!settingCategory ?
        <div id="broadcast">
          <Header position={'sticky'} title={'방송/청취 설정'} type={'back'}/>
          <div className='menuWrap'>
            {menuListInfo.map((list,index) => {
              return (
                <>
                {index !== 4 ?
                  <MenuList text={list.text} path={list.path} key={index}>
                    {index < 2 && <small>최대 3개</small>}
                    {index === 2 && <small>최대 6개</small>}
                  </MenuList>
                  :
                  <MenuList text={list.text} key={index}>
                    <label className="inputLabel">
                      <input type="checkbox" className={`blind`} name={"autoAddStar"}/>
                      <span className={`switchBtn`}></span>
                    </label>
                  </MenuList>
                }
                </>
              )
            })}
          </div>
        </div>        
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
          <InfoOpen/>
        :
        settingCategory === "inOutMessage" &&
          <InOutMessage/>
      }      
    </>
  )
}

export default SettingBroadcast
