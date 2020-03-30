/**
 * @file /mlive/index.js
 * @brief 라이브방송
 */
import React, {useContext, useEffect} from 'react'
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

  //-----------------------------------------------------------
  // 방송방 리스트 조회
  const getBroadList = async () => {
    const obj = {
      params: {records: 10, roomType: Store().roomType, page: Store().currentPage, searchType: Store().searchType}
    }
    const res = await Api.broad_list(obj)
    if (res.result === 'success') {
      Store().action.updateBroadList(res.data)
      //   if (res.data.list.length) {
      //     return {result: true, ...res.data}
      //   } else {
      //     return {result: false}
      //   }
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
    console.log(mode)
    switch (mode) {
      case mode.selectList !== undefined: //-------------아이템선택
        console.log(mode)
        break
      case mode.listReload !== undefined: //-------------reload
        console.log(mode)
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
    return result
  }
  //---------------------------------------------------------------------
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
