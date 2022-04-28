import React, {useState} from 'react';

const Tabmenu = (props) => {
  const {data,setPage,tabAction,defaultTab} = props;
  const [tab, setTab] = useState(data[0]);
  
  return (
    <div className="tabmenuWrap">
      <ul className="tabmenu">
        {data.map((list,index) => {
          const tabClick = (e) => {
            const {tabTarget} = e.currentTarget.dataset;
            if (tabTarget === list) {
              setTab(tabTarget)
              tabAction(tabTarget)
              if (setPage) {
                setPage(defaultTab ? defaultTab : 0)
              }
            }
          }
          return (
            <li className={tab === list ? 'active' : ''} data-tab-target={list} onClick={tabClick} key={index}>{list}</li>
          )
        })}
        <div className="underline"></div>
      </ul>
    </div>
  )
}

export default Tabmenu;
