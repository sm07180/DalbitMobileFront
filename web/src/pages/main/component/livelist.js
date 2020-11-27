import React, {useEffect, useRef, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import styled from 'styled-components'

//context
import Room, {RoomJoin} from 'context/room'
import Api from 'context/api'
import {Context} from 'context'
import {OS_TYPE} from 'context/config.js'

import Util from 'components/lib/utility.js'

const makeContents = (props) => {
  let history = useHistory()
  const customHeader = JSON.parse(Api.customHeader)
  const globalCtx = useContext(Context)
  const context = useContext(Context)
  const {list, liveListType, categoryList} = props
  const evenList = list.filter((v, idx) => idx % 2 === 0)
  return list.map((list, idx) => {
    const {
      roomNo,
      roomType,
      bjProfImg,
      bjNickNm,
      bjGender,
      title,
      likeCnt,
      entryCnt,
      entryType,
      giftCnt,
      isSpecial,
      boostCnt,
      rank,
      os,
      liveBadgeList,
      isNew,
      totalCnt,
      gstProfImg,
      isGoodMem
    } = list

    const alertCheck = (roomNo) => {
      RoomJoin({
        roomNo: roomNo
      })
    }

    return (
      <div
        className={`${liveListType === 'detail' ? 'liveList__item' : 'liveList__flex'}`}
        key={`live-${idx}`}
        onClick={() => {
          if (customHeader['os'] === OS_TYPE['Desktop']) {
            if (globalCtx.token.isLogin === false) {
              globalCtx.action.alert({
                msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                callback: () => {
                  history.push('/login')
                }
              })
            } else {
              globalCtx.action.updatePopup('APPDOWN', 'appDownAlrt', 2)
            }
          } else {
            alertCheck(roomNo)
          }
        }}>
        <div className="broadcast-img">
          <img src={bjProfImg.thumb190x190} className="thumb-dj" alt={bjNickNm} />
          {gstProfImg.thumb190x190 && (
            <span className="thumb-guest">
              <img src={gstProfImg.thumb190x190} alt="게스트" />
            </span>
          )}
        </div>

        {liveListType === 'detail' ? (
          <div className="broadcast-content">
            <div className="title">
              <p className="category">
                {categoryList && (
                  <>
                    {(() => {
                      const target = categoryList.find((category) => category['cd'] === roomType)
                      if (target && target['cdNm']) {
                        return target['cdNm']
                      }
                    })()}
                  </>
                )}
              </p>
              <i className="line"></i>
              <span>{title}</span>
            </div>
            {/* <div className="title">
              <p className="category">
                {liveListType === 'detail' ? (
                  <>
                    {(() => {
                      const target = categoryList.find((category) => category['cd'] === roomType)
                      if (target && target['cdNm']) {
                        return target['cdNm']
                      }
                    })()}
                  </>
                ) : (
                  ''
                )}
              </p>

              <i className="line"></i>
              <span>{title}</span>
            </div> */}
            <div className="nickname">
              {bjGender !== '' && <div className={`gender-icon ${bjGender === 'm' ? 'male' : 'female'}`}>성별</div>}
              {os === 3 && <i className="iconPc">PC</i>}
              {isNew === true && <span className="new-dj-icon">신입DJ</span>}
              {liveBadgeList &&
                liveBadgeList.length !== 0 &&
                liveBadgeList.map((item, idx) => {
                  return (
                    <React.Fragment key={idx + `badge`}>
                      {item.icon !== '' ? (
                        <div
                          className="badgeIcon topImg"
                          style={{
                            background: `linear-gradient(to right, ${item.startColor}, ${item.endColor}`,
                            marginRight: '4px'
                          }}>
                          <img src={item.icon} style={{height: '16px'}} />
                          {item.text}
                        </div>
                      ) : (
                        <div
                          style={{
                            background: `linear-gradient(to right, ${item.startColor}, ${item.endColor}`,
                            marginRight: '4px'
                          }}
                          className="badgeIcon text">
                          {item.text}
                        </div>
                      )}
                    </React.Fragment>
                  )
                })}
              {isSpecial === true && <em className="newSpecialIcon">스페셜dj</em>}
              <span>{bjNickNm}</span>
            </div>
            <div className="detail">
              <div className="value">
                <i className="value--people"></i>
                <span>{Util.printNumber(totalCnt)}</span>
              </div>

              <div className="value">
                <i className="value--hit"></i>
                <span>{Util.printNumber(entryCnt)}</span>
              </div>

              {boostCnt > 0 ? (
                <div className="value isBoost">
                  <i className="value--boost"></i>
                  <span className="txt_boost">{Util.printNumber(likeCnt)}</span>
                </div>
              ) : (
                <div className="value">
                  <i className="value--like"></i>
                  <span>{Util.printNumber(likeCnt)}</span>
                </div>
              )}
              {isGoodMem && (
                <div className="value">
                  <i className="value--goodMem goodMember">사랑꾼</i>
                  <span />
                </div>
              )}
              {/* {rank < 11 && (
                <div className="value">
                  <img src={starIcon} />
                  <span>{Util.printNumber(giftCnt)}</span>
                </div>
              )} */}
            </div>
          </div>
        ) : (
          <div className="broadcast-content">
            <div className="top-status">
              {isSpecial && <span className="special-icon"></span>}
              {bjGender !== '' && <div className={`gender-icon ${bjGender === 'm' ? 'male' : 'female'}`}>성별</div>}
            </div>
            <div className="entry-count">
              <span className="count-txt">{Util.printNumber(entryCnt)}</span>
              <i className="entry-img">방송 참여자</i>
            </div>
            <div className="bottom-wrap">
              <div className="dj-nickname">{bjNickNm}</div>
              <span className="roomTitle">{title}</span>
            </div>
          </div>
        )}
      </div>
    )
  })
}

export default (props) => {
  return (
    <React.Fragment>
      <Room />
      {makeContents(props)}
    </React.Fragment>
  )
}
