import React, {useEffect, useState, useContext} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
//context
import API from 'context/api'
import {Context} from 'context/index.js'
import Room, {RoomJoin} from 'context/room'
import qs from 'query-string'
import Utility, {printNumber, addComma} from 'components/lib/utility'
//static
import AllIcon from '../static/all.svg'
import FanIcon from '../static/fan.svg'
import Restrict20 from '../static/restrict20.svg'
import SpecialIcon from '../static/special.svg'
import SimpleMessageIcon from '../static/message.svg'
import heartIcon from '../static/like_g_s.svg'
const RecomendContent = [
  {id: 0, tab: '이 방송 어때요?'},
  {id: 1, tab: '이 클립 어때요?'}
]
export default (props) => {
  // ctx && path
  const context = useContext(Context)
  const history = useHistory()
  //props
  const {recoList, clipType} = props
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
      <div className={changeTab === 0 ? 'simpleWrap' : 'chartListDetail'}>
        {recoList.length !== 0 && changeTab === 0
          ? recoList.map((item, idx) => {
              const {bgImg, entryCnt, nickNm, isSpecial, roomNo, roomType, title, entryType} = item
              return (
                <div
                  className="simpleContainer"
                  key={`${idx}+broadRecomendList`}
                  style={{backgroundImage: `url(${bgImg.thumb336x336})`}}>
                  <div className="simpleContainer__info">
                    <div className="simpleContainer__iconBox">
                      <img src={entryType === 2 ? Restrict20 : entryType === 1 ? FanIcon : AllIcon} />
                      {isSpecial && <img src={SpecialIcon} />}
                    </div>
                    <span className="simpleContainer__iconBox__entry">{entryCnt}</span>
                  </div>
                  <strong className="simpleContainer__title">{title}</strong>
                  <div className="dim"></div>
                </div>
              )
            })
          : recoList.map((item, idx) => {
              const {bgImg, clipNo, filePlayTime, gender, goodCnt, isSpecial, nickName, replyCnt, subjectType, title} = item
              return (
                <li className="chartListDetailItem" key={idx + 'list'}>
                  <div className="chartListDetailItem__thumb">
                    {isSpecial && <span className="newSpecialIcon">스페셜DJ</span>}
                    <img src={bgImg[`thumb190x190`]} alt={title} />
                    <span className="chartListDetailItem__thumb__playTime">{filePlayTime}</span>
                  </div>
                  <div className="textBox">
                    <p className="textBox__subject">
                      <span className="subject">
                        {clipType.map((ClipTypeItem, index) => {
                          if (ClipTypeItem.value === subjectType) {
                            return <React.Fragment key={idx + 'typeList'}>{ClipTypeItem.cdNm}</React.Fragment>
                          }
                        })}
                      </span>
                      <i className="line"></i>
                      <span className="title">{title}</span>
                    </p>
                    <p className="textBox__nickName">
                      {gender !== '' ? <span className={gender === 'm' ? 'maleIcon' : 'femaleIcon'} /> : <></>}
                      {nickName}
                    </p>
                    <div className="textBox__detail">
                      <span className="textBox__detail--item">
                        <img src={SimpleMessageIcon} width={16} />
                        {replyCnt > 999 ? Utility.printNumber(replyCnt) : Utility.addComma(replyCnt)}
                      </span>
                      <span className="textBox__detail--item">
                        <img src={heartIcon} width={16} />
                        {goodCnt > 999 ? Utility.printNumber(goodCnt) : Utility.addComma(goodCnt)}
                      </span>
                    </div>
                  </div>
                </li>
              )
            })}
      </div>
    </div>
  )
}
