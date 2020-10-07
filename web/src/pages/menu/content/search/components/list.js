import React, {useEffect, useState, useContext} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
//context
import {Context} from 'context/index.js'
import Room, {RoomJoin} from 'context/room'
import {clipJoin} from 'pages/common/clipPlayer/clip_func'
import Utility, {printNumber, addComma} from 'components/lib/utility'
import NoResult from 'components/ui/new_noResult'
import API from 'context/api'
//static
import FemaleIcon from '../static/female.svg'
import MaleIcon from '../static/male.svg'
import SpecialLong from '../static/special_long.svg'
import PersonIcon from '../static/person.svg'
import heartIcon from '../static/like_g_s.svg'
import TotalIcon from '../static/total.svg'
import LiveIcon from '../static/live.svg'
import SimpleMessageIcon from '../static/message.svg'
import ClipPlayerIcon from '../static/clip_player.svg'
import ArrowIcon from '../static/arrow.svg'
export default (props) => {
  const {memberList, clipList, liveList, total, clipType, CategoryType} = props
  // ctx && path
  const context = useContext(Context)
  const history = useHistory()
  const Link = (memNo) => {
    if (!context.token.isLogin) {
      history.push(`/login`)
    } else {
      history.push(`/mypage/${memNo}`)
    }
  }
  const Join = (roomNo, memNo) => {
    if (roomNo !== '' && roomNo !== '0') {
      RoomJoin({roomNo: roomNo})
    } else if (roomNo === '0') {
      history.push(`/mypage/${memNo}`)
    }
  }
  // 플레이가공
  const fetchDataPlay = async (clipNum) => {
    const {result, data, message, code} = await API.postClipPlay({
      clipNo: clipNum
    })
    if (result === 'success') {
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
  //render ----------------------------------------------------
  return (
    <div className="total">
      {(CategoryType === 0 || CategoryType === 1) && (
        <div className="total__member" style={{border: CategoryType !== 0 && 'none'}}>
          <h4 className="Title">
            DJ <span className="Title__count">{total && total.memtotal}</span>
            {CategoryType === 0 && memberList && total.memtotal > 2 && (
              <img src={ArrowIcon} onClick={() => props.setCategoryType(1)} />
            )}
          </h4>
          {memberList && memberList.length !== 0 ? (
            (CategoryType === 1 ? memberList : memberList.slice(0, 2)).map((item, idx) => {
              const {nickNm, profImg, isNew, gender, isSpecial, memNo, roomNo, fanCnt} = item
              return (
                <div key={`${idx}+categoryTab`} className="memberItem">
                  {roomNo !== '' && (
                    <button onClick={() => Join(roomNo, memNo)} className="liveBtn">
                      <img src={LiveIcon} />
                      LIVE
                    </button>
                  )}
                  <img src={profImg.thumb190x190} className="memberItem__profImg" onClick={() => Link(memNo)} />
                  <div className="memberItem__info">
                    <span className="memberItem__info__nick">{nickNm}</span>
                    <div className="memberItem__info__iconBox">
                      {gender === 'f' ? <img src={FemaleIcon} /> : gender === 'm' ? <img src={MaleIcon} /> : ''}
                      {isSpecial && <img src={SpecialLong} />}
                    </div>
                    <span className="memberItem__info__fanCnt">
                      <img src={PersonIcon} />
                      {fanCnt}
                    </span>
                  </div>
                </div>
              )
            })
          ) : (
            <NoResult text="DJ 검색결과가 없습니다." height={120} />
          )}
        </div>
      )}
      {(CategoryType === 0 || CategoryType === 2) && (
        <div className="total__live" style={{border: CategoryType !== 0 && 'none'}}>
          <h4 className="Title">
            방송 <span className="Title__count">{total && total.livetotal}</span>
            {CategoryType === 0 && liveList && total.livetotal > 2 && (
              <img src={ArrowIcon} onClick={() => props.setCategoryType(2)} />
            )}
          </h4>
          <div className="chartListDetail" style={{paddingLeft: 0}}>
            {liveList && liveList.length !== 0 ? (
              (CategoryType === 2 ? liveList : liveList.slice(0, 2)).map((item, idx) => {
                const {title, bgImg, isSpecial, gender, bjNickNm, roomType, entryCnt, totalCnt, likeCnt, roomNo, memNo} = item
                return (
                  <li className="chartListDetailItem" key={idx + 'list'}>
                    <div className="chartListDetailItem__thumb">
                      {isSpecial && <span className="newSpecialIcon">스페셜DJ</span>}
                      <img src={bgImg[`thumb190x190`]} alt={title} onClick={() => Join(roomNo, memNo)} />
                    </div>
                    <div className="textBox">
                      <p className="textBox__subject">
                        <span className="subject">
                          {context.roomType.map((item, index) => {
                            if (item.cd === roomType) {
                              return <React.Fragment key={idx + 'typeList'}>{item.cdNm}</React.Fragment>
                            }
                          })}
                        </span>
                        <i className="line"></i>
                        <span className="title">{title}</span>
                      </p>
                      <p className="textBox__nickName">
                        {gender !== '' ? <span className={gender === 'm' ? 'maleIcon' : 'femaleIcon'} /> : <></>}
                        {bjNickNm}
                      </p>
                      <div className="textBox__detail">
                        <span className="textBox__detail--item">
                          <img src={TotalIcon} width={16} />
                          {totalCnt > 999 ? Utility.printNumber(totalCnt) : Utility.addComma(totalCnt)}
                        </span>
                        <span className="textBox__detail--item">
                          <img src={PersonIcon} width={16} />
                          {entryCnt > 999 ? Utility.printNumber(entryCnt) : Utility.addComma(entryCnt)}
                        </span>
                        <span className="textBox__detail--item">
                          <img src={heartIcon} width={16} />
                          {likeCnt > 999 ? Utility.printNumber(likeCnt) : Utility.addComma(likeCnt)}
                        </span>
                      </div>
                    </div>
                  </li>
                )
              })
            ) : (
              <NoResult text="라이브 검색결과가 없습니다." height={120} />
            )}
          </div>
        </div>
      )}
      {(CategoryType === 0 || CategoryType === 3) && (
        <div className="total__clip" style={{border: 'none'}}>
          <h4 className="Title">
            클립 <span className="Title__count">{total && total.cliptotal}</span>
            {CategoryType === 0 && clipList && total.cliptotal > 2 && (
              <img src={ArrowIcon} onClick={() => props.setCategoryType(3)} />
            )}
          </h4>
          <div className="chartListDetail" style={{paddingLeft: 0}}>
            {clipList && clipList.length !== 0 ? (
              (CategoryType === 3 ? clipList : clipList.slice(0, 2)).map((item, idx) => {
                const {bgImg, clipNo, filePlayTime, gender, goodCnt, isSpecial, nickName, replyCnt, subjectType, title} = item
                return (
                  <li className="chartListDetailItem" key={idx + 'list'}>
                    <img onClick={() => fetchDataPlay(clipNo)} className="clipBtnPlay" src={ClipPlayerIcon} />
                    <div className="chartListDetailItem__thumb">
                      {isSpecial && <span className="newSpecialIcon">스페셜DJ</span>}
                      <img src={bgImg[`thumb190x190`]} alt={title} onClick={() => fetchDataPlay(clipNo)} />
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
              })
            ) : (
              <NoResult text="클립 검색결과가 없습니다." height={120} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
