import React, {useEffect, useState, useContext} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
//context
import API from 'context/api'
import {Context} from 'context/index.js'
import Room, {RoomJoin} from 'context/room'
import {clipJoin} from 'pages/common/clipPlayer/clip_func'
import qs from 'query-string'
import Utility, {printNumber, addComma} from 'components/lib/utility'
import {OS_TYPE} from 'context/config'
//static
import AllIcon from '../static/all.svg'
import FanIcon from '../static/fan.svg'
import Restrict20 from '../static/restrict20.svg'
import SpecialIcon from '../static/special.svg'
import SimpleMessageIcon from '../static/message.svg'
import heartIcon from '../static/like_g_s.svg'
import ClipPlayerIcon from '../static/clip_player.svg'

export default (props) => {
  // ctx && path
  const context = useContext(Context)
  const history = useHistory()
  const customHeader = JSON.parse(API.customHeader)
  //props
  const {recoList, clipType, state, recoListClip} = props
  // state
  const [changeTab, useChangeTab] = useState(0)
  // fetch clip play
  const fetchDataPlay = async (clipNum) => {
    const {result, data, message, code} = await API.postClipPlay({
      clipNo: clipNum
    })
    if (result === 'success') {
      let playListInfoData = {
        listCnt: 20
      }
      localStorage.setItem('clipPlayListInfo', JSON.stringify(playListInfoData))
      clipJoin(data, context)
    } else {
      if (code === '-99') {
        context.action.alert({
          msg: message,
          callback: () => {
            history.push('/login')
          }
        })
      } else {
        context.action.alert({
          msg: message
        })
      }
    }
  }
  // func
  const ChangeButton = (type) => {
    props.setRecoTab(type)
    useChangeTab(type)
  }
  //-----------------------------------------------------------
  useEffect(() => {
    if (state && state.state === 'clip_search') {
      ChangeButton(1)
    }
    return () => {
      ChangeButton(0)
    }
  }, [])
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
              const {bgImg, entryCnt, isSpecial, roomNo, title, entryType} = item
              return (
                <div
                  className="simpleContainer"
                  key={`${idx}+broadRecomendList`}
                  style={{backgroundImage: `url(${bgImg.thumb336x336})`}}
                  onClick={() => {
                    if (customHeader['os'] === OS_TYPE['Desktop']) {
                      if (context.token.isLogin === false) {
                        history.push('/login')
                      } else {
                        context.action.updatePopup('APPDOWN', 'appDownAlrt', 2)
                      }
                    } else {
                      RoomJoin({roomNo: roomNo})
                    }
                  }}>
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
          : recoListClip.map((item, idx) => {
              const {bgImg, clipNo, filePlayTime, gender, goodCnt, isSpecial, nickName, replyCnt, subjectType, title} = item
              return (
                <li
                  className="chartListDetailItem"
                  key={idx + 'list'}
                  onClick={() => {
                    if (customHeader['os'] === OS_TYPE['Desktop']) {
                      if (context.token.isLogin === false) {
                        context.action.alert({
                          msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                          callback: () => {
                            history.push('/login')
                          }
                        })
                      } else {
                        context.action.updatePopup('APPDOWN', 'appDownAlrt', 4)
                      }
                    } else {
                      fetchDataPlay(clipNo)
                    }
                  }}>
                  <img className="clipBtnPlay" src={ClipPlayerIcon} />
                  <div className="chartListDetailItem__thumb">
                    {isSpecial && <span className="newSpecialIcon">스페셜DJ</span>}
                    <img
                      src={bgImg[`thumb190x190`]}
                      alt={title}
                      onClick={() => {
                        if (customHeader['os'] === OS_TYPE['Desktop']) {
                          if (context.token.isLogin === false) {
                            context.action.alert({
                              msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                              callback: () => {
                                history.push('/login')
                              }
                            })
                          } else {
                            context.action.updatePopup('APPDOWN', 'appDownAlrt', 4)
                          }
                        } else {
                          fetchDataPlay(clipNo)
                        }
                      }}
                    />
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
// map
const RecomendContent = [
  {id: 0, tab: '이 방송 어때요?'},
  {id: 1, tab: '이 클립 어때요?'}
]
