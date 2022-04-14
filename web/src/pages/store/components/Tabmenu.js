import React, {useRef} from 'react'

// components
import TabBtn from 'components/ui/tabBtn/TabBtn'

const Tabmenu = (props) => {
  const {data,tab,setTab,setPage, defaultTab} = props
  
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
          <TabBtn param={param} key={index} defaultTab={defaultTab} />
        )
      })}
    </ul>
  )
}

export default Tabmenu