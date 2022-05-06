import React, {useState} from 'react';

const Tabmenu = (props) => {
  const {data,setPage,tabAction,defaultTab} = props;
  const [tab, setTab] = useState(data[0]);
  
  return (
    <div className="tabmenuWrap">
      <ul className="tabmenu">
        {data.map((list,index) => {
          const tabClick = (e) => {
            const {targetTab} = e.currentTarget.dataset;
            if (targetTab === list) {
              setTab(targetTab)
              tabAction(targetTab)
              if (setPage) {
                setPage(defaultTab ? defaultTab : 0)
              }
            }
          }
          return (
            <li className={tab === list ? 'active' : ''} data-target-tab={list} onClick={tabClick} key={index}>{list}</li>
          )
        })}
        <div className="underline"></div>
      </ul>
    </div>
  )
}

export default Tabmenu;
