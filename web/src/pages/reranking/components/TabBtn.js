import React from 'react'

import 'components/ui/tabBtn/tabBtn.scss'

const TabBtn = (props) => {
  const {param} = props

  const tabClick = (e) => {
    param.setTab(param.item);
  }

  return (
    <li className={`tabList ${param.tab === param.item ? 'tabActive' : ''}`} onClick={tabClick}>{param.item}</li>
  )
}

export default TabBtn
