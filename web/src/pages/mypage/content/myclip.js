// Api
import React, {useCallback, useContext, useEffect, useState} from 'react'

import Api from 'context/api'
// router
import {useParams, useHistory} from 'react-router-dom'
import Header from '../component/header.js'
// scss
import '../myclip.scss'
// components
import ClipUpload from '../component/clip/clip_upload'
import ClipHistory from '../component/clip/clip_history'
// context
import {Context} from 'context'

// ----------------------------------------------------------------------
export default function Clip(props) {
  //history
  let history = useHistory()
  const context = useContext(Context)

  const createContents = () => {
    if (context.clipTab === 0) {
      return <ClipUpload />
    } else {
      return <ClipHistory />
    }
  }
  const changeTab = (type) => {
    if (type === 0) {
      context.action.updateClipTab(0)
    } else {
      context.action.updateClipTab(1)
    }
  }
  //   const uploadModal = () => {
  //     history.push('/modal/my_clipUpload')
  //   }
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
  }, [])
  return (
    <div id="mypageClip">
      <Header title="클립" />
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
      {createContents()}
    </div>
  )
}
