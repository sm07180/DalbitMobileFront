import React from 'react'

import './tabBtn.scss'

const TabBtn = (props) => {
  const {param} = props

  const tabClick = (e) => {
    const {tabTarget} = e.currentTarget.dataset
    if (tabTarget === param.item) {
      param.setTab(tabTarget)
      if (param.setPage) {
        param.setPage(0)
      }
    }
  }

  return (
    <li className={param.tab === param.item ? 'active' : ''} data-tab-target={param.item} onClick={tabClick}>{param.item}</li>
  )
}

export default TabBtn