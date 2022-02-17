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
import {Context} from "context";

const SettingBroadcast = () => {
  const params = useParams();
  const settingCategory = params.category;
  const context = useContext(Context);
  const [settingData, setSettingData] = useState({});
  const [menuListInfo, setMenuListInfo] = useState([
    {text:'방송 제목', path: '/setting/broadcast/title'},
    {text:'DJ 인사말', path: '/setting/broadcast/greeting'},
    {text:'퀵 메시지', path: '/setting/broadcast/message'},
    {text:'방송 청취 정보 공개', path: '/setting/broadcast/infoOpen'},
    {text:'선물 시 자동 스타 추가', path: false},
    {text:'배지 / 입·퇴장 메시지', path: '/setting/broadcast/inOutMessage'},
  ]);

  const golink = (path) => {
    history.push("/setting/broadcast/" + path);
  }

  const fetchData = async (value, index) => {
    console.log(!value, index);
    const res = await API.modifyBroadcastSetting({giftFanReg: !value})
    if(res.result === "success") {
      context.action.alert({msg: res.message});
      setMenuListInfo(menuListInfo.map((v, idx) => {
        if(idx === index) {
          v.value = !value
        }
        return v
      }))
    } else {
      console.log(res);
    }
  }

  const fetchSetting = async () => {
    const res = await API.getBroadcastSetting();
    if(res.result === "success") {
      console.log(res);
      setMenuListInfo(menuListInfo.map((v,idx) => {
        if(idx === 4) {
          v.value = res.data.giftFanReg
        }
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
                <div key={index}>
                {index !== 4 ?
                  <MenuList text={list.text} path={list.path} key={index}>
                    {index < 2 && <small>최대 3개</small>}
                    {index === 2 && <small>최대 6개</small>}
                  </MenuList>
                  :
                  <MenuList text={list.text} key={index}>
                    <label className="inputLabel">
                      <input type="checkbox" className={`blind`} name={"autoAddStar"} onClick={() => fetchData(list.path, index)}/>
                      <span className={`switchBtn`}/>
                    </label>
                  </MenuList>
                }
                </div>
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
          <InfoOpen settingData={settingData} setSettingData={setSettingData}/>
        :
        settingCategory === "inOutMessage" &&
          <InOutMessage settingData={settingData} setSettingData={setSettingData}/>
      }      
    </>
  )
}

export default SettingBroadcast
