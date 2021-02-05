import React, {useEffect, useRef, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import styled from 'styled-components'

//context
import Room, {RoomJoin} from 'context/room'
import Api from 'context/api'
import {Context} from 'context'
import {OS_TYPE} from 'context/config.js'

import Util from 'components/lib/utility.js'

import BadgeList from 'common/badge_list'

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
      isShining,
      isAdmin,
      boostCnt,
      rank,
      os,
      liveBadgeList,
      isNew,
      totalCnt,
      gstProfImg,
      isGoodMem,
      goodMem
    } = list

    const alertCheck = (roomNo) => {
      RoomJoin({
        roomNo: roomNo,
        nickNm: bjNickNm
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
          {gstProfImg.thumb62x62 && (
            <span className="thumb-guest">
              <img src={gstProfImg.thumb62x62} alt="게스트" />
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
            <div className="nickname">
              {bjGender !== '' && <em className={`icon_wrap ${bjGender === 'm' ? 'icon_male' : 'icon_female'}`}>성별</em>}
              {os === 3 && <em className="icon_wrap icon_pc">PC</em>}

              {isSpecial === true && isShining === false ? (
                <em className="icon_wrap icon_specialdj_half">스페셜DJ</em>
              ) : isSpecial === false && isShining === true ? (
                <em className="icon_wrap icon_shinigdj_half">샤이닝DJ</em>
              ) : isSpecial === true && isShining === true ? (
                <em className="icon_wrap icon_specialdj_half">스페셜DJ</em>
              ) : (
                <></>
              )}
              {isNew === true && <em className="icon_wrap icon_newdj">신입DJ</em>}
              {liveBadgeList && liveBadgeList.length !== 0 && <BadgeList list={liveBadgeList} />}

              <span className="nick">{bjNickNm}</span>
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
              {goodMem && goodMem.length > 0 && (
                <div className="value isGoodMember">
                  {goodMem.map((idx) => {
                    return (
                      <i className={`value--goodMem${idx}`} key={idx}>
                        사랑꾼{idx}
                      </i>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="broadcast-content">
            <div className="top-status">
              {isSpecial === true && isShining === false ? (
                <em className="icon_wrap icon_specialdj_circle">스페셜DJ</em>
              ) : isSpecial === false && isShining === true ? (
                <em className="icon_wrap icon_shinigdj_circle">샤이닝DJ</em>
              ) : isSpecial === true && isShining === true ? (
                <em className="icon_wrap icon_specialdj_circle">스페셜DJ</em>
              ) : (
                <></>
              )}
              {bjGender !== '' && <em className={`icon_wrap ${bjGender === 'm' ? 'icon_male' : 'icon_female'}`}>성별</em>}
              {/* {os === 3 && <em className="icon_wrap icon_pc_circle">PC</em>} */}
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
