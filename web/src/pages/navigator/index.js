/**
 * @file /login/index.js
 * @brief 로그인
 */
import React, {useEffect, useMemo, useState, useContext} from 'react'
import qs from 'qs'

/*
* 결제가 완료 되었습니다.
* 휴대폰 결제
* */
export default (props) => {
  //queryString
  const queryString = useMemo(() => {
    if (props.location.search === undefined) return ''

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

    history.replace(queryString.router, {...queryString, type: 'native-navigator'})
  }, [])
  //---------------------------------------------------------------------
  return <React.Fragment />
}
