import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

// global components
import Header from 'components/ui/header/Header'

import Push from "pages/resetting/contents/push";
import Broadcast from "pages/resetting/contents/broadcast";
import Forbid from 'pages/resetting/contents/forbid'
import Manager from 'pages/resetting/contents/manager'
import BlackList from 'pages/resetting/contents/blackList'
import AlarmUser from 'pages/resetting/contents/alarmUser'

import './style.scss'
import {useDispatch, useSelector} from "react-redux";

const SettingPage = () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const params = useParams();
  const settingType = params.type;
  const history = useHistory()
  const [setting, setSetting] = useState([{name: "Push알림 설정", path: "push"}, {name: "방송/청취 설정", path: "streaming"}, {name: "금지어 관리", path: "forbid"},
    {name: "매니저 관리", path: "manager"}, {name: "차단회원 관리", path: "blockList"}, {name: "알림받기 설정 회원 관리", path: "alarmUser"}
  ]);

  const onClick = (e) => {
    e.stopPropagation();
    const path = e.currentTarget.dataset.idx
    history.push("/setting/" + path);
  }

  useEffect(() => {
    if(!(globalState.token.isLogin)) {
      history.push("/login");
    }
  }, []);


  // 페이지 시작
  return (
    <div id='setting'>
      {!settingType ?
        <>
          <Header position={'sticky'} title={'설정'} type={'back'}/>
          <div className='content'>
            <div className='menuWrap'>
              {setting.map((v, idx) => {
                return (
                  <div className="menuList" key={idx} data-idx={v.path} onClick={onClick}>
                    <div className="menuName">{v.name}</div>
                    <span className="arrow"/>
                  </div>
                )
              })}
            </div>
          </div>
        </>
        :
        settingType === "push" ?
          <Push/>
          :
          settingType === "streaming" ?
            <Broadcast/>
            :
            settingType === "forbid" ?
              <Forbid/>
              :
              settingType === "manager" ?
                <Manager/>
                :
                settingType === "blockList" ?
                  <BlackList/>
                  :
                  <AlarmUser/>
      }
    </div>
  )
}

export default SettingPage;
