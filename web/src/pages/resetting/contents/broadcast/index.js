import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

// global components
import Header from 'components/ui/header/Header'
// components
import MenuList from "pages/resetting/components/MenuList";
// sub contensts
import Title from "pages/resetting/contents/broadcast/title";
import Greeting from 'pages/resetting/contents/broadcast/greeting'
import Message from 'pages/resetting/contents/broadcast/message'
import InfoOpen from 'pages/resetting/contents/broadcast/infoOpen'
import InOutMessage from 'pages/resetting/contents/broadcast/inOutMessage'

import './broadcast.scss'
import API from "context/api";
import Toast from "components/ui/toast/Toast";
import Notice from "pages/resetting/contents/broadcast/broadcastNotice";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const SettingBroadcast = () => {
  const params = useParams();
  const settingCategory = params.category;
  const [settingData, setSettingData] = useState({});
  const [menuListInfo, setMenuListInfo] = useState([
    {text:'방송 제목', path: '/setting/streaming/title'},
    {text:'DJ 인사말', path: '/setting/streaming/greeting'},
    {text:'방송방 공지', path: '/setting/streaming/broadcastNotice'},
    {text:'퀵 메시지', path: '/setting/streaming/message'},
    {text:'방송 청취 정보 공개', path: '/setting/streaming/infoOpen'},
    {text:'선물 시 자동 스타 추가', value: false},
    {text:'배지 / 입·퇴장 메시지', path: '/setting/streaming/inOutMessage'},
  ]);
  const dispatch = useDispatch();
  //선물 시 자동 스타 추가 정보 수정
  const fetchData = async (value, index) => {
    const res = await API.modifyBroadcastSetting({giftFanReg: !value})
    if(res.result === "success") {
      dispatch(setGlobalCtxMessage({
        type: 'toast',
        msg: res.message
      }))
      setMenuListInfo(menuListInfo.map((v, idx) => {
        if(idx === index) {v.value = !value}
        return v
      }))
    }
  }

  //방송 설정 정보 조회
  const fetchSetting = async () => {
    const res = await API.getBroadcastSetting();
    if(res.result === "success") {
      setMenuListInfo(menuListInfo.map((v,idx) => {
        if(idx === 5) {v.value = res.data.giftFanReg}
        return v
      }))
      setSettingData(res.data);
    }
  }

  useEffect(() => {
    fetchSetting();
  }, []);

  // 페이지 시작
  return (
    <>
      {!settingCategory ?
        <div id="broadcast">
          <Header position={'sticky'} title={'방송/청취 설정'} type={'back'}/>
          <div className='menuWrap'>
            {menuListInfo.map((list,index) => {
              return (
                <MenuList text={list.text} path={list.path} key={index} disabledClick={index === 5 ? true : false}>
                  {index < 2 && <small>최대 3개</small>}
                  {index === 2 && <small>최대 1개</small>}
                  {index === 3 && <small>최대 6개</small>}
                  {index === 5 &&
                  <label className="inputLabel" >
                    <input type="checkbox" className={`blind`} name={"autoAddStar"} checked={list.value}
                           onChange={() => fetchData(list.value, index)}/>
                    <span className={`switchBtn`}/>
                  </label>
                  }
                </MenuList>
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
            settingCategory === 'broadcastNotice' ?
              <Notice />
              :
              settingCategory === "message" ?
                <Message/>
                :
                settingCategory === "infoOpen" ?
                  <InfoOpen settingData={settingData} setSettingData={setSettingData}/>
                  :
                  settingCategory === "inOutMessage" &&
                  <InOutMessage settingData={settingData} setSettingData={setSettingData}/>
      }
    </>
  )
}

export default SettingBroadcast;
