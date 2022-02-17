import React, {useEffect, useState, useContext, useCallback} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
//context
import {Context} from 'context/index.js'
import Room, {RoomJoin} from 'context/room'
import {clipJoin} from 'pages/common/clipPlayer/clip_func'
import Utility, {printNumber, addComma} from 'components/lib/utility'
import NoResult from 'components/ui/new_noResult'
import API from 'context/api'
import {OS_TYPE} from 'context/config.js'
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
  //props
  const {memberList, clipList, liveList, total, clipType, CategoryType, filterType, searchText} = props
  // ctx && path
  const context = useContext(Context)
  const customHeader = JSON.parse(API.customHeader)
  const history = useHistory()
  // link & join & clip play
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

  const getPageFormIdx = useCallback((idx) => {
    if (idx < 100) return 1
    idx = String(idx)
    return Number(idx.substring(0, idx.length - 2)) + 1
  }, [])

  const fetchDataPlay = async (clipNum, idx) => {
    console.log(idx)
    const {result, data, message, code} = await API.postClipPlay({
      clipNo: clipNum
    })
    if (result === 'success') {
      const nowPage = getPageFormIdx(idx)
      const playListInfoData = {
        slctType: 0,
        dateType: 0,
        page: nowPage,
        records: 100,
        search: searchText
      }
      localStorage.setItem('clipPlayListInfo', JSON.stringify(playListInfoData))
      clipJoin(data)
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
        <>
          {filterType !== 0 && CategoryType !== 0 && memberList.length !== 0 && (
            <h4 className="Title topPositon">
              DJ <span className="Title__count">{total && total.memtotal}</span>
              {CategoryType === 0 && memberList && total.memtotal > 2 && (
                <img src={ArrowIcon} onClick={() => props.setCategoryType(1)} />
              )}
            </h4>
          )}
          <div className={`total__member ${CategoryType !== 0 ? 'borderNone' : ''}`}>
            {filterType === 0 && (
              <h4 className="Title" onClick={() => props.setCategoryType(1)}>
                DJ <span className="Title__count">{total && total.memtotal}</span>
                {CategoryType === 0 && memberList && <img src={ArrowIcon} />}
              </h4>
            )}
            {memberList && memberList.length !== 0 ? (
              (CategoryType === 1 ? memberList : memberList.slice(0, 2)).map((item, idx) => {
                const {nickNm, profImg, isNew, gender, badgeSpecial, isConDj, memNo, roomNo, fanCnt} = item
                return (
                  <div key={`${idx}+categoryTab`} className="memberItem" onClick={() => Link(memNo)}>
                    {roomNo !== '' && (
                      <button
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
                              context.action.updatePopup('APPDOWN', 'appDownAlrt', 1)
                            }
                          } else {
                            Join(roomNo, memNo)
                          }
                        }}
                        className="liveBtn">
                        <img src={LiveIcon} />
                        LIVE
                      </button>
                    )}
                    <img src={profImg.thumb190x190} className="memberItem__profImg" />
                    <div className="memberItem__info">
                      <span className="memberItem__info__nick">{nickNm}</span>
                      <div className="memberItem__info__iconBox">
                        {gender !== '' && <em className={`icon_wrap ${gender === 'm' ? 'icon_male' : 'icon_female'}`}>성별</em>}
                        {badgeSpecial > 0 && badgeSpecial === 2 && <em className="icon_wrap icon_bestdj">베스트DJ</em>}
                        {isConDj && <em className="icon_wrap icon_contentsdj">콘텐츠DJ</em>}
                        {badgeSpecial > 0 && badgeSpecial === 1 && <em className="icon_wrap icon_specialdj">스페셜DJ</em>}
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
        </>
      )}
      {(CategoryType === 0 || CategoryType === 2) && (
        <>
          {filterType !== 0 && CategoryType !== 0 && liveList.length !== 0 && (
            <h4 className="Title topPositon">
              방송 <span className="Title__count">{total && total.livetotal}</span>
              {CategoryType === 0 && liveList && total.livetotal > 2 && (
                <img src={ArrowIcon} onClick={() => props.setCategoryType(2)} />
              )}
            </h4>
          )}
          <div className={`total__live ${CategoryType !== 0 ? 'borderNone' : ''}`}>
            {filterType === 0 && (
              <h4 className="Title" onClick={() => props.setCategoryType(2)}>
                방송 <span className="Title__count">{total && total.livetotal}</span>
                {CategoryType === 0 && liveList && <img src={ArrowIcon} />}
              </h4>
            )}
            <div className="chartListDetail pdl0">
              {liveList && liveList.length !== 0 ? (
                (CategoryType === 2 ? liveList : liveList.slice(0, 2)).map((item, idx) => {
                  const {
                    title,
                    bgImg,
                    bjProfImg,
                    badgeSpecial,
                    bjGender,
                    bjNickNm,
                    roomType,
                    entryCnt,
                    isConDj,
                    totalCnt,
                    likeCnt,
                    roomNo,
                    memNo,
                    os,
                    gstProfImg,
                    mediaType
                  } = item
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
                          Join(roomNo, memNo)
                        }
                      }}>
                      <div className="chartListDetailItem__thumb">
                        {badgeSpecial > 0 && badgeSpecial === 2 ? (
                          <em className="icon_wrap icon_bestdj_half">베스트DJ</em>
                        ) : isConDj === true ? (
                          <em className="icon_wrap icon_contentsdj_half">콘텐츠DJ</em>
                        ) : badgeSpecial === 1 ? (
                          <em className="icon_wrap icon_specialdj_half">스페셜DJ</em>
                        ) : (
                          <></>
                        )}
                        <img src={bjProfImg[`thumb190x190`]} className="thumb-dj" alt={title} />
                        {gstProfImg.thumb120x120 && (
                          <span className="thumb-guest">
                            <img src={gstProfImg.thumb120x120} alt="게스트" />
                          </span>
                        )}
                      </div>
                      <div className="textBox">
                        <p className="textBox__subject">
                          {/* <span className="subject">
                            {context.roomType.map((item, index) => {
                              if (item.cd === roomType) {
                                return <React.Fragment key={idx + 'typeList'}>{item.cdNm}</React.Fragment>
                              }
                            })}
                          </span>
                          <i className="line"></i> */}
                          {mediaType === 'a' ? (
                            <em className="icon_wrap icon_roomtype">오디오</em>
                          ) : (
                            <em className="icon_wrap icon_roomtype icon_roomtype_video">영상</em>
                          )}
                          <span className="title">{title}</span>
                        </p>
                        <p className="textBox__nickName">
                          {bjGender !== '' && (
                            <em className={`icon_wrap ${bjGender === 'm' ? 'icon_male' : 'icon_female'}`}>성별</em>
                          )}
                          {os === 3 && <em className="icon_wrap icon_pc">PC</em>}
                          <span className="nickname">{bjNickNm}</span>
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
        </>
      )}
      {(CategoryType === 0 || CategoryType === 3) && (
        <>
          {filterType !== 0 && CategoryType !== 0 && clipList.length !== 0 && (
            <h4 className="Title topPositon">
              클립 <span className="Title__count">{total && total.cliptotal}</span>
              {CategoryType === 0 && clipList && <img src={ArrowIcon} onClick={() => props.setCategoryType(3)} />}
            </h4>
          )}
          <div className="total__clip borderNone">
            {filterType === 0 && (
              <h4 className="Title" onClick={() => props.setCategoryType(3)}>
                클립 <span className="Title__count">{total && total.cliptotal}</span>
                {CategoryType === 0 && clipList && total.cliptotal !== '' && <img src={ArrowIcon} />}
              </h4>
            )}
            <div className="chartListDetail pdl0">
              {clipList && clipList.length !== 0 ? (
                (CategoryType === 3 ? clipList : clipList.slice(0, 2)).map((item, idx) => {
                  const {bgImg, clipNo, filePlayTime, gender, goodCnt, badgeSpecial, nickName, replyCnt, subjectType, title} =
                    item
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
                          fetchDataPlay(clipNo, idx)
                        }
                      }}>
                      <img className="clipBtnPlay" src={ClipPlayerIcon} />
                      <div className="chartListDetailItem__thumb">
                        {badgeSpecial > 0 && badgeSpecial === 2 ? (
                          <em className="icon_wrap icon_bestdj_half">베스트DJ</em>
                        ) : badgeSpecial === 3 ? (
                          <em className="icon_wrap icon_contentsdj_half">콘텐츠DJ</em>
                        ) : badgeSpecial === 1 ? (
                          <em className="icon_wrap icon_specialdj_half">스페셜DJ</em>
                        ) : (
                          <></>
                        )}
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
                              fetchDataPlay(clipNo, idx)
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
                          {gender !== '' && <em className={`icon_wrap ${gender === 'm' ? 'icon_male' : 'icon_female'}`}>성별</em>}
                          <span className="nickname">{nickName}</span>
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
        </>
      )}
    </div>
  )
}
