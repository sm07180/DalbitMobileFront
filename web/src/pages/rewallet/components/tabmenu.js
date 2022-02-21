import React from 'react'

// components
import TabBtn from 'components/ui/tabBtn/TabBtn'

const Tabmenu = (props) => {
  const {data,tab,setTab,setPage,
    tabMenuRef} = props

  return (
    <ul className="tabmenu" ref={tabMenuRef}>
      {data.map((data,index) => {
        const param = {
          item: data,
          tab: tab,
          setTab: setTab,
          setPage: setPage
        }
        return (
          <TabBtn param={param} key={index} />
        )
      })}
    </ul>
  )
}
Tabmenu.defaultProps = {
  tabMenuRef: null
}
export default Tabmenu
