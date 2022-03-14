import React, {useState, useEffect, useContext } from "react";

import "../style.scss";

import moment from "moment";
import "moment/locale/ko"

export default function TopInfo(props) {
  const {endDate, startDate} = props

  let eventStart = moment(startDate).format("MMM Do (ddd)");
  let eventEnd = moment(endDate).format("MMM Do (ddd)");

  return (    
    <div id="topInfo">
      <img src="https://image.dalbitlive.com/event/dalla/7781/event_gotomoon-info.png" className="img_full" alt="이벤트 내용 설명"/>
      <div className="eventSchedule">
        {eventStart} ~ {eventEnd}
      </div>
    </div>  
  );
}
