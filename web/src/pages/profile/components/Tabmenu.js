import React from 'react'

// components
import TabBtn from 'components/ui/tabBtn/TabBtn'

const Tabmenu = (props) => {
  const {data,tab,setTab,setPage, tabChangeAction, count} = props

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
          <TabBtn param={param} key={index} tabChangeAction={tabChangeAction} subText={count[index]}/>
        )
      })}
    </ul>
  )
}
Tabmenu.defaultProps = {
  count: []
}
export default Tabmenu
