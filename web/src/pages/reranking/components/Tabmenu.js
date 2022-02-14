import React from 'react'

// global components
import TabBtn from './TabBtn'

const Tabmenu = (props) => {
  const {data, tab, setTab} = props

  return (
    <ul className="tabmenu">
      {data.map((data,index) => {
        const param = {
          item: data,
          tab: tab,
          setTab: setTab,
        }
        return (
          <TabBtn param={param} key={index} />
        )
      })}
      <div className="underline"></div>
    </ul>
  )
}

export default Tabmenu
