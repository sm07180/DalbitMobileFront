import React from 'react'

// global components
import TabBtn from 'components/ui/tabBtn/TabBtn.js'
// components
// css
import './swiperList.scss'

const Tabmenu = (props) => {
  const {data,tab,setTab,setPage} = props

  return (
    <ul className="tabmenu">
      {data.map((list,index) => {
        const param = {
          item: list,
          tab: tab,
          setTab: setTab,
          setPage: setPage,
        }
        return (
          <TabBtn param={param} key={index} />
        )
      })}
    </ul>
  )
}

export default Tabmenu
