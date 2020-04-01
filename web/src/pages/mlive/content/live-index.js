/**
 * @file /mlive/index.js
 * @brief 라이브방송
 */
import React, {useContext, useState, useEffect} from 'react'
import styled from 'styled-components'
import _ from 'lodash'
//context
import {Hybrid} from 'context/hybrid'
import Api from 'context/api'
import {Context} from 'context'
import {Store} from './index'
import NoResult from 'components/ui/noResult'
//components
import List from './live-list'
//
const LiveIndex = () => {
  //context
  const context = useContext(Context)
  //interface
  LiveIndex.context = context
  //-----------------------------------------------------------
  // 방송방 리스트 조회
  const getBroadList = async mode => {
    const obj = {
      params: {records: 10, roomType: Store().roomType, page: Store().currentPage, searchType: Store().searchType}
    }
    const res = await Api.broad_list(obj)
    if (res.result === 'success') {
      //APPEND
      if (mode !== undefined && mode.type === 'append' && _.hasIn(Store().broadList, 'list')) {
        const result = {paging: {...res.data.paging}, list: [...Store().broadList.list, ...res.data.list]}
        Store().action.updateBroadList(result)
      } else {
        Store().action.updateBroadList(res.data)
      }
    } else {
      context.action.alert({
        title: res.messageKey,
        msg: res.message
      })
    }
  }
  //update
  function update(mode) {
    switch (true) {
      case mode.selectList !== undefined: //-------------아이템선택
        const {roomNo} = mode.selectList
        RoomJoin(roomNo + '')
        break
      default:
        break
    }
  }
  //makeContents
  const makeContents = () => {
    if (Store().broadList === null) return
    let result
    const {list, paging} = Store().broadList
    if (list.length === 0) {
      return <NoResult />
    } else {
      result = list.map((list, idx) => {
        return <List key={idx} data={list} update={update} />
      })
    }
    return [result]
  }
  //---------------------------------------------------------------------
  useEffect(() => {
    //현재페이지가 1이면 append하지않음
    if (Store().currentPage === 1) return
    getBroadList({type: 'append'})
  }, [Store().currentPage])
  //
  useEffect(() => {
    getBroadList()
  }, [Store().searchType, Store().roomType, Store().reload])
  //---------------------------------------------------------------------
  return <Content>{makeContents()}</Content>
}
export default LiveIndex
//---------------------------------------------------------------------
/**
 * @title 방송방입장
 * @param {roomNo} string
 */
export const RoomJoin = async roomNo => {
  const res = await Api.broad_join({data: {roomNo: roomNo}})
  if (res.result === 'fail') {
    switch (res.code) {
      case '-4': //----------------------------이미 참가 되어있습니다
        LiveIndex.context.action.confirm({
          callback: () => {
            //강제방송종료
            async function exit() {
              //입장되어있으면 퇴장처리 이후,success 일때 다시RoomJoin
              const result = await RoomExit(roomNo + '')
              if (result) RoomJoin(roomNo + '')
            }
            exit()
          },
          title: res.messageKey,
          msg: res.message
        })
        break
      default:
        //----------------------------
        LiveIndex.context.action.alert({
          title: res.messageKey,
          msg: res.message
        })
        break
    }
    //--
  } else if (res.result === 'success') {
    //성공일때
    const {data} = res
    console.log(
      '%c' + `Native: RoomJoin`,
      'display:block;width:100%;padding:5px 10px;font-weight:bolder;font-size:14px;color:#000;background:orange;'
    )
    //하이브리드앱실행
    Hybrid('RoomJoin', data)
  }
}
/**
 * @title 방송방종료
 * @param {roomNo} string
 */
export const RoomExit = async roomNo => {
  const res = await Api.broad_exit({data: {roomNo: roomNo}})
  if (res.result === 'fail') {
    LiveIndex.context.action.alert({
      title: res.messageKey,
      msg: res.message
    })
    return false
  } else if (res.result === 'success') {
    return true
  }
}
//---------------------------------------------------------------------
const Content = styled.div``
