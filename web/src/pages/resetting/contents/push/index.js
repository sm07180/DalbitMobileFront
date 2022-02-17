import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'

// global components
import Header from 'components/ui/header/Header'
import TabBtn from 'components/ui/tabBtn/TabBtn'
import Toast from 'components/ui/toast/Toast'
// components
import Tabmenu from '../../components/tabmenu'

import SwitchList from '../../components/switchList'

import './push.scss'
import API from "context/api";
import {Context} from "context";

const SettingPush = () => {
  let first = true;
  let isSelect = false;
  const tabList = ['무음','소리','진동'];
  const [tabType, setTabType] = useState(tabList[0])
  const [switchEle, setSwitchEle] = useState(false)
  const [switchAll, setSwitchAll] = useState(false)
  const [myAlimType, setMyAlimType] = useState(-1);
  const [allCheck, setAllCheck] = useState(0);
  const context = useContext(Context);
  const [toast, setToast] = useState({
    state : false,
    msg : ""
  });
  const [alarmArray, setAlarmArray] = useState([
    {key: 'isMyStar', value: 0, text: '마이스타 방송 시작 알림', msg: '마이스타가 방송 시작 시<br>'},
    {key: 'isStarClip', value: 0, text: '마이스타 클립 등록 알림', msg: '마이스타가 클립 업로드 시<br>'},
    {key: 'isGift', value: 0, text: '마이스타 방송공지 등록 알림', msg: '마이스타가 방송공지 등록 시<br>'},
    {key: 'isMailbox', value: 0, text: '우체통 알림', msg: '우체통에 새로운 대회가 등록될 경우<br>'},
    {key: 'isMyClip', value: 0, text: '내 클립 알림', msg: '내 클립에 댓글, 좋아요, 선물 등록 시<br>'},
    {key: 'isFan', value: 0, text: '신규 팬 추가 알림', msg: '신규 팬이 추가되면 알림<br>'},
    {key: 'isComment', value: 0, text: '팬보드 신규 글 등록 알림', msg: '팬보드에 새로운 글이 등록되면 알림<br>'},
    {key: 'isReply', value: 0, text: '팬보드 댓글 등록 알림', msg: '팬보드 내 글에 댓글이 등록되면 알림<br>'},
    {key: 'isRadio', value: 0, text: '선물 도착 알림', msg: '달 선물 도착 시 알림<br>'},
    {key: 'isPush', value: 0, text: '1:1 문의 답변 도착 알림', msg: '1:1 문의에 답변 도착 시 알림<br>'},
    {key: 'isReceive', value: 0, text: '알림받기 방송시작 알림', msg: '알림받기를 통한 방송시작<br>',
      callback: function () {},
      buttonText: '회원관리 바로가기'
    }
  ])

  const fetchData = () => {
    const res = API.appNotify_list({
      params: {}
    })
    if(res.result === "success") {
      console.log(res);
      setAlarmArray(alarmArray.map((v) => {
        v.value = res.data[v.key];
        return v;
      }))
      setMyAlimType(res.data.alimType);
    } else {
      console.log(res);
    }
  }

  const postAlarmData = async (arg) => {
    if(arg !== undefined) {
      setAlarmArray(alarmArray.map((v) => {
        if(arg.key === v.key) {arg.value = arg.value === 0 ? 1 : 0}
        return v
      }))
    }
    const alarmObj = Object.fromEntries(
      Array.from(alarmArray, (x) => {
        return [x.key, x.value];
      })
    )
    let all = 0;
    if(alarmArray.every((v) => {return v.value === 1})) {
      setAllCheck(1);
      all = 1;
    } else {setAllCheck(0)}
    const res = await API.appNotify_modify({
      data: {
        isAll: all,
        alimType: myAlimType,
        ...alarmObj
      }
    })
    let message;
    if(res.result === "success") {
      console.log(res);
      if(arg === undefined) {
        if(!(isSelect === true)) {
          if(myAlimType === "n") {
            context.action.alert({msg: "알림 모드가 무음으로 변경되었습니다."})
          } else if(myAlimType === "s") {
            context.action.alert({msg: "알림 모드가 "})
          }
        }
      }}

  }

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
      if(switchs.length === on.length) {
        switchAll.checked = true;
      }else {
        switchAll.checked = false;
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

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
          {alarmArray.map((v, idx) => {
            return(
              <SwitchList key={idx} title={v.text} action={switchControl}/>
            )
          })}
        </div>
      </div>
      {toast.state &&
        <Toast msg={toast.msg}/>
      }
    </div>
  )
}

export default SettingPush
