import React, {useState, useEffect} from 'react'


// global components
import Header from 'components/ui/header/Header'

import './infoOpen.scss'
import API from "context/api";
import Toast from "components/ui/toast/Toast";

const InfoOpen = (props) => {
  const [checkState, setCheckState] = useState(false);
  const localOpen = [{path: -1, name: "방송 청취 정보 공개", value: 0}, {path: 1, name: "공개", value: 0}, {path: 0, name: "비공개", value: 0}]
  const {settingData, setSettingData} = props;
  const [toast, setToast] = useState({state : false, msg : ""});

  //토스트 메시지 출력
  const toastMessage = (text) => {
    setToast({state: true, msg : text})
    setTimeout(() => {
      setToast({state: false})
    }, 3000)
  }

  //토글 클릭시
  const switchAction = (e) => {
    const checking = e.target.checked;
    const value = parseInt(e.target.value);
    const {index} = e.currentTarget.dataset;
    if(checking){
      setCheckState(true)
      if(index !== "0") {fetchData(+value);}
    } else {
      setCheckState(false)
      let radioEle = document.getElementsByName("broadcastLocation");
      for(let i = 0; i < radioEle.length; i++) {
        if(radioEle[i].getAttribute('type') === "radio") {radioEle[i].checked = false;}
      }
      if(settingData.listenOpen !== 2) {
        fetchData(2);
      }
    }
  }

  //방송 정보 공개 데이터 조회
  const fetchData = async (slctedVal) => {
    if(settingData !== null) {
      const res = await API.modifyBroadcastSetting({listenOpen: slctedVal})
      if(res.result === "success") {
        setSettingData({...settingData, listenOpen: slctedVal})
        toastMessage(res.message);
      }
    }
  }

  // 페이지 시작
  return (
    <div id="infoOpen">
      <Header position={'sticky'} title={'방송 청취 정보 공개'} type={'back'}/>
      <div className='subContent'>
        <div className="switchList">
          <div className="titleWrap">
            <span className="title">{localOpen[0].name}</span>
          </div>
          <label className="inputLabel">
            <input type="checkbox" className={`blind`} name="switch" data-index={0} defaultChecked={settingData.listenOpen === 1 || settingData.listenOpen === 0} value={localOpen[0].path} onChange={switchAction} />
            <span className="switchBtn"/>
          </label>
        </div>
        <div className={`locationState ${checkState || settingData.listenOpen !== 2 ? "active" : ""}`}>
          <div className='title'>방송 위치 상태</div>
          <div className='radioWrap'>
            <label className='radioLabel'>
              <input type="radio" name="broadcastLocation" className='blind' data-index={1} defaultChecked={settingData.listenOpen === 1} value={localOpen[1].path} onChange={switchAction}/>
              <span className='radioBtn'/>
              <span className='radioCategoty'>{localOpen[1].name}</span>
            </label>
            <label className='radioLabel'>
              <input type="radio" name="broadcastLocation" className='blind' data-index={2} defaultChecked={settingData.listenOpen === 0} value={localOpen[2].path} onChange={switchAction}/>
              <span className='radioBtn'/>
              <span className='radioCategoty'>{localOpen[2].name}</span>
            </label>
          </div>
        </div>
      </div>
      {toast.state && <Toast msg={toast.msg}/>}
    </div>
  )
}

export default InfoOpen;
