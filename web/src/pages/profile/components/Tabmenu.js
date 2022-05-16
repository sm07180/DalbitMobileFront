import React from 'react';

const Tabmenu = (props) => {
  const {data,tab,setTab,count} = props;

  return (
    <ul className="tabmenu">
      {data.map((list,index) => {
        const tabClick = (e) => {
          const {targetTab} = e.currentTarget.dataset;
          setTab(targetTab);
          if (typeof tabChangeAction === 'function') tabChangeAction(targetTab);
        }

        return (
          <li className={tab === list ? 'active' : ''} data-target-tab={list} onClick={tabClick} key={index}>{list}{count[index]}</li>
        )
      })}
    </ul>
  )
}
Tabmenu.defaultProps = {
  count: []
}
export default Tabmenu;
