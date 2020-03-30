/**
 * @file /mlive/index.js
 * @brief 라이브방송
 */
import React, {useContext, useState, useEffect} from 'react'
import styled from 'styled-components'
//context
import Api from 'context/api'
import {Context} from 'context'
import {Store} from './index'
import {COLOR_MAIN} from 'context/color'
//components
import List from './live-list'
//
const LiveIndex = () => {
  //context
  const context = useContext(Context)
  //useState

  //-----------------------------------------------------------
  // 방송방 리스트 조회
  const getBroadList = async mode => {
    const obj = {
      params: {records: 10, roomType: Store().roomType, page: Store().currentPage, searchType: Store().searchType}
    }
    console.log(obj)
    const res = await Api.broad_list(obj)
    if (res.result === 'success') {
      //APPEND
      if (mode !== undefined && mode.type === 'append') {
        const result = {paging: res.data.paging, list: [...Store().broadList.list, ...res.data.list]}
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
  //connect

  //update
  function update(mode) {
    switch (true) {
      case mode.selectList !== undefined: //-------------아이템선택
        alert(JSON.stringify(mode.selectList, null, 1))
        break
      default:
        break
    }
  }
  //makeContents
  const makeContents = () => {
    if (Store().broadList === null) return
    const {list, paging} = Store().broadList
    const result = list.map((list, idx) => {
      return <List key={idx} data={list} update={update} />
    })
    return [result]
  }
  //---------------------------------------------------------------------
  useEffect(() => {
    getBroadList({type: 'append'})
  }, [Store().currentPage])
  //
  useEffect(() => {
    getBroadList()
  }, [Store().searchType, Store().roomType])
  //---------------------------------------------------------------------
  return <Content>{makeContents()}</Content>
}
export default LiveIndex
//---------------------------------------------------------------------
const Content = styled.div`
  display: block;
  margin-top: 16px;
  border-top: 1px solid ${COLOR_MAIN};
`
//---------------------------------------------------------------------
