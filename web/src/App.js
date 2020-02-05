/**
 * @file App.js
 * @brief React 최초실행시토큰검증및 필수작업
 * @notice
 */
import React, {useMemo, useState, useEffect, useContext} from 'react'
//components
import Api from 'context/api'
//context
import {Context} from 'context'
/*-Route-*/
import Route from './Route'

export default () => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //useState
  const [fetch, setFetch] = useState(null)

  //SERVER & APP -> REACT
  const customHeader = useMemo(() => {
    const element = document.getElementById('customHeader')
    if (element === null) return
    if (element.value === null || element.value === '') return
    return typeof JSON.parse(element.value) === 'object' && JSON.parse(element.value)
  })
  //---------------------------------------------------------------------
  //fetch
  async function fetchData(obj) {
    const res = await Api.getToken({...obj})
    setFetch(res)
    console.log(res)
  }
  //useEffect
  useEffect(() => {
    fetchData({data: customHeader})
  }, [])
  //---------------------------------------------------------------------
  return <Route />
}
