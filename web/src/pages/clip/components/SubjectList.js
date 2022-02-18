import React from 'react'

const SubjectList = (props) => {
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

export default SubjectList
