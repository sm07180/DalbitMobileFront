import React, {useEffect, useState, useContext} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
//context
import API from 'context/api'
import {Context} from 'context/index.js'
import Room, {RoomJoin} from 'context/room'
import qs from 'query-string'
import Utility, {printNumber, addComma} from 'components/lib/utility'

//static
import FemaleIcon from '../static/female.svg'
import MaleIcon from '../static/male.svg'
import SpecialLong from '../static/special_long.svg'
import PersonIcon from '../static/person.svg'
import heartIcon from '../static/like_g_s.svg'
import TotalIcon from '../static/total.svg'
import AllIcon from '../static/all.svg'
import FanIcon from '../static/fan.svg'
import Restrict20 from '../static/restrict20.svg'
import SpecialIcon from '../static/special.svg'
import SimpleMessageIcon from '../static/message.svg'
export default (props) => {
  const {memberList, clipList, liveList, total, clipType, CategoryType} = props
  // ctx && path

  const context = useContext(Context)
  const history = useHistory()
  //render ----------------------------------------------------
  return (
    <div className="total">
      {(CategoryType === 0 || CategoryType === 1) && (
        <div className="total__member">
          <h4 className="Title">
            DJ <span className="Title__count">{memberList.paging && memberList.paging.total}</span>
          </h4>
          {memberList.list
            ? (CategoryType === 1 ? memberList.list : memberList.list.slice(0, 2)).map((item, idx) => {
                const {nickNm, profImg, isNew, gender, isSpecial, memNo, roomNo, fanCnt} = item
                return (
                  <div key={`${idx}+categoryTab`} className="memberItem">
                    <img src={profImg.thumb190x190} className="memberItem__profImg" />
                    <div className="memberItem__info">
                      <span className="memberItem__info__nick">{nickNm}</span>
                      <div className="memberItem__info__iconBox">
                        {gender === 'f' ? <img src={FemaleIcon} /> : gender === 'm' ? <img src={MaleIcon} /> : ''}
                        {!isSpecial && <img src={SpecialLong} />}
                      </div>
                      <span className="memberItem__info__fanCnt">
                        <img src={PersonIcon} />
                        {fanCnt}
                      </span>
                    </div>
                  </div>
                )
              })
            : '결과가없습니다.'}
        </div>
      )}
      {(CategoryType === 0 || CategoryType === 2) && (
        <div className="total__live">
          <h4 className="Title">
            방송 <span className="Title__count">{liveList.paging && liveList.paging.total}</span>
          </h4>
          <div className="chartListDetail" style={{paddingLeft: 0}}>
            {liveList.list
              ? (CategoryType === 2 ? liveList.list : liveList.list.slice(0, 2)).map((item, idx) => {
                  const {title, bgImg, isSpecial, gender, bjNickNm, roomType, entryCnt, totalCnt, likeCnt} = item
                  return (
                    <li className="chartListDetailItem" key={idx + 'list'}>
                      <div className="chartListDetailItem__thumb">
                        {isSpecial && <span className="newSpecialIcon">스페셜DJ</span>}
                        <img src={bgImg[`thumb190x190`]} alt={title} />
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
              : '결과가없습니다.'}
          </div>
        </div>
      )}
      {(CategoryType === 0 || CategoryType === 3) && (
        <div className="total__clip">
          <h4 className="Title">
            클립 <span className="Title__count">{clipList.paging && clipList.paging.total}</span>
          </h4>
          <div className="chartListDetail" style={{paddingLeft: 0}}>
            {clipList.list
              ? (CategoryType === 3 ? clipList.list : clipList.list.slice(0, 2)).map((item, idx) => {
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
                })
              : '결과가없습니다'}
          </div>
        </div>
      )}
    </div>
  )
}
