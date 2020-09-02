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
// component
import NoResult from 'components/ui/noResult'

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
    if (memNo !== ctx.profile.memNo) {
      history.push(`/mypage/${memNo}`)
    } else if (memNo === ctx.profile.memNo) {
      history.push(`/menu/profile`)
    }
  }
  //makeContents
  const makeContents = () => {
    if (props.fetch === null || props.fetch === undefined) return
    const list = props.fetch
    const type = props.type

    if (list == false || list == undefined) {
      return <NoResult className={`search`} />
    } else if (type === 'member') {
      return list.map((list, idx) => {
        const {nickNm, profImg, roomNo, memNo, isSpecial, gender, fanCnt} = list
        return (
          <div key={idx} className="list">
            <div
              className="btnWrap"
              onClick={() => {
                props.update({select: {...list, type: props.type}})
              }}>
              <img src={profImg.thumb150x150} onClick={() => linkMypage(memNo)} />
              <div className="infoBox">
                {roomNo !== '' && <em></em>}
                <span className="infoBox__nick">{nickNm}</span>
                <div className="detail">
                  {gender === 'f' && <span className="female" />}
                  {gender === 'm' && <span className="male"></span>}
                  {isSpecial === true && <span className="special"></span>}
                </div>
                <p className="fanCnt">{fanCnt}</p>
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
          isSpecial,
          roomType,
          entryType,
          byeolCnt,
          entryCnt,
          isNew,
          isPop,
          isRecomm,
          likeCnt,
          title
        } = list
        return (
          <div key={idx} className="listLive">
            <div
              className="btnWrap"
              onClick={() => {
                props.update({select: {...list, type: props.type}})
              }}>
              <img
                src={bgImg.thumb88x88}
                onClick={() => {
                  if (ctx.adminChecker === true) {
                    ctx.action.confirm_admin({
                      //콜백처리
                      callback: () => {
                        RoomJoin({
                          roomNo: roomNo,
                          shadow: 1
                        })
                      },
                      //캔슬콜백처리
                      cancelCallback: () => {
                        RoomJoin({
                          roomNo: roomNo,
                          shadow: 0
                        })
                      },
                      msg: '관리자로 입장하시겠습니까?'
                    })
                  } else {
                    RoomJoin({
                      roomNo: roomNo
                    })
                  }
                }}
              />
              <div className="infoBox">
                {/* {roomNo !== '' && <em></em>} */}
                <div className="detail">
                  {entryType === 0 && <span className="entry" />}
                  {entryType === 1 && <span className="entry-fan" />}
                  {entryType === 2 && <span className="entry-limit" />}
                  {roomType === '00' && <span className="cate">일상/소통</span>}
                  {roomType === '01' && <span className="cate">힐링</span>}
                  {roomType === '02' && <span className="cate">노래/연주</span>}
                  {roomType === '03' && <span className="cate">수다/챗</span>}
                  {roomType === '04' && <span className="cate">미팅/소개팅</span>}
                  {roomType === '05' && <span className="cate">고민/사연</span>}
                  {roomType === '06' && <span className="cate">책/여행</span>}
                  {roomType === '07' && <span className="cate">먹방/요리</span>}
                  {roomType === '08' && <span className="cate">건강/스포츠</span>}
                  {roomType === '09' && <span className="cate">ASMR</span>}
                  {roomType === '10' && <span className="cate"> 판매/영업</span>}
                  {bjGender === 'f' && <span className="female" />}
                  {bjGender === 'm' && <span className="male"></span>}
                  {isSpecial === true && <span className="special"></span>}
                </div>
                <span className="infoBox__roomTitle">{title}</span>
                <span className="infoBox__nick">{bjNickNm}</span>
                <div className="roomCnt">
                  <p className="fanCnt">{entryCnt}</p>
                  <p className="likeCnt">{likeCnt}</p>
                  <p className="starCnt">{byeolCnt}</p>
                </div>
              </div>
            </div>
          </div>
        )
      })
    }
  }
  return <div className="searchList">{makeContents()}</div>
}
