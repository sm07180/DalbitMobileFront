import React, {useState, useEffect, useRef, useContext, useCallback} from "react";
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import Api from 'context/api'

import Header from 'components/ui/new_header.js'

import TopInfo from "./content/topInfo";
import GotoMoonRanking from "./content/ranking";

import "./style.scss";

export default function Gotomoon() {
  const history = useHistory();
  const globalCtx = useContext(Context)

  const tabWrapRef = useRef(null);
  const tabBtnRef = useRef(null);
  const [tabFixed, setTabFixed] = useState(false);
  const [moonNumber, setMoonNumber] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [insDate, setInsDate] = useState("");
  
  const loginCheck = () => {
    if (!globalCtx.token.isLogin) {
      history.push('/login')
      return
    } else {
      gotomoonEventDate();
    }
  };

  const gotomoonEventDate = async () => {
    const { data, message } = await Api.getMoonLandInfoData();
    if (message === "SUCCESS") {
      const {moon_no, start_date, end_date, ins_date} = data[data.length - 1];
      setMoonNumber(parseInt(moon_no));
      setStartDate(start_date);
      setEndDate(end_date);
      setInsDate(ins_date);
    }
  };

  const scrollTabFixEvent = useCallback(() => {
    if (tabWrapRef.current && tabBtnRef.current) {
      if (window.pageYOffset > tabWrapRef.current?.offsetTop) {
        setTabFixed(true);
      } else {
        setTabFixed(false);
      }
    }
  }, []);


  useEffect(() => {        
    if (tabFixed) {window.scrollTo(0, 0);}
  }, [globalCtx.gotomoonTab]);

  useEffect(() => {
    loginCheck();
    document.addEventListener("scroll", scrollTabFixEvent);
    return () => document.removeEventListener("scroll", scrollTabFixEvent);
  }, [])
  
  return (
    <div id="goToMoon">
      <Header title="이벤트" />
      <div className="page">
        <img src="https://image.dalbitlive.com/event/gotomoon/event_gotomoom-visual.png" className="img_full" alt="달라에 코인 등장! 코인 모아서 달나라 갈끄니까!"/>
        <div className="pageContent" ref={tabWrapRef} style={{ paddingTop: tabFixed ? "50px" : "" }}>
          <div className={`tabWrap ${tabFixed === true ? "fixed" : ""}`} ref={tabBtnRef}>
            <button className="tabMenu" onClick={() =>globalCtx.action.updateGotomoonTab('info')}>
              <img src="https://image.dalbitlive.com/event/gotomoon/event_gotomoonTitle-info.png" className="titleImg" alt="이벤트 설명"/>
            </button>
            <button className="tabMenu" onClick={() =>globalCtx.action.updateGotomoonTab('rank')}>
              <img src="https://image.dalbitlive.com/event/gotomoon/event_gotomoonTitle-rank.png" className="titleImg" alt="이벤트 랭킹"/>
            </button>
          </div>

          {globalCtx.gotomoonTab  === "info" ?
            <TopInfo startDate={startDate} endDate={endDate}/>            
          : 
            <GotoMoonRanking moonNumber={moonNumber} endDate={endDate}/>
          }
        </div>
      </div>
    </div>
  );
}