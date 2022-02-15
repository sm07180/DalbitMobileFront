import React, {useState} from 'react'

import 'components/ui/tabBtn/tabBtn.scss'

const TabBtn = (props) => {
  const {param, pickerPrev, allDate, changeActive} = props //ReportTabMenu.js에서 넘겨줌

  const tabClick = (e) => { //탭 클릭시 해당 요일로 dt값 변경, dateType변경
    const {tabTarget} = e.currentTarget.dataset
    if (tabTarget === param.item) {
      param.setTab(tabTarget);
      if (param.setPage) {param.setPage(0);};
    };
    switch (tabTarget) {
      case "오늘" : pickerPrev(allDate.dateToday, "btn"); changeActive(0); break;
      case "어제" : pickerPrev(allDate.dateDayAgo, "dayAgo"); changeActive(1); break;
      case "주간" : pickerPrev(allDate.dateWeekAgo, "btn"); changeActive(2); break;
      case "월간" : pickerPrev(allDate.dateMonthAgo, "btn"); changeActive(3); break;
    };
  };

  return (
    <li className={param.tab === param.item ? 'active' : ''} data-tab-target={param.item} onClick={tabClick}>{param.item}</li>
  )
}

export default TabBtn;
