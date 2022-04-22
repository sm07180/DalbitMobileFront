import React, {useEffect, useState} from 'react'

import './detailView.scss'
import moment from "moment";
import UtilityCommon from "common/utility/utilityCommon";

const DetailView = (props) => {

  const {dateVal, setDateVal} = props;

  const [lastYn, setLastYn] = useState({next: true, prev: false});

  useEffect(() => {
    let date = new Date();
    if (`${date.getFullYear()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`}-01` === "2022-05-01") {
      setLastYn({next: true, prev: true});
    }
  }, []);


  const prevDate = () => {
    let date = new Date();
    date.setMonth(date.getMonth() - 2);
    date.setDate(1);
    let lastPrevDate = UtilityCommon.eventDateCheck("20220501") ? moment(date).format("YYYY-MM-DD") > "2022-05-01" ?  moment(date).format("YYYY-MM-DD") : "2022-05-01" : '2020-06-01';

    let prevDate = changeDate(dateVal, "prev");
      if (`${prevDate.year}-${prevDate.month}-01` >= lastPrevDate){
        setDateVal({...prevDate, title: `${prevDate.year}년 ${prevDate.month}월`});
        if (`${prevDate.year}-${prevDate.month}-01` === lastPrevDate) {
          setLastYn({next: false, prev: true});
        } else {
          setLastYn({next: false, prev: false});
        }
      }
  }

  const nextDate= () => {
    const cdt = new Date();
    const cyy = cdt.getFullYear()
    const cmm = cdt.getMonth() + 1

    let nextDate = changeDate(dateVal, "next");
    if (`${nextDate.year}-${nextDate.month}-01` <= `${cyy}-${cmm < 10 ? `0${cmm}` : cmm}-01`) {

      if (`${nextDate.year}-${nextDate.month}-01` === `${cyy}-${cmm < 10 ? `0${cmm}` : cmm}-01`){
        setDateVal({...nextDate, title: "이번달"})
        setLastYn({next: true, prev: false});
      } else {
        setDateVal({...nextDate, title: `${nextDate.year}년 ${nextDate.month}월`});
        setLastYn({next: false, prev: false});
      }
    }
  }

  const changeDate = (dates , slct) => {
    const selectDate = new Date(`${dates.year}-${dates.month}-01`);
    if (slct === "next"){
      selectDate.setMonth(selectDate.getMonth() + 1);
    } else {
      selectDate.setMonth(selectDate.getMonth() - 1);
    }
    return {year: selectDate.getFullYear(), month: selectDate.getMonth() + 1 < 10 ? `0${selectDate.getMonth() + 1}` : selectDate.getMonth() + 1};
  }



  return (
    <div className="detailView">
      <button
        className={`prevButton ${lastYn.prev ? "" : 'active'}`}
        onClick={() => {
          prevDate();
        }}>
        이전
      </button>

      <div className="titleWrap">
        <div className="title">{dateVal.title}</div>
      </div>

      <button
        className={`nextButton ${lastYn.next ? "" : 'active'}`}
        onClick={() => {
          nextDate()
        }}>
        다음
      </button>
    </div>
  )
}

export default DetailView
