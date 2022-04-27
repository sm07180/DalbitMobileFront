import React from 'react';

const SubTabmenu = (props) => {
  const {data,tab,setTab} = props;
  
  return (
    <ul className="subTabmenu">
      {data.map((list,index) => {
        const tabClick = (e) => {
          const {tabTarget} = e.currentTarget.dataset;
          if (tabTarget === list) {
            setTab(tabTarget)
          }
        }
        return (
          <li className={tab === list ? 'active' : ''} data-tab-target={list} onClick={tabClick} key={index}>{list}</li>
        )
      })}
    </ul>
  )
}

export default SubTabmenu;