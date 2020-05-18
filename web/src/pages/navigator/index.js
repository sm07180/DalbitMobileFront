/**
 * @file /login/index.js
 * @brief 로그인
 */
import React, {useEffect, useMemo, useState, useContext} from 'react'
import qs from 'qs'
//context
import {Context} from 'context'

export default (props) => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //queryString
  const queryString = useMemo(() => {
    if (props.location.search === undefined) return ''
    if (__NODE_ENV === 'dev') {
      alert('navigator')
      alert(JSON.stringify(props.location.search, null, 1))
    }
    return qs.parse(props.location.search, {ignoreQueryPrefix: true})
  })
  //useEffect
  useEffect(() => {
    if (queryString === '') {
      alert('정보가없습니다')
      return
    }
    //title
    const {history} = props

    history.push(queryString.router, {...queryString, type: 'native-navigator'})
  }, [])
  //---------------------------------------------------------------------
  return <React.Fragment />
}
