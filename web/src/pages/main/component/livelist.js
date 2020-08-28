import React, {useEffect, useRef, useState, useContext} from 'react'
import styled from 'styled-components'

//context
import Room, {RoomJoin} from 'context/room'
import Api from 'context/api'
import {Context} from 'context'
import noBgAudioIcon from '../static/audio_s.svg'
import maleIcon from '../static/ico_male.svg'
import femaleIcon from '../static/ico_female.svg'
import hitIcon from '../static/ico_hit_g.svg'
import likeIcon from '../static/ico_like_g_s.svg'
import boostIcon from '../static/ico_like_g.svg'
import starIcon from '../static/ico_hit_g_s.svg'
import Util from 'components/lib/utility.js'

// static
import EntryImg from '../static/person_w_s.svg'

const makeContents = (props) => {
  const context = useContext(Context)
  const {list, liveListType, categoryList} = props
  const evenList = list.filter((v, idx) => idx % 2 === 0)

  //------------------------------------------

  if (liveListType === 'detail') {
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
        giftCnt,
        isSpecial,
        boostCnt,
        rank,
        os,
        isNew,
        isWowza
      } = list

      const alertCheck = (roomNo) => {
        if (context.adminChecker === true) {
          context.action.confirm_admin({
            //콜백처리
            callback: () => {
              RoomJoin({
                roomNo: roomNo,
                shadow: 1,
                isWowza: isWowza
              })
            },
            //캔슬콜백처리
            cancelCallback: () => {
              RoomJoin({
                roomNo: roomNo,
                shadow: 0,
                isWowza: isWowza
              })
            },
            msg: '관리자로 입장하시겠습니까?'
          })
        } else {
          RoomJoin({
            roomNo: roomNo,
            isWowza: isWowza
          })
        }
      }

      return (
        <div className="liveList__item" key={`live-${idx}`} onClick={() => alertCheck(roomNo)}>
          <div className="broadcast-img" style={{backgroundImage: `url(${bjProfImg['thumb190x190']})`}} />
          <div className="broadcast-content">
            <div className="icon-wrap">
              {os === 3 && <span className="pc-icon">PC</span>}
              {categoryList && (
                <div className="type-text">
                  {(() => {
                    const target = categoryList.find((category) => category['cd'] === roomType)
                    if (target && target['cdNm']) {
                      return target['cdNm']
                    }
                  })()}
                </div>
              )}

              {bjGender !== 'n' && <img className="gender-icon" src={bjGender === 'm' ? maleIcon : femaleIcon} />}
              {isSpecial === true && <em className="specialIcon">스페셜DJ</em>}
              {isNew === true && <span className="new-dj-icon">신입</span>}
            </div>
            <div className="title">{title}</div>
            <div className="nickname">{bjNickNm}</div>
            <div className="detail">
              <div className="value">
                <img src={hitIcon} />
                <span>{Util.printNumber(entryCnt)}</span>
              </div>

              {boostCnt > 0 ? (
                <div className="value">
                  <img src={boostIcon} />
                  <span className="txt_boost">{Util.printNumber(likeCnt)}</span>
                </div>
              ) : (
                <div className="value">
                  <img src={likeIcon} />
                  <span>{Util.printNumber(likeCnt)}</span>
                </div>
              )}
              {rank < 11 && (
                <div className="value">
                  <img src={starIcon} />
                  <span>{Util.printNumber(giftCnt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    })
  } else {
    return (
      <>
        {evenList.map((first, idx) => {
          const windowHalfWidth = (window.innerWidth - 32) / 2
          const firstList = first
          const lastList = list[idx * 2 + 1]

          return (
            <div className="liveList__row" style={{height: `${windowHalfWidth}px`}} key={`half-${idx}`}>
              <div
                className="half-live"
                style={{backgroundImage: `url(${firstList.bjProfImg['thumb190x190']})`}}
                onClick={() => alertCheck(firstList.roomNo)}>
                <div className="top-status">
                  {firstList.entryType === 2 ? (
                    <span className="twenty-icon">20</span>
                  ) : firstList.entryType === 1 ? (
                    <span className="fan-icon">FAN</span>
                  ) : (
                    <span className="all-icon">ALL</span>
                  )}
                  {firstList.isSpecial && <span className="special-icon">S</span>}
                </div>
                <div className="entry-count">
                  <img className="entry-img" src={EntryImg} />
                  <span className="count-txt">{Util.printNumber(firstList.entryCnt)}</span>
                </div>
                <div className="bottom-wrap">
                  {first.os === 3 ? <span className="pc-icon">PC</span> : ''}
                  <div className="type-icon-wrap">
                    <img className="type-icon" src={noBgAudioIcon} />
                  </div>
                  <div className="dj-nickname">{firstList.bjNickNm}</div>
                </div>
              </div>
              {lastList && (
                <div
                  className="half-live"
                  style={{backgroundImage: `url(${lastList.bjProfImg['thumb190x190']})`}}
                  onClick={() => alertCheck(lastList.roomNo)}>
                  <div className="top-status">
                    {lastList.entryType === 2 ? (
                      <span className="twenty-icon">20</span>
                    ) : lastList.entryType === 1 ? (
                      <span className="fan-icon">FAN</span>
                    ) : (
                      <span className="all-icon">ALL</span>
                    )}
                    {lastList.isSpecial && <span className="special-icon">S</span>}
                  </div>
                  <div className="entry-count">
                    <img className="entry-img" src={EntryImg} />
                    <span className="count-txt">{Util.printNumber(lastList.entryCnt)}</span>
                  </div>
                  <div className="bottom-wrap">
                    {lastList.os === 3 ? <span className="pc-icon">PC</span> : ''}
                    <div className="type-icon-wrap">
                      <img className="type-icon" src={noBgAudioIcon} />
                    </div>
                    <div className="dj-nickname">{lastList.bjNickNm}</div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </>
    )
  }
}

export default (props) => {
  return (
    <React.Fragment>
      <Room />
      {makeContents(props)}
    </React.Fragment>
  )
}

const HalfWrap = styled.div``
