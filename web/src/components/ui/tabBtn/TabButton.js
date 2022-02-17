import React from 'react'

import './tabBtn.scss'

const TabButton = (props) => {
  const { target, item, tabChangeAction } = props;

  const tabClick = (e) => {
    const { tabTarget } = e.currentTarget.dataset;
    if(tabTarget !== undefined && typeof tabChangeAction === 'function') tabChangeAction(tabTarget);
  }

  return (
    <li className={target === item ? 'active' : ''} data-tab-target={item} onClick={tabClick}>{item}</li>
  )
}

TabButton.defaultProps = {
  target: '',
  item: '',
  tabChangeAction: () => {}
};

export default TabButton;

