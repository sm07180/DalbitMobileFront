import React from 'react'
import {IMG_SERVER} from 'context/config'

import './tabmenu.scss'

const TabmenuBtn = (props) => {
  const {tabBtn1, tabBtn2, tab, setTab, onOff, event, imgNam, btnColor} = props
	
  // 탭메뉴 이벤트
  const tabClick = (e) => {
    const {tabTarget} = e.currentTarget.dataset

    if (tabTarget === tabBtn1 || tabTarget === tabBtn2) {
      setTab({name: tabTarget})
    }
  }
  // 컴포넌트 시작
  return (
    <>
      <button className={tab === tabBtn1 ? 'active' : ''} data-tab-target={tabBtn1} data-btn={btnColor} onClick={tabClick}>
        <img src={`${IMG_SERVER}/event/${event}/${imgNam}-1${onOff === false ? '' : tab === tabBtn1 ? '-on' : '-off'}.png`} alt={tabBtn1} />
      </button>
      <button className={tab === tabBtn2 ? 'active' : ''} data-tab-target={tabBtn2} data-btn={btnColor} onClick={tabClick}>
        <img src={`${IMG_SERVER}/event/${event}/${imgNam}-2${onOff === false ? '' : tab === tabBtn2 ? '-on' : '-off'}.png`} alt={tabBtn2} />
      </button>
    </>
  )
}

TabmenuBtn.defaultProps = {
  tabBtn1: '',
  tabBtn2: '',
  tab: '',
  onOff: false,
  imgNam: 'tabBtn',
  btnColor: '',
}

export default TabmenuBtn
