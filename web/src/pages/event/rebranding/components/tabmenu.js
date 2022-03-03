import React, {useEffect, useState} from 'react'
import {IMG_SERVER} from 'context/config'

const Tabmenu = (props) => {
  const {tabmenu,tabmenuType,setTabmenuType} = props

  // 탭메뉴 액션
  const tabActive = (index) => {
    setTabmenuType(tabmenu[index])
  }

  return (
    <div className="tabmenuWrap">
      <div className="tabmenu">
        {tabmenu.map((data,index) => {
          return (
            <li className={`${tabmenuType === tabmenu[index] ? 'active' : ''}`} onClick={() => tabActive(index)} key={index}>
              <img src={`${IMG_SERVER}/event/rebranding/tabmenu-${data !== '스페셜' ? data : 3}.png`} alt={data} />
            </li>
          )
        })}
      </div>
    </div>
  )
}

export default Tabmenu
