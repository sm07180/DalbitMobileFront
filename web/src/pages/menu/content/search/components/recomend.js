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
  //props
  const {recoList} = props
  // state
  const [changeTab, useChangeTab] = useState(0)
  const ChangeButton = (type) => {
    props.setRecoTab(type)
    useChangeTab(type)
  }
  //render ----------------------------------------------------
  return (
    <div className="recomendWrap">
      {/*탭 0:방송방 1:클립*/}
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
      {/* 컨텐츠 리스트  0:방송방=>심플레이아웃 1:클립=>디테일레이아웃*/}
      <div className={changeTab === 0 ? 'simpleWrap' : 'detailWrap'}>
        {recoList && changeTab === 0
          ? recoList.map((item, idx) => {
              const {bgImg, entryCnt, nickNm, isSpecial, roomNo, roomType, title, entryType} = item
              console.log(item)
              return (
                <div className="simpleContainer" key={`${idx}+broadRecomendList`}>
                  <div className="simpleContainer__info">
                    <div className="simpleContainer__iconBox">
                      <span>all</span>
                      <span>all</span>
                    </div>
                    <span>{entryCnt}</span>
                  </div>
                  <strong className="simpleContainer__title">{title}</strong>
                </div>
              )
            })
          : recoList.map((item, idx) => {
              return <h2>클립</h2>
            })}
      </div>
    </div>
  )
}
