import React from 'react'

// components
import TabBtn from 'components/ui/tabBtn/TabBtn'

const Tabmenu = (props) => {
  const {data,tab,setTab} = props

  return (
    <ul className="tabmenu">
      {data.map((data,index) => {
        const param = {
          item: data,
          tab: tab,
          setTab: setTab
        }
        return (
          <TabBtn param={param} key={index} />
        )
      })}
    </ul>
  )
}

export default Tabmenu
