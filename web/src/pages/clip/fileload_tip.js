import React, {useState, useContext, useEffect} from 'react'
import styled from 'styled-components'

import {Hybrid, isHybrid} from 'context/hybrid'
import Layout from 'pages/common/layout'
import qs from 'query-string'

import iconBack from './static/ic_back.svg'

import './scss/clip.scss'

export default function fileloadTip(props) {
  const [tabState, setTabState] = useState(1)
  const {webview} = qs.parse(location.search)

  const clickCloseBtn = () => {
    // alert(isHybrid())
    // alert(webview)
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
              <img src={iconBack} alt="뒤로가기" />
            </button>
            <h2>파일 가져오는 방법</h2>
          </div>
        </TipHeader>
        <Content className="fileTopBox">
          <div className="tipTabBox">
            <button className={`tipTabBox__btn ${tabState === 1 ? 'tipTabBox__btn--active' : ''}`} onClick={() => setTabState(1)}>
              iTunes
            </button>
            <button className={`tipTabBox__btn ${tabState === 2 ? 'tipTabBox__btn--active' : ''}`} onClick={() => setTabState(2)}>
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
        </Content>
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

  .close-btn {
    display: block;
    position: absolute;
    top: 50%;
    margin-top: -20px;
    left: 6px;
    width: 36px;
    cursor: pointer;
  }
`
const Content = styled.div`
  &.fileTopBox {
    padding: 0 16px;

    .tipTabBox {
      margin: 12px 0 28px;

      &__btn {
        width: 50%;
        height: 40px;
        font-size: 14px;
        border: solid 1px #e0e0e0;
        background-color: #f5f5f5;
        color: #bdbdbd;

        &:first-child {
          border-radius: 12px 0 0 12px;
        }
        &:last-child {
          border-radius: 0 12px 12px 0;
        }

        &--active {
          background-color: #fff;
          color: #FF3C7B;
          border-color: #FF3C7B;
        }
      }
    }

    .tipContentBox {
      img {
        width: 100%;
      }
    }
  }
`
