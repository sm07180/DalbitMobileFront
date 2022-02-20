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

let first = true;
const SettingPush = () => {
  let isSelect = false;
  const [myAlimType, setMyAlimType] = useState(-1); //무음, 소리, 진동
  const context = useContext(Context);
  const [toast, setToast] = useState({state : false, msg : ""});
  const [value, setValue] = useState({});
  //푸쉬 알림 설정 리스트
  const [alarmArray, setAlarmArray] = useState([
    {key: 'isAll', value: 0, text: '전체 알림 수신', msg: '전체 알림 수신 시<br>', path: false},
    {key: 'isMyStar', value: 0, text: '마이스타 방송 시작 알림', msg: '마이스타가 방송 시작 시<br>', path: false},
    {key: 'isStarClip', value: 0, text: '마이스타 클립 등록 알림', msg: '마이스타가 클립 업로드 시<br>', path: false},
    {key: 'isGift', value: 0, text: '마이스타 방송공지 등록 알림', msg: '마이스타가 방송공지 등록 시<br>', path: false},
    {key: 'isMailbox', value: 0, text: '우체통 알림', msg: '우체통에 새로운 대회가 등록될 경우<br>', path: false},
    {key: 'isMyClip', value: 0, text: '내 클립 알림', msg: '내 클립에 댓글, 좋아요, 선물 등록 시<br>', path: false},
    {key: 'isFan', value: 0, text: '신규 팬 추가 알림', msg: '신규 팬이 추가되면 알림<br>', path: false},
    {key: 'isComment', value: 0, text: '팬보드 신규 글 등록 알림', msg: '팬보드에 새로운 글이 등록되면 알림<br>', path: false},
    {key: 'isReply', value: 0, text: '팬보드 댓글 등록 알림', msg: '팬보드 내 글에 댓글이 등록되면 알림<br>', path: false},
    {key: 'isRadio', value: 0, text: '선물 도착 알림', msg: '달 선물 도착 시 알림<br>', path: false},
    {key: 'isPush', value: 0, text: '1:1 문의 답변 도착 알림', msg: '1:1 문의에 답변 도착 시 알림<br>', path: false},
    {key: 'isReceive', value: 0, text: '알림받기 방송시작 알림', msg: '알림받기를 통한 방송시작<br>', path: false,
      callback: function () {},
      buttonText: '회원관리 바로가기'
    }
  ])

  //알림 설정 조회
  const fetchData = async () => {
    const res = await API.appNotify_list({
      params: {}
    })
    if(res.result === "success") { //0 알림X, 1 알림ㅇ
      setAlarmArray(alarmArray.map((v) => {
        v.value = res.data[v.key];
        if(v.value = res.data[v.key]) {v.path = true}
        return v;
      }))
      setMyAlimType(res.data.alimType);
    } else {
      context.action.alert({msg: res.message});
    }
  }

  //알림 설정 수정시
  const postAlarmData = async (org) => {
    if(org !== undefined) {
      setAlarmArray(alarmArray.map((v) => {
        if(org.key === v.key) {
          org.value = org.value === 0 ? 1 : 0
          org.path = org.path === false ? true : false
        }
        return v
      }))
    }
    const alarmObj = Object.fromEntries(
      Array.from(alarmArray, (x) => {
        return [x.key, x.value];
      })
    )
    const res = await API.appNotify_modify({
      data: {isAll: alarmArray[0].value, alimType: myAlimType, ...alarmObj}
    })
    if(res.result === "success") {
      }
  }

  //하단 토스트 메시지 출력
  const toastMessage = (text) => {
    setToast({state: true, msg : text})
    setTimeout(() => {
      setToast({state: false})
    }, 3000)
  }

  //토글 클릭시 값 변경
  const switchControl = (e) => {
    const switchs = document.querySelectorAll('input[name="switch"]');
    const on = document.querySelectorAll('input[name="switch"]:checked');
    const switchAll = document.querySelector('input[name="switchAll"]');
    const thisParent = e.currentTarget.closest('.switchList');
    const title = (thisParent.querySelector('.title').innerText || e.currentTarget.dataset.title);
    first = false;
    isSelect = false;
    //전체 알림 수신 클릭시
    if(e.target.name === "switchAll") {
      if(e.target.checked) {
        setAlarmArray(alarmArray.map((v) => {
          v.value = 1; v.path = true; return v;
        }))
      } else {
        setAlarmArray(alarmArray.map((v) => {
          v.value = 0; v.path = false; return v;
        }))
      }
      postAlarmData();
      if(e.target.checked){
        toastMessage(`${title} \n 푸시를 받습니다.`)
      } else {
        toastMessage(`${title} \n 푸시를 받지 않습니다.`)
      }
    } else {
      //개별 알림 클릭시
      alarmArray[0].value = 0;
      alarmArray[0].path = false;
      if(e.target.checked) {
        toastMessage(`${title} \n 푸시를 받습니다.`)
      } else {
        toastMessage(`${title} \n 푸시를 받지 않습니다.`)
      }
      if(switchs.length === on.length) {
        switchAll.checked = true;
      } else {
        switchAll.checked = false;
      }
      postAlarmData();
    }
  }

  //진동,무음,소리 설정 변경
  const onClick = (e) => {
    first = false;
    isSelect = false;
    setMyAlimType(e.currentTarget.dataset.value);
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    postAlarmData();
  }, [myAlimType]);

  useEffect(() => {
    if(!first) {
      if(myAlimType === "n") {toastMessage("알림 모드가 무음으로 변경되었습니다.")}
      else if(myAlimType === "s") {toastMessage("알림 모드가 소리로 변경되었습니다.")}
      else if(myAlimType === "v") {toastMessage("알림 모드가 진동으로 변경되었습니다.")}
    }
  }, [myAlimType]);

  return (
    <div id="push">
      <Header position={'sticky'} title={'Push 알림 설정'} type={'back'}/>
      <div className='subContent'>
        <div className='tabWrap'>
          <p className='topText'>메시지 알림</p>
          <ul className="tabmenu">
            <li className={myAlimType === "n" ? "active" : ""} onClick={onClick} data-value="n" >무음</li>
            <li className={myAlimType === "s" ? "active" : ""} onClick={onClick} data-value="s" >소리</li>
            <li className={myAlimType === "v" ? "active" : ""} onClick={onClick} data-value="v" >진동</li>
          </ul>
        </div>
        <div className='switchWrap'>
          {alarmArray.map((v, idx) => {
            return(
              <div className="switchList" key={idx}>
                <div className="titleWrap">
                  {/*<span className="questionMark"/>*/}
                  <span className="title">{v.text}</span>
                </div>
                <label className="inputLabel">
                  <input type="checkbox" className={`blind`} name={v.text === "전체 알림 수신" ? "switchAll" : "switch"} data-title={v.text}
                         data-key={v.key} data-value={v.value} onChange={switchControl} onClick={() => {postAlarmData(v)}} checked={v.path}
                  />
                  <span className="switchBtn"/>
                </label>
              </div>
            )
          })}
        </div>
      </div>
      {toast.state && <Toast msg={toast.msg}/>}
    </div>
  )
}

export default SettingPush;
