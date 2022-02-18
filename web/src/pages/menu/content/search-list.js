/**
 * @title 최근 본 달디
 */
import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import styled from 'styled-components'
//context
import API from 'context/api'
import Room, {RoomJoin} from 'context/room'
import {Context} from 'context'
import Util from 'components/lib/utility.js'

// component
import NoResult from 'components/ui/noResult'
import maleIcon from '../static/ico_male.svg'
import femaleIcon from '../static/ico_female.svg'
import hitIcon from '../static/ico_hit_g.svg'
import likeIcon from '../static/ico_like_g_s.svg'
import boostIcon from '../static/ico_like_g.svg'
import starIcon from '../static/ico_hit_g_s.svg'
import PeopleIcon from '../static/people_g_s.svg'
import EntryImg from '../static/new_person_w_s.svg'
export default (props) => {
  let history = useHistory()
  const ctx = useContext(Context)
  //update
  function update(mode) {
    switch (true) {
      case mode.search !== undefined: //-------------------------------검색어
        const {query} = mode.search
        fetchData(query)
        break
      default:
        break
    }
  }
  const linkMypage = (memNo) => {
    if (ctx.token.isLogin === true) {
      history.push(`/profile/${memNo}`)
    } else {
      history.push('/login')
    }
  }
  //makeContents
  const makeContents = () => {
    if (props.fetch === null || props.fetch === undefined) return
    const list = props.fetch
    const type = props.type
    const categoryList = props.categoryList

    if (list == false || list == undefined) {
      return <NoResult className={`search`} />
    } else if (type === 'member') {
      return list.map((list, idx) => {
        const {nickNm, profImg, roomNo, memNo, isNew, badgeSpecial, gender, fanCnt} = list
        return (
          <div key={idx} className="liveList__item" onClick={() => linkMypage(memNo)}>
            {/* 해당 페이지는 main list clasdsName을 동일하게 사용하고 있습니다. */}
            <div className="broadcast-img" style={{backgroundImage: `url(${profImg && profImg['thumb190x190']})`}} />

            {badgeSpecial > 0 && <em className="newSpecialIcon">스페셜dj</em>}

            <div className="broadcast-content">
              <div className="title">
                {gender !== '' && <div className={`gender-icon ${gender === 'm' ? 'male' : 'female'}`}>성별</div>}
              </div>

              <div className="nickname">
                {isNew === true && <span className="new-dj-icon">신입DJ</span>}
                {nickNm}
              </div>

              <div className="detail">
                <div className="value">
                  <i className="value--people"></i>
                  <span>{Util.printNumber(fanCnt)}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })
    } else if (type === 'live') {
      return list.map((list, idx) => {
        const {
          bjNickNm,
          bgImg,
          roomNo,
          bjGender,
          badgeSpecial,
          roomType,
          isNew,
          os,
          bjProfImg,
          likeCnt,
          totalCnt,
          entryCnt,
          boostCnt,
          title,
          liveBadgeList
        } = list
        return (
          <div
            key={idx}
            className="liveList__item"
            onClick={() => {
              props.update({select: {...list, type: props.type}})
            }}>
            {/* 해당 페이지는 main list clasdsName을 동일하게 사용하고 있습니다. */}
            <div className="broadcast-img" style={{backgroundImage: `url(${bjProfImg && bjProfImg['thumb190x190']})`}} />
            {os === 3 && <i className="iconPc">PC</i>}
            {badgeSpecial > 0 && <em className="newSpecialIcon">스페셜dj</em>}
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
                {bjGender !== '' && <i className={`gender-icon ${bjGender === 'm' ? 'male' : 'female'}`}>성별</i>}
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

                {bjNickNm}
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
              </div>
            </div>
          </div>
        )
      })
    }
  }
  return <div className="searchList">{makeContents()}</div>
}
