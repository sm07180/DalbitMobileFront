import React, {useEffect, useState, useContext} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
//context
import API from 'context/api'
import {Context} from 'context/index.js'
import Room, {RoomJoin} from 'context/room'

import qs from 'query-string'
//static

const RecomendContent = [
  {id: 0, tab: '이 방송 어때요?'},
  {id: 1, tab: '이 클립 어때요?'}
]
export default (props) => {
  // ctx && path
  const context = useContext(Context)
  const history = useHistory()
  // state
  const [changeTab, useChangeTab] = useState(0)
  const ChangeButton = (type) => {
    props.setRecoTab(type)
    useChangeTab(type)
  }
  //render ----------------------------------------------------
  return (
    <div className="recomendWrap">
      <div className="initialTab">
        {RecomendContent.map((item, idx) => {
          return (
            <button
              key={`${idx}+recomandTab`}
              onClick={() => ChangeButton(item.id)}
              className={changeTab === item.id ? `activeTab` : ``}>
              {item.tab}
            </button>
          )
        })}
      </div>
    </div>
  )
}
