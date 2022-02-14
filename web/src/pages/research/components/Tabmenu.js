import React, { useState } from 'react'

// components
// css
import '../scss/swiperList.scss';
import '../../../components/ui/tabBtn/tabBtn.scss';

const Tabmenu = (props) => {
  const {tabList, targetIndex, changeAction} = props

  const handleTabClick = (e) => {
    const { tabTarget } = e.currentTarget.dataset;

    if (tabTarget !== undefined && tabList[tabTarget] !== undefined) {
      changeAction(tabTarget);
    }
  };

  return (
    <ul className="tabmenu">
      {tabList.map((list,index) => {
        return (
          <li className={list === tabList[targetIndex] ? 'active' : ''} key={index} data-tab-target={index} onClick={handleTabClick}>{list}</li>
        )
      })}
    </ul>
  )
}

Tabmenu.defaultProps = {
  tabList: [],
  targetIndex: 0,
  changeAction: () => {}
};

export default Tabmenu;
