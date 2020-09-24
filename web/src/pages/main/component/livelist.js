import React, {useEffect, useRef, useState, useContext} from 'react'
import styled from 'styled-components'

//context
import Room, {RoomJoin} from 'context/room'
import Api from 'context/api'
import {Context} from 'context'
import noBgAudioIcon from '../static/audio_s.svg'
import maleIcon from '../static/ico_male.svg'
import femaleIcon from '../static/ico_female.svg'
import maleIconW from '../static/gender_m_w.svg'
import femaleIconW from '../static/gender_w_w.svg'
import hitIcon from '../static/ico_hit_g.svg'
import likeIcon from '../static/ico_like_g_s.svg'
import boostIcon from '../static/ico_like_g.svg'
import starIcon from '../static/ico_hit_g_s.svg'
import Util from 'components/lib/utility.js'

// static
import PeopleIcon from '../static/people_g_s.svg'
import EntryImg from '../static/new_person_w_s.svg'
import EntryImgW from '../static/person_w.svg'
const makeContents = (props) => {
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
      isNew,
      totalCnt
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
        onClick={() => alertCheck(roomNo)}>
        <div className="broadcast-img" style={{backgroundImage: `url(${bjProfImg['thumb190x190']})`}} />
        {os === 3 && <i className="iconPc">PC</i>}
        {isSpecial === true && <em className="newSpecialIcon">스페셜dj</em>}

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
              {bjGender !== 'n' && <img className="gender-icon" src={bjGender === 'm' ? maleIcon : femaleIcon} />}
              {isNew === true && <span className="new-dj-icon">신입DJ</span>}
              {bjNickNm}
            </div>
            <div className="detail">
              <div className="value">
                <img src={PeopleIcon} />
                <span>{Util.printNumber(totalCnt)}</span>
              </div>

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
              {/* {entryType === 2 ? (
                <span className="twenty-icon">20</span>
              ) : entryType === 1 ? (
                <span className="fan-icon">FAN</span>
              ) : (
                <span className="all-icon">ALL</span>
              )} */}
              {!isSpecial && <span className="special-icon">S</span>}
              {bjGender !== 'n' && <img className="gender-icon" src={bjGender === 'm' ? maleIconW : femaleIconW} />}
            </div>
            <div className="entry-count">
              <span className="count-txt">{Util.printNumber(entryCnt)}</span>
              <img className="entry-img" src={EntryImgW} />
            </div>
            <div className="bottom-wrap">
              {/* {os === 3 ? <span className="pc-icon">PC</span> : ''} */}
              {/* <div className="type-icon-wrap">
                <img className="type-icon" src={noBgAudioIcon} />
              </div> */}
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
