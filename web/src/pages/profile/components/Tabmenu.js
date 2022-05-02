import React from 'react';

const Tabmenu = (props) => {
  const {data,tab,setTab,tabChangeAction,count} = props;

  return (
    <ul className="tabmenu">
      {data.map((list,index) => {
        const tabClick = (e) => {
          const {targetTab} = e.currentTarget.dataset;
          if (targetTab === list) {
            setTab(targetTab)
          }
          if(typeof tabChangeAction === 'function') tabChangeAction(list);
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
