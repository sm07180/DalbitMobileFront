import React, {useState, useContext, useEffect} from 'react'
import styled from 'styled-components'

import {Hybrid, isHybrid} from 'context/hybrid'
import Layout from 'pages/common/layout/new_layout'
import Header from 'components/ui/new_header'
import qs from 'query-string'

import iconBack from 'pages/menu/static/ic_close.svg'

import './clip.scss'

export default function fileloadTip(props) {
  const [tabState, setTabState] = useState(1)
  const {webview} = qs.parse(location.search)

  const clickCloseBtn = () => {
    alert(isHybrid())
    alert(webview)
    if (isHybrid() && webview && webview === 'new') {
      Hybrid('CloseLayerPopup')
    } else {
      window.history.back()
    }
  }

  return (
    <>
      <Layout status="no_gnb">
        <TipHeader>
          <div className="inner">
            <button className="close-btn" onClick={clickCloseBtn}>
              <img src="iconBack" alt="뒤로가기" />
            </button>
            <h2>파일 업로드하는</h2>
          </div>
        </TipHeader>
        <div id="clipPage">
          <div className="fileTopBox">
            <div className="tipTabBox">
              <button
                className={`tipTabBox__btn ${tabState === 1 ? 'tipTabBox__btn--active' : ''}`}
                onClick={() => setTabState(1)}>
                iTunes
              </button>
              <button
                className={`tipTabBox__btn ${tabState === 2 ? 'tipTabBox__btn--active' : ''}`}
                onClick={() => setTabState(2)}>
                음성메모
              </button>
            </div>

            <div className="tipContentBox">
              {tabState === 1 ? (
                <img src="https://image.dalbitlive.com/app/clip_tip_itunes.png" alt="itunes" />
              ) : (
                <img src="https://image.dalbitlive.com/app/clip_tip_memo.png" alt="memo" />
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

const TipHeader = styled.div`
  position: relative;
  width: 100%;
  height: 50px;
  padding: 12px 16px;
  color: #000;
  background-color: #fff;
  border-bottom: 1px solid #d2d2d2;
  box-sizing: border-box;

  h2 {
    font-size: 18px;
    color: #000;
    text-align: center;
    line-height: 24px;
    letter-spacing: -0.45px;
  }
`
