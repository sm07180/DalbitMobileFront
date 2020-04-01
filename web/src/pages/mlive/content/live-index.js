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
  //useState
  const [clicked, setClicked] = useState(false)
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
export const RoomJoin = roomNo => {
  async function fetchData() {
    const res = await Api.broad_join({data: {roomNo: roomNo}})
    if (res.result === 'fail') {
      console.log(JSON.stringify(res, null, 1))
      LiveIndex.context.action.alert({
        title: res.messageKey,
        msg: res.message
      })
    } else if (res.result === 'success') {
      //성공일때
      const {data} = res
      console.log(JSON.stringify(data, null, 1))
      Hybrid('RoomJoin', data)
    }
  }
  fetchData()
}
//---------------------------------------------------------------------
const Content = styled.div``
