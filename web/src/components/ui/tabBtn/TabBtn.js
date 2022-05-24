import React from 'react'

import './tabBtn.scss'

const TabBtn = (props) => {
  const {param, tabChangeAction, defaultTab, subText} = props

  const tabClick = (e) => {
    const {tabTarget} = e.currentTarget.dataset
    if (tabTarget === param.item) {
      param.setTab(tabTarget)
      if(param.setIsTab) {
        param.setIsTab(!param.isTab);
        param.setSearchPaging({...param.searchPaging, page: 1});
      }
      if (param.setPage) {
        param.setPage(defaultTab ? defaultTab : 0)
      }
    }
    if(typeof tabChangeAction === 'function') tabChangeAction(param.item);
  }

  return (
    <li className={param.tab === param.item ? 'active' : ''} data-tab-target={param.item} onClick={tabClick}>{param.item}{subText}</li>
  )
}

TabBtn.defaultProps = {
  subText: null
};
export default TabBtn
