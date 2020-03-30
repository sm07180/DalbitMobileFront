/**
 * @file /mlive/index.js
 * @brief 라이브방송
 */
import React, {useContext, useEffect} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {COLOR_MAIN} from 'context/color'

//components
import {Store} from './index'
import Api from 'context/api'
//pages
//
export default props => {
  //context
  const context = useContext(Context)
  //-----------------------------------------------------------
  // 방송방 리스트 조회
  const getBroadList = async () => {
    const obj = {
      params: {roomType: Store().type, page: Store().currentPage, records: Store().RECORDS, searchType: Store().searchType}
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
  //makeContents
  const makeContents = () => {
    if (Store().broadList === null) return
    console.log(Store().broadList)
  }
  //---------------------------------------------------------------------
  useEffect(() => {
    getBroadList()
  }, [])
  //---------------------------------------------------------------------
  return <Content>{makeContents()}</Content>
}

//---------------------------------------------------------------------
const Content = styled.div``
//---------------------------------------------------------------------
