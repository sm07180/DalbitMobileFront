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
  const [myAlimType, setMyAlimType] = useState(-1); //무음, 소리, 진동
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

  const fetchData = async () => {
    const res = await API.appNotify_list({
      params: {}
    })
    if(res.result === "success") { //0 알림X, 1 알림ㅇ
      console.log("fetchSuccess", res);
      setAlarmArray(alarmArray.map((v) => {
        v.value = res.data[v.key];
        return v;
      }))
      setMyAlimType(res.data.alimType);
    } else {
      context.action.alert({msg: res.message});
    }
  }

  const postAlarmData = async (org) => {
    if(org !== undefined) {
      setAlarmArray(alarmArray.map((v) => {
        if(org.key === v.key) {org.value = org.value === 0 ? 1 : 0}
        return v
      }))
    }
    const alarmObj = Object.fromEntries(
      Array.from(alarmArray, (x) => {
        return [x.key, x.value];
      })
    )
    console.log("#@$@WEFR", alarmObj);
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
    console.log(myAlimType);
    if(res.result === "success") {
      console.log("success", res);
      if(org === undefined) {
        if(!(isSelect === true)) {
          if(myAlimType === "n") {
            toastMessage("알림 모드가 무음으로 변경되었습니다.")
          } else if(myAlimType === "s") {
            toastMessage("알림 모드가 소리로 변경되었습니다.")
          } else if(myAlimType === "v") {
            toastMessage("알림 모드가 진동으로 변경되었습니다.")
          }
        }
      }
    } else {
      console.log(res);
    }
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
    const title = (thisParent.querySelector('.title').innerText || e.currentTarget.dataset.title);
    first = false;
    isSelect = false;
    if(e.target.name === "switchAll") {
      console.log("전체 알림 수신시")
      switchs.forEach((checkbox) => {
        checkbox.checked = e.target.checked
      })
      if(e.target.checked){
        toastMessage(`${title} \n 푸시를 받습니다.`)
      } else {
        toastMessage(`${title} \n 푸시를 받지 않습니다.`)
      }
      selectAll();
    } else {
      console.log("개별 알림 수신시")
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

  const onClick = (e) => {
    first = false;
    isSelect = false;
    setMyAlimType(e.currentTarget.dataset.value);
  }

  const selectAll = () => {
    first = false;
    isSelect = true;
    if(allCheck === 0) {
      setAllCheck(1);
      setAlarmArray(alarmArray.map((v) => {v.value = 1; return v;}));
    } else if(allCheck === 1) {
      setAllCheck(0);
      setAlarmArray(alarmArray.map((v) => {v.value = 0; return v;}));
    }
    postAlarmData();
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
      console.log(first);
      postAlarmData();
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
          <SwitchList title={"전체 알림 수신"} mark={false} allCheck={allCheck} allSwitch={true} action={switchControl}/>
          {alarmArray.map((v, idx) => {
            return(
              <div key={idx}>
                <div className="switchList">
                  <div className="titleWrap">
                    <span className="questionMark"/>
                    <span className="title">{v.text}</span>
                  </div>
                  <label className="inputLabel">
                    <input type="checkbox" className={"blind"} name="switch" data-title={v.text} data-key={v.key} onChange={switchControl} onClick={() => {postAlarmData(v)}} />
                    {v.value === 1 ? <span className="switchBtnOn"/> : v.value === 0 && <span className="switchBtn"/>}
                  </label>
                </div>
              </div>
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

export default SettingPush;
