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
import {RoomJoin} from "context/room";

let alarmFix = false;
let postFix = false;
const NoticePage = () => {
  const noticeTabmenu = ['알림','공지사항'];
  const {tab} = useSelector((state) => state.notice);
  const dispatch = useDispatch();
  const history = useHistory()
  const context = useContext(Context)
  const [alarmList, setAlarmList] = useState({list: [], cnt: 0, newCnt: 0});
  const alarmData = useSelector(state => state.newAlarm);
  const isDesktop = useSelector((state)=> state.common.isDesktop)

  /* 알림 조회 */
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

  /* 알림, 공지사항 New 조회 */
  const fetchMypageNewCntData = async (memNo) => {
    const res = await API.getMyPageNew(memNo);
    if(res.result === "success") {
      if(res.data) {
        dispatch(setNoticeData(res.data));
      }}
  }

  //알림 클릭시 해당 페이지로 이동
  const handleClick = (e) => {
    //type: 알림 타입, memNo: 회원 번호, roomNo: 방송방 번호, link: 이동 URL
    const { type, memNo, roomNo, link } = (e.currentTarget.dataset);
    alarmFix = true;
    switch (type) {
      case "1":                                                                             //마이스타 방송 알림
        try {if(roomNo !== "") {RoomJoin({roomNo: roomNo});}}
        catch (e) {console.log(e);}
        break;
      case "2": history.push("/");                                                  //달 알림
      case "5": history.push("/");                                                  //공지 알림
      case "7":                                                                             //공지사항 알림
        try {
          history.push({pathname: `/notice/${roomNo}`, state: roomNo});
        }
        catch (e) {console.log(e);}
        break;
      case "31":                                                                           //팬보드 새 글 알림
        if (context.profile.memNo === roomNo) {history.push(`/myProfile?tab=1`)}
        else {history.push(`/profile/${memNo}?tab=1`)}
        break;
      case "32":                                                                            //내 지갑
        try {history.push(`/wallet`);}
        catch (e) {console.log(e);}
        break;
      case "33":                                                                            //피드 새 글 알림
        try {
          if(memNo !== "") {
            if(roomNo !== "") {
              history.push(`/profileDetail/${memNo}/feed/${roomNo}`)
            } else {history.push(`/profile/${memNo}`);}
          }
        }
        catch (e) {console.log(e)};
        break;
      case "34":
        try {
          if(memNo !== "") {
            if(roomNo !== "") {
              history.push(`/profileDetail/${memNo}/feed/${roomNo}`)
            } else {history.push(`/profile/${memNo}`);}
          }
        }
        catch (e) {console.log(e)};
        break;
      case "35": history.push('/myProfile'); break;                                 //레벨업 알림
      case "36":                                                                           //팬 등록 알림
        try {if(memNo !== "") {history.push(`/profile/${memNo}`);}}
        catch (e) {console.log(e);}
        break;
      case "37": history.push('/customer/inquire'); break;                          //1:1문의 답변 알림
      case "38":                                                                            //방송 공지 알림
        try {
          if(memNo !== "") {
            if(roomNo !== "") {
              history.push(`/profileDetail/${memNo}/notice/${roomNo}`);
            } else {history.push(`/profile/${memNo}`);}
          }
        }
        catch (e) {console.log(e);}
        break;
      case "39": history.push(`/rank`); break;                                      //좋아요 랭킹 주간 알림
      case "40": history.push(`/rank`); break;                                      //좋아요 랭킹 일간 알림
      case "41": history.push(`/rank`); break;                                      //DJ 랭킹 일간 알림
      case "42": history.push(`/rank`); break;                                      //DJ 랭킹 주간 알림
      case "43": history.push(`/rank`); break;                                      //FAN 랭킹 일간 알림
      case "44": history.push(`/rank`); break;                                      //FAN 랭킹 주간 알림
      case "45": history.push(`/clip/${roomNo}`); break;                            //마이 스타 클립 알림, 내 클립 선물 알림, 3 = pc 클립을 틀 수 있는 새로운 방법이 필요함
      case "46": history.push(`/clip/${roomNo}`); break;                            //내 클립 댓글 알림
      case "47": history.push(`/clip/${roomNo}`); break;                            //클립 알림
      case "48":                                                                            //마이페이지 클립 업로드/청취내역 알림
        try {history.push(`/myclip`);}
        catch (e) {console.log(e);}
        break;
      case "53": history.push(`/event/attend_event`); break;                        //출석체크 알림
      case "50":                                                                            //
        let mobileLink = link
        try {mobileLink = JSON.parse(mobileLink).mobile}
        catch (e) {if (mobileLink !== "") {history.push(mobileLink)}}
      default: break;                                                                       //기본값
    }
  }

  //공지사항 세부페이지 이동
  const onClick = (e) => {
    const {num} = e.currentTarget.dataset
    history.push({pathname: `/notice/${num}`, state: num});
    postFix = true;
  };

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
    if(alarmFix) {
      dispatch(setNoticeTab("알림"));
      alarmFix = false;
    } else if(postFix) {
      dispatch(setNoticeTab("공지사항"));
      postFix = false;
    } else {
      if(alarmData.alarm > 0) {
        dispatch(setNoticeTab("알림"))
      } else if(alarmData.notice > 0) {
        dispatch(setNoticeTab("공지사항"))
      }
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
          <Allim alarmList={alarmList} setAlarmList={setAlarmList} handleClick={handleClick}/>
          :
          <Post onClick={onClick}/>
        }
      </section>
    </div>
  )
}

export default NoticePage;
