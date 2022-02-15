import React, {useState} from 'react'
import ReportTabBtn from "pages/remypage/components/ReportTabBtn";

// components

const ReportTabMenu = (props) => {
  const {data, tab, setTab, setPage, pickerPrev, allDate, changeActive} = props //ReportPopup.js에서 넘겨줌

  return (
    <ul className="tabmenu">
      {data.map((data,index) => {
        const param = {
          item: data,
          tab: tab,
          setTab: setTab,
          setPage: setPage
        }
        return (
          <ReportTabBtn param={param} key={index} pickerPrev={pickerPrev} allDate={allDate} changeActive={changeActive}/>
        )
      })}
    </ul>
  )
}

export default ReportTabMenu;
