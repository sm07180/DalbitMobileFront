// Api
import React, {useCallback, useContext, useEffect, useState} from 'react'
// context
import {Context} from 'context'
import Api from 'context/api'
// router
import {useHistory, useLocation} from 'react-router-dom'
// scss
import '../myclip.scss'
// components
import ClipUpload from '../component/clip/clip_upload'
import ClipHistory from '../component/clip/clip_history'
import Header from '../component/header.js'
import qs from 'query-string'
// ----------------------------------------------------------------------
export default function Clip(props) {
  // history
  let history = useHistory()
  const context = useContext(Context)
  // location
  const location = useLocation()
  const { tab } = qs.parse(location.search)

  // divide components
  const createContents = () => {
    if (context.clipTab === 0) {
      return <ClipUpload />
    } else {
      return <ClipHistory />
    }
  }
  //toggle tab
  const changeTab = (type) => {
    if (type === 0) {
      context.action.updateClipTab(0)
    } else {
      context.action.updateClipTab(1)
    }
  }

  //----------------------------------------------------------------
  useEffect(() => {
    //클립타입 조회
    const fetchDataClipType = async () => {
      const {result, data} = await Api.getClipType({})
      if (result === 'success') {
        context.action.updateClipType(data)
      } else {
      }
    }
    fetchDataClipType()
    return () => {
      context.action.updateClipTab(0)
    }
  }, [])

  // render---------------------------------------------------------
  return (
    <div id="mypageClip">
      {!props.type && <Header title="클립" />}
      {context.urlStr === context.profile.memNo && (
        <div className="header">
          <div className="header__tab">
            <button
              onClick={() => changeTab(0)}
              className={context.clipTab === 0 ? 'header__tabBtn header__tabBtn--active' : 'header__tabBtn'}>
              업로드
            </button>
            <button
              onClick={() => changeTab(1)}
              className={context.clipTab === 1 ? 'header__tabBtn header__tabBtn--active' : 'header__tabBtn'}>
              청취내역
            </button>
          </div>
        </div>
      )}
      {createContents()}
    </div>
  )
}
