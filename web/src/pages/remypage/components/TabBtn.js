import React from 'react'


const TabBtn = (props) => {
  const {param, tabChangeAction, defaultTab, newTag} = props

  const tabClick = (e) => {
    const {tabTarget} = e.currentTarget.dataset
    if (tabTarget === param.item) {
      param.setTab(tabTarget)
      if (param.setPage) {
        param.setPage(defaultTab ? defaultTab : 0)
      }
    }
    if(typeof tabChangeAction === 'function') tabChangeAction(param.item);
  }
  return (
    <li className={`${param.tab === param.item ? 'active' : ''} ${newTag ? "new" : ""}`} data-tab-target={param.item} onClick={tabClick}>
      <span>{param.item}</span>
    </li>
  )
}

export default TabBtn
