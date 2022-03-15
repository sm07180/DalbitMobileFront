import React, {useEffect, useRef, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import styled from 'styled-components'

//context
import Room, {RoomJoin} from 'context/room'
import Api from 'context/api'
import {OS_TYPE} from 'context/config.js'

import Util from 'components/lib/utility.js'

import BadgeList from 'common/badge_list'
import {RoomValidateFromClip} from "common/audio/clip_func";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const makeContents = (props) => {
  let history = useHistory()
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const customHeader = JSON.parse(Api.customHeader)
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
      badgeSpecial,
      isAdmin,
      isConDj,
      boostCnt,
      rank,
      os,
      liveBadgeList,
      isNew,
      totalCnt,
      gstProfImg,
      isGoodMem,
      goodMem,
      mediaType,
      newFanCnt
    } = list

    const alertCheck = (roomNo) => {
      RoomJoin({
        roomNo: roomNo,
        nickNm: bjNickNm
      })
    }

    return (
      <div
        className={`${liveListType === 'v' ? 'liveList__flex' : 'liveList__item'}`}
        key={`live-${idx}`}
        onClick={() => {
          if (customHeader['os'] === OS_TYPE['Desktop']) {
            if (globalState.token.isLogin === false) {
              dispatch(setGlobalCtxMessage({
                type: "alert", msg: '해당 서비스를 위해<br/>로그인을 해주세요.'
                , visible: true
                , callback: () => {
                  history.push('/login')
                }
              }));
            } else {
              RoomValidateFromClip(
                  roomNo,
                  dispatch,
                  globalState,
                  history,
                  bjNickNm
              )
              //alertCheck(roomNo)
              //globalCtx.action.updatePopup('APPDOWN', 'appDownAlrt', 2)
            }
          } else {
            alertCheck(roomNo)
          }
        }}>
        <div className="broadcast-img" style={{backgroundImage: `url(${bjProfImg['thumb190x190']})`}}>
          {gstProfImg.thumb62x62 && (
            <span className="thumb-guest">
              <img src={gstProfImg.thumb62x62} alt="게스트" />
            </span>
          )}
          {badgeSpecial > 0 && badgeSpecial === 2 ? (
            <em className="icon_wrap icon_bestdj_half">베스트DJ</em>
          ) : isConDj === true ? (
            <em className="icon_wrap icon_contentsdj_half">콘텐츠DJ</em>
          ) : badgeSpecial === 1 ? (
            <em className="icon_wrap icon_specialdj_half">스페셜DJ</em>
          ) : (
            <></>
          )}
        </div>

        {liveListType !== 'v' ? (
          <div className="broadcast-content">
            <div className="title">
              {/* <p className="category">
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
              <i className="line"></i> */}
              {mediaType === 'a' ? (
                <em className="icon_wrap icon_roomtype">오디오</em>
              ) : (
                <em className="icon_wrap icon_roomtype icon_roomtype_video">영상</em>
              )}
              <span>{title}</span>
            </div>
            <div className="nickname">
              {bjGender !== '' && <em className={`icon_wrap ${bjGender === 'm' ? 'icon_male' : 'icon_female'}`}>성별</em>}
              {os === 3 && <em className="icon_wrap icon_pc">PC</em>}
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

              <div className="value">
                <i className="value--newFan"></i>
                <span>{Util.printNumber(newFanCnt)}</span>
              </div>

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
          <>
            <div className="top-status">
              {badgeSpecial > 0 && badgeSpecial === 2 ? (
                <em className="icon_wrap icon_bestdj">베스트DJ</em>
              ) : badgeSpecial === 3 ? (
                <em className="icon_wrap icon_contentsdj">콘텐츠DJ</em>
              ) : badgeSpecial === 1 ? (
                <em className="icon_wrap icon_specialdj">스페셜DJ</em>
              ) : (
                <></>
              )}
              {bjGender !== '' && (
                <em className={`icon_wrap ${bjGender === 'm' ? 'icon_male_circle' : 'icon_female_circle'}`}>성별</em>
              )}
              {os === 3 && <em className="icon_wrap icon_pc_circle">PC</em>}
            </div>
            <div className="entry-count">
              <span className="count-txt">{Util.printNumber(entryCnt)}</span>
              <i className="entry-img">방송 참여자</i>
            </div>
            <div className="bottom-wrap">
              <div className="dj-nickname">{bjNickNm}</div>
              <span className="roomTitle">{title}</span>
            </div>
          </>
        )}
      </div>
    )
  })
}

function RealTimeLive(props) {
  useEffect(() => {
    const prevRoomInfo = JSON.parse(localStorage.getItem('prevRoomInfo'))
    if (prevRoomInfo) {
      RoomJoin({
        roomNo: prevRoomInfo.roomNo,
        nickNm: prevRoomInfo.bjNickNm
      })
    }
  }, [])
  return (
    <React.Fragment>
      <Room />
      {makeContents(props)}
    </React.Fragment>
  )
}
export default RealTimeLive
