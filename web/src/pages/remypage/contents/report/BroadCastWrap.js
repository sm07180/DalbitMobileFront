import React, {useContext, useEffect, useState} from 'react'

//global components
import InputItems from 'components/ui/inputItems/InputItems'
// components

import './report.scss'
import API from "context/api";
import {Context} from "context";
import {useHistory} from "react-router-dom";
import moment from "moment";
import PopSlide from "components/ui/popSlide/PopSlide";
import SubmitBtn from "components/ui/submitBtn/SubmitBtn";
import ReportTabMenu from "pages/remypage/components/ReportTabMenu";
import DatePickerPage from "pages/remypage/contents/report/DatePicker";

const broadCastWrap = () => {
  const context = useContext(Context);
  const history = useHistory();
  //조회 기간설정
  const tabmenu = ['오늘', '어제', '주간', '월간']
  const [tabType, setTabType] = useState(tabmenu[3])

  const dateToday = moment(new Date()).format('YYYYMMDD')
  const dateDayAgo = moment(new Date().setDate(new Date().getDate() - 1)).format('YYYYMMDD')
  const dateWeekAgo = moment(new Date().setDate(new Date().getDate() - 7)).format('YYYYMMDD')
  const dateMonthAgo = moment(new Date().setMonth(new Date().getMonth(), +1)).format('YYYYMMDD')
  const [dt, setDt] = useState({pickdataPrev: dateWeekAgo, pickdataNext: dateToday})
  const allDate = {dateToday, dateDayAgo, dateWeekAgo, dateMonthAgo};

  //dateType -> 0: 오늘 1: 어제 2: 주간 3: 월간 4: 특정날짜 지정시
  const [active, setActive] = useState(2);
  //상세내역 방송시간, 달, 좋아요, 청취자 수
  const [broadListInfo, setBroadListInfo] = useState([]);
  //총 방송시간, 달, 좋아요, 청취자 수
  const [broadTotalInfo, setBroadTotalInfo] = useState({broadcastTime: 0, byeolTotCnt: 0, goodTotCnt: 0, listenerTotCnt: 0});
  //Popup Open/Close용
  const [bottomSlide, setBottomSlide] = useState(false);

  // 방송내역 조회
  const fetchData = () => {
    let params = {
      dateType: active,
      startDt: dt.pickdataPrev,
      endDt: dt.pickdataNext,
      page: 1,
      records: 100
    }
    API.report_broad({params}).then((res) => {
      if(res.result === "success") {
        if(!(res.data.list.length > 0)) { //리스트 없을 시 api에서 값 자체를 안넘겨줌 -> 고정값 0
          setBroadListInfo([]);
          setBroadTotalInfo({
            broadcastTime: 0,
            byeolTotCnt: 0,
            goodTotCnt: 0,
            listenerTotCnt: 0
          })
        } else {
          setBroadListInfo(res.data.list);
          setBroadTotalInfo({
            broadcastTime: res.data.broadcastTime,
            byeolTotCnt: res.data.byeolTotCnt,
            goodTotCnt: res.data.goodTotCnt,
            listenerTotCnt: res.data.listenerTotCnt
          })
        }
      } else {
        context.action.alert({msg: res.message});
      }
    }).catch((e) => console.log(e));
  }

  //초 -> 시/분/초
  const decodeSec = (seconds) => {
    let hour = parseInt(seconds / 3600) < 10 ? "0" + parseInt(seconds / 3600) : parseInt(seconds / 3600);
    let min = parseInt((seconds % 3600) / 60) < 10 ? "0" + parseInt((seconds % 3600) / 60) : parseInt((seconds % 3600) / 60);
    let sec = seconds % 60 < 10 ? "0" + seconds % 60 : seconds % 60
    return hour + ":" + min + ":" + sec;
  }

  //초 -> 분
  const decodeMin = (seconds) => {
    return parseInt((seconds % 3600) / 60) < 10 ? "0" + parseInt((seconds % 3600) / 60) : parseInt((seconds % 3600) / 60);
  }

  //요일 데이터 가공
  const changeDay = (date) => {
    return moment(date, "YYYYMMDDhhmmss").format("YYYY-MM-DD");
  };

  //시간 데이터 가공
  const changeMin = (date) => {
    return moment(date, "YYYYMMDDHHmmss").format("HH:mm");
  }


  //dt.pickdataPrev값 변경
  const pickerPrev = (value, btn) => {
    if(btn === "dayAgo") {setDt({...dt, pickdataPrev: value, pickdataNext: value});} //"어제"의 경우 pickdataNext도 변경
    else {setDt({...dt, pickdataPrev: value, pickdataNext: dateToday});}
  }

  //dt.pickdataNext값 변경
  const pickerNext = (value) => {
    setDt({...dt, pickdataNext: value});
  }

  //dateType값 변경
  const changeActive = (active) => {
    setActive(active);
  }

  //기간 적용시 해당 요일로 방송,청취 내역 조회
  const clickConfirm = () => {
    fetchData();
    closePopup();
  }

  //조회시 팝업 open
  const openPopup = () => {
    setBottomSlide(true);
  }

  //조회시 팝업 close
  const closePopup = () => {
    setBottomSlide(false);
  }

  useEffect(() => {
    if(!(context.token.isLogin)) {
      history.push("/login");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);
  return(
    <>
      <section className="periodWrap">
        <div className="cntTitle">조회기간</div>
        <InputItems button={'조회'} btnClass={'periodBtn'} onClick={openPopup}>
          <input type="button" value={changeDay(dt.pickdataPrev) + " ~ " + changeDay(dt.pickdataNext)} onClick={openPopup} />
        </InputItems>
      </section>

      <section className="summaryWrap">
        <div className="cntTitle">방송요약</div>
        <div className="summaryList">
          <i className="icon timeBroadcast"/>
          <div>방송시간</div>
          <div className="amount">{decodeSec(broadTotalInfo.broadcastTime)}</div>
        </div>
        <div className="summaryList">
          <i className="icon byeol"/>
          <div>받은 별</div>
          <div className="amount">{broadTotalInfo.byeolTotCnt.toLocaleString("ko-KR")}</div>
        </div>
        <div className="summaryList">
          <i className="icon like"/>
          <div>좋아요</div>
          <div className="amount">{broadTotalInfo.goodTotCnt.toLocaleString("ko-KR")}</div>
        </div>
        <div className="summaryList">
          <i className="icon listen"/>
          <div>시청자</div>
          <div className="amount">{broadTotalInfo.listenerTotCnt.toLocaleString("ko-KR")}</div>
        </div>
      </section>

      <section className="detailWrap">
        <div className="cntTitle">상세내역</div>
        {broadListInfo.map((v, idx) => {
          return (
            <div className="broadcastDetail" key={idx}>
              <div className="dateBox">
                <div>{changeDay(v.startDt)}</div>
                <div className="light">{changeMin(v.startDt)} ~ {changeMin(v.endDt)} ({decodeMin(v.airTime)}분)</div>
              </div>
              <div className="contentBox">
                <div className="content">
                  <div>{v.byeolCnt.toLocaleString("ko-KR")}</div>
                  <div className="light">받은 별</div>
                </div>
                <div className="content">
                  <div>{v.likes.toLocaleString("ko-KR")}</div>
                  <div className="light">좋아요</div>
                </div>
                <div className="content">
                  <div>{v.listenerCnt.toLocaleString("ko-KR")}</div>
                  <div className="light">최다시청자</div>
                </div>
              </div>
            </div>
          )
        })}
      </section>

      {bottomSlide &&
      <PopSlide title="기간 설절" setPopSlide={setBottomSlide}>
        <ReportTabMenu data={tabmenu} tab={tabType} setTab={setTabType} pickerPrev={pickerPrev} allDate={allDate} changeActive={changeActive}/>
        <InputItems>
          <DatePickerPage name="pickdata" value={dt.pickdataPrev} change={pickerPrev} changeActive={changeActive}/>
          <span className="iconCalendar"/>
        </InputItems>
        <InputItems>
          <DatePickerPage name="pickdata" value={dt.pickdataNext} change={pickerNext} changeActive={changeActive}/>
          <span className="iconCalendar"/>
        </InputItems>
        <SubmitBtn text={'기간적용'} onClick={clickConfirm}/>
      </PopSlide>
      }
    </>
  )
}

export default broadCastWrap;