import React, {useRef} from 'react'

// components
import TabBtn from 'components/ui/tabBtn/TabBtn'

const Tabmenu = (props) => {
  const {data,tab,setTab,setPage} = props
  const tabMenuRef = useRef();

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

export default Tabmenu
