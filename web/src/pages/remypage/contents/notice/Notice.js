import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
// global components
import Header from 'components/ui/header/Header'
import TabBtn from '../../components/TabBtn'
// components
// contents
import './notice.scss'
import Allim from "pages/remypage/contents/notice/Allim";
import Post from "pages/remypage/contents/notice/Post";
import {useDispatch, useSelector} from "react-redux";
import {setNoticeData, setNoticeTab} from "redux/actions/notice";
import API from "context/api";


const NoticePage = () => {
  const noticeTabmenu = ['알림','공지사항'];
  const {tab} = useSelector((state) => state.notice);
  const dispatch = useDispatch();
  const history = useHistory()
  const context = useContext(Context)
  const [alarmList, setAlarmList] = useState({list: [], cnt: 0, newCnt: 0});
  const alarmData = useSelector(state => state.newAlarm);
  const isDesktop = useSelector((state)=> state.common.isDesktop)

  const fetchData = () => {
    let params = {page: 1, records: 1000};
    Api.my_notification(params).then((res) => {
      if(res.result === "success") {
        if(res.data.list.length > 0) {
          setAlarmList({...alarmList, list: res.data.list, cnt: res.data.cnt, newCnt: res.data.newCnt});
        } else {
          setAlarmList({...alarmList});
        }
      }
    }).catch((e) => console.log(e));
  }

  const fetchMypageNewCntData = async (memNo) => {
    const res = await API.getMyPageNew(memNo);
    if(res.result === "success") {
      if(res.data) {
        dispatch(setNoticeData(res.data));
      }}
  }

  useEffect(() => {
    if(isDesktop) {
      fetchMypageNewCntData(context.profile.memNo);
    }
  }, [alarmData.newCnt]);

  // 로그인 토큰값 확인
  useEffect(() => {
    if(!(context.token.isLogin)) {
      history.push("/login")
    }
    fetchData();
  }, []);

  useEffect(() => {
    if(alarmData.alarm > 0) {
      dispatch(setNoticeTab("알림"))
    } else if(alarmData.notice > 0) {
      dispatch(setNoticeTab("공지사항"))
    }
  }, [])

  return (
    <div id="notice">
      <Header title="알림/공지사항" type="back"/>
      <section className="noticeWrap">
        <ul className="tabmenu">
          {noticeTabmenu.map((data,index) => {
            const param = {item: data, tab: tab, setTab: (val) => dispatch(setNoticeTab(val))}
            let newTage = false;
            if(data === "알림") {alarmData.alarm > 0 ? newTage = true : false}
            else {alarmData.notice > 0 ? newTage = true : false}
            return (
              <TabBtn param={param} key={index} newTage={newTage}/>
            )
          })}
          <div className="underline"/>
        </ul>
        {tab === noticeTabmenu[0] ?
          <Allim alarmList={alarmList} setAlarmList={setAlarmList}/>
          :
          <Post />
        }
      </section>
    </div>
  )
}

export default NoticePage;
