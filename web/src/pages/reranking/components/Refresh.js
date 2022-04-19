import React, {useState, useEffect} from 'react'

import Lottie from 'react-lottie'
// global components
import Swiper from 'react-id-swiper'
import {Context} from "context";
import {useHistory} from "react-router-dom";
import {RoomValidateFromClip, RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {IMG_SERVER} from 'context/config'

const Refresh = (props) => {
  const {select, setSelect} = props;

  const [refreshText, setRefreshText] = useState("");
  const [refreshNum, setRefreshNum] = useState(0);

  const chartSelect = () => {
    if(refreshText === "일간 랭킹"){
      setSelect("today")
    } else if(refreshText === "주간 랭킹") {
      setSelect("thisweek")
    } else if(refreshText === "월간 랭킹") {
      setSelect("thismonth")
    } else if(refreshText === "연간 랭킹") {
      setSelect("thisyear")
    } else if(refreshText === "타임 랭킹") {
      setSelect("time")
    }
  }
  
  useEffect(() => {
    if(select === "time") {
      setRefreshText("일간 랭킹");
      setRefreshNum(1);
    } else if(select === "today") {
      setRefreshText("주간 랭킹");
      setRefreshNum(2);
    } else if(select === "thisweek") {
      setRefreshText("월간 랭킹");
      setRefreshNum(3);
    } else if(select === "thismonth") {
      setRefreshText("연간 랭킹");
      setRefreshNum(4);
    } else if(select === "thisyear") {
      setRefreshText("타임 랭킹");
      setRefreshNum(5);
    }
  }, [select])

  return (
    <div className='refreshWrap' onClick={chartSelect}>
      <span className='refreshIcon'></span>
      <p className='refreshText'><strong>{refreshText}</strong>이 궁금하다면?</p>
      <span className='refreshNum'><span>{refreshNum}</span>/5</span>
    </div>
  )
}

export default Refresh;
