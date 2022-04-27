import React, {useContext, useEffect, useState} from 'react'

//global components
import InputItems from 'components/ui/inputItems/InputItems'
// components

import './report.scss'
import API from "context/api";
import {useHistory} from "react-router-dom";
import moment from "moment";
import ReportTabMenu from "../../components/ReportTabMenu";
import DatePicker from "./DatePicker";
import SubmitBtn from "components/ui/submitBtn/SubmitBtn";
import PopSlide, {closePopup} from "components/ui/popSlide/PopSlide";
import {useDispatch, useSelector} from "react-redux";
import {setSlidePopupOpen} from "redux/actions/common";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const ListenWrap = () =>{
  const history = useHistory();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  //조회 기간설정
  const tabmenu = ['오늘', '어제', '주간', '월간']
  const [tabType, setTabType] = useState(tabmenu[3])
  //요일 데이터 가공
  const dateToday = moment(new Date()).format('YYYYMMDD')
  const dateDayAgo = moment(new Date().setDate(new Date().getDate() - 1)).format('YYYYMMDD')
  const dateWeekAgo = moment(new Date().setDate(new Date().getDate() - 7)).format('YYYYMMDD')
  const dateMonthAgo = moment(new Date().setMonth(new Date().getMonth(), +1)).format('YYYYMMDD')
  const [dt, setDt] = useState({pickdataPrev: dateWeekAgo, pickdataNext: dateToday})
  const allDate = {dateToday, dateDayAgo, dateWeekAgo, dateMonthAgo};
  //dateType -> 0: 오늘 1: 어제 2: 주간 3: 월간 4: 특정날짜 지정시
  const [active, setActive] = useState(2);
  //상세내역 닉네임, 청취 날짜, 선물한 달
  const [listenListInfo, setListenListInfo] = useState([]);
  //총 선물한 달, 청취시간
  const [listenTotalInfo, setListenTotalInfo] = useState({giftDalTotCnt: 0, listeningTime: 0});

  const dispatch = useDispatch();
  const popup = useSelector(state => state.popup);


  //청취내역 조회
  const fetchData = () => {
    let params = {
      dateType: active,
      startDt: dt.pickdataPrev,
      endDt: dt.pickdataNext,
      page: 1,
      records: 999
    }
    API.report_listen({params}).then((res) => {
      if(res.result === "success") {
        if(!(res.data.list.length > 0)) { //리스트 없을 시 api에서 값 자체를 안넘겨줌 -> 고정값 0
          setListenListInfo([]);
          setListenTotalInfo({giftDalTotCnt: 0, listeningTime: 0});
        } else {
          setListenListInfo(res.data.list);
          setListenTotalInfo({giftDalTotCnt: res.data.giftDalTotCnt, listeningTime: res.data.listeningTime})
        }
      } else {
        dispatch(setGlobalCtxMessage({type: "alert",msg: res.message}));
      }
    }).catch((e) => {console.log(e)})
  };

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
    closePop();
  }

  //조회시 팝업 open
  const openPopup = () => {
    dispatch(setSlidePopupOpen());
  }

  //조회시 팝업 close
  const closePop = () => {
    closePopup(dispatch);
  }

  useEffect(() => {
    if(!(globalState.token.isLogin)) {
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
          <i className="icon timeListen"/>
          <div>청취시간</div>
          <div className="amount">{decodeSec(listenTotalInfo.listeningTime)}</div>
        </div>
        <div className="summaryList">
          <i className="icon dal"/>
          <div>달 선물</div>
          <div className="amount">{listenTotalInfo.giftDalTotCnt.toLocaleString("ko-KR")}</div>
        </div>
      </section>

      <section className="detailWrap">
        <div className="cntTitle">상세내역</div>
        {listenListInfo.map((v, idx) => {
          return(
            <div className="listenDetail" key={idx}>
              <div className="contentBox">
                <div>{v.bjNickNm}</div>
                <span className="date">{changeDay(v.startDt)}</span>
                <span className="light"><span>{changeMin(v.startDt)}</span> ~ <span>{changeMin(v.endDt)}</span>({decodeMin(v.listenTime)}분)</span>
              </div>
              <div className="contentBox">
                <div className="amount">{v.giftDalCnt.toLocaleString("ko-KR")}</div>
                <div className="light">선물 준 달</div>
              </div>
            </div>
          )
        })}
      </section>

      {popup.commonPopup &&
      <PopSlide title="기간 설정">
        <ReportTabMenu data={tabmenu} tab={tabType} setTab={setTabType} pickerPrev={pickerPrev} allDate={allDate} changeActive={changeActive}/>
        <InputItems>
          <DatePicker name="pickdata" value={dt.pickdataPrev} change={pickerPrev} changeActive={changeActive}/>
          <span className="iconCalendar"/>
        </InputItems>
        <InputItems>
          <DatePicker name="pickdata" value={dt.pickdataNext} change={pickerNext} changeActive={changeActive}/>
          <span className="iconCalendar"/>
        </InputItems>
        <SubmitBtn text={'기간적용'} onClick={clickConfirm}/>
      </PopSlide>
      }
    </>
  )
}

export default ListenWrap;
