import React from 'react'
import TabBtn from "pages/resetting/components/TabBtn";

// components

const Tabmenu = (props) => {
  const {data, tab, setTab, setPage, isTab, setIsTab, searchPaging, setSearchPaging} = props

  return (
    <ul className="tabmenu">
      {data.map((data,index) => {
        const param = {
          item: data,
          tab: tab,
          setTab: setTab,
          setPage: setPage,
          isTab: isTab,
          setIsTab: setIsTab,
          searchPaging: searchPaging,
          setSearchPaging: setSearchPaging
        }
        return (
          <TabBtn param={param} key={index} />
        )
      })}
    </ul>
  )
}

export default Tabmenu
