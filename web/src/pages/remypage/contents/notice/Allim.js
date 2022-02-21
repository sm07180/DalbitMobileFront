import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import {GlobalContext} from "context";

import Api from 'context/api'
// global components
import ListRow from 'components/ui/listRow/ListRow'
import moment from "moment";
import {RoomJoin} from "context/room";
import {clipJoin} from "pages/common/clipPlayer/clip_func";
// components
import './notice.scss'
import Header from "components/ui/header/Header";

const Allim = () => {
  const [alarmList, setAlarmList] = useState({list : [], cnt : 0});
  const context = useContext(Context);
  const global = useContext(GlobalContext);
  const { globalState, globalAction } = global;
  const history = useHistory();

  //회원 알림 db값 가져오기
  const fetchData = () => {
    let params = {page: 1, records: 1000};
    Api.my_notification(params).then((res) => {
      if(res.result === "success") {
        if(res.data.list.length > 0) {
          setAlarmList({...alarmList, list: res.data.list, cnt : res.data.cnt});
          if(res.data.newCnt === 1) {
            globalState.alarmStatus = true;
          } else {
            globalState.alarmStatus = false;
          }
        } else {
          setAlarmList({...alarmList});
        }
      }
    }).catch((e) => {console.log(e)});
  };

  //알림 클릭시 해당 페이지로 이동 -> 리브랜딩 주소로 다시 바꿔야함....
  const handleClick = (e) => {
    //type: 알림 타입, memNo: 회원 번호, roomNo: 방송방 번호, link: 이동 URL
    const { type, memNo, roomNo, link } = (e.currentTarget.dataset);
    switch (type) {
      case "1":                                                                             //마이스타 방송 알림
        try {if(roomNo !== "") {RoomJoin({roomNo: roomNo});}}
        catch (e) {console.log(e);}
        break;
      case "2": history.push("/");                                                  //달 알림
      case "5": history.push("/");                                                  //공지 알림
      case "7":                                                                             //공지사항 알림
        try {if(roomNo !== "") {history.push(`/customer/notice/${roomNo}`);}}
        catch (e) {console.log(e);}
        break;
      case "31":                                                                           //팬보드 새 글 알림
        if (context.profile.memNo === roomNo) {history.push(`/myProfile`)}
        else {history.push(`/profile/${memNo}`)}
        break;
      case "32":                                                                            //내 지갑
        try {history.push(`/wallet`);}
        catch (e) {console.log(e);}
        break;
      case "35": history.push('/myProfile'); break;                                 //레벨업 알림
      case "36":                                                                           //팬 등록 알림
        try {if(memNo !== "") {history.push(`/profile/${memNo}`);}}
        catch (e) {console.log(e);}
        break;
      case "37": history.push('/customer/inquire'); break;                          //1:1문의 답변 알림
      case "38":                                                                            //마이 스타 방송 공지 알림
        try {if(memNo !== "") { history.push(`/profile/${memNo}`);}}
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

  //요일 데이터 가공
  const changeDay = (date) => {
    return moment(date, "YYYYMMDDhhmmss").format("YY.MM.DD");
  };

  //푸시 설정하기로 이동(알림 없을때 출력)
  const onClick = () => {
    history.push(`/setting/push`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if(!(context.token.isLogin)) {history.push("/login")}
  }, []);

  return (
    <div id="notice">
      <section className="noticeWrap">
        <div className="allim">
          {alarmList.list.length > 0 ?
            <>
              {alarmList.list.map((v, idx) => { //newCnt -> 새로운 알림 있을때 1, 없을때 0
                return (
                  <ListRow key={idx} photo={v.profImg.thumb88x88}>
                    <div className="listContent" data-type={v.notiType} data-mem-no={v.memNo} data-room-no={v.roomNo}
                         data-link={v.link} onClick={handleClick}>
                      <div className="title">{v.contents}</div>
                      <div className="date">{changeDay(v.regDt)}</div>
                    </div>
                  </ListRow>
                )
              })}
            </>
            :
            <div className="allimNone">
              <p>새로운 소식이 없어요<br/>오늘의 소식이 생기면 알려드릴께요!</p>
              <button onClick={onClick}>푸시 설정하기</button>
            </div>
          }
        </div>
      </section>
    </div>
  )
};

export default Allim;
