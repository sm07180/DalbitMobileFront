import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

// global components
import Header from 'components/ui/header/Header'
import TabBtn from 'components/ui/tabBtn/TabBtn'
import Toast from 'components/ui/toast/Toast'
// components
import Tabmenu from '../../components/Tabmenu'

import SwitchList from '../../components/switchList'

import './push.scss'

const SettingPush = () => {
  const tabList = ['무음','소리','진동'];
  const [tabType, setTabType] = useState(tabList[0])

  const [switchEle, setSwitchEle] = useState(false)
  const [switchAll, setSwitchAll] = useState(false)
  
  const [toast, setToast] = useState({
    state : false,
    msg : ""
  });

  const toastMessage = (text) => {
    setToast({state: true, msg : text})

    setTimeout(() => {
      setToast({state: false})
    }, 3000)
  }

  const switchControl = (e) => {
    const switchs = document.querySelectorAll('input[name="switch"]');
    const on = document.querySelectorAll('input[name="switch"]:checked');
    const switchAll = document.querySelector('input[name="switchAll"]');
    const thisParent = e.currentTarget.closest('.switchList');
    const title = thisParent.querySelector('.title').innerText;
    
    if(e.target.name === "switchAll") {
      switchs.forEach((checkbox) => {
        checkbox.checked = e.target.checked
      })
      if(e.target.checked){
        toastMessage(`${title} \n 푸시를 받습니다.`)
      } else {
        toastMessage(`${title} \n 푸시를 받지 않습니다.`)
      }
    } else {
      if(e.target.checked){
        toastMessage(`${title} \n 푸시를 받습니다.`)
      } else {
        toastMessage(`${title} \n 푸시를 받지 않습니다.`)
      }
      if(switchs.length === on.length)  {
        switchAll.checked = true;
      }else {
        switchAll.checked = false;
      }
    }
  }
  

  return (
    <div id="push">
      <Header position={'sticky'} title={'Push 알림 설정'} type={'back'}/>
      <div className='subContent'>
        <div className='tabWrap'>
          <p className='topText'>메시지 알림</p>
          <Tabmenu data={tabList} tab={tabType} setTab={setTabType} />
        </div>
        <div className='switchWrap'>
          <SwitchList title={"전체 알림 수신"} mark={false} allSwitch={true} action={switchControl}/>
          <SwitchList title={"마이스타 방송 시작 알림"} action={switchControl}/>
          <SwitchList title={"마이스타 클립 등록 알림"} action={switchControl}/>
          <SwitchList title={"우체통 알림"} action={switchControl}/>
          <SwitchList title={"내 클립 알림"} action={switchControl}/>
          <SwitchList title={"신규 팬 추가 알림"} action={switchControl}/>
          <SwitchList title={"팬보드 신규 글 등록 알림"} action={switchControl}/>
          <SwitchList title={"팬보드 댓글 등록 알림"} action={switchControl}/>
          <SwitchList title={"선물 도착 알림"} action={switchControl}/>
          <SwitchList title={"1:1 문의 답변 도착 알림"} action={switchControl}/>
          <SwitchList title={"알림받기 방송시작 알림"} action={switchControl}/>
        </div>
      </div>
      {toast.state && 
        <Toast msg={toast.msg}/>
      }
    </div>
  )
}

export default SettingPush
