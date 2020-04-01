/**
 * @file /mlive/index.js
 * @brief 라이브방송
 */
import React, {useContext, useState, useEffect} from 'react'
import styled from 'styled-components'
import _ from 'lodash'
//context
import Api from 'context/api'
import {Context} from 'context'
import {Store} from './index'
import NoResult from 'components/ui/noResult'
//room
import Room, {RoomJoin} from 'context/room'
//components
import List from './live-list'
//
const LiveIndex = () => {
  //context
  const context = useContext(Context)
  //let
  let clicked = false
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
        if (clicked) return
        clicked = true

        const {roomNo} = mode.selectList
        RoomJoin(roomNo + '', () => {
          console.log('----1')
          clicked = false
        })
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
  return (
    <Content>
      {makeContents()}
      <Room />
    </Content>
  )
}
export default LiveIndex
//---------------------------------------------------------------------

//---------------------------------------------------------------------
const Content = styled.div``
