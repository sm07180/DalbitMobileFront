import React, {useEffect, useRef} from 'react'
import styled from 'styled-components'

// static
import CloseBtn from '../static/ic_close.svg'

let prevAlign = null
let prevGender = null

export default (props) => {
  const {alignSet, setPopup, liveAlign, setLiveAlign, liveGender, setLiveGender, setPage} = props
  const genderSet = {f: '여자', m: '남자', d: '신입'}

  // reference
  const layerWrapRef = useRef()

  useEffect(() => {
    prevAlign = liveAlign
    prevGender = liveGender
    document.body.style.overflow = 'hidden'

    const layerWrapNode = layerWrapRef.current
    layerWrapNode.style.touchAction = 'none'

    return () => {
      prevAlign = null
      prevGender = null
      document.body.style.overflow = ''
    }
  }, [])

  const closePopup = () => {
    setPopup(false)
    setLiveAlign(prevAlign)
    setLiveGender(prevGender)
  }

  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'main-layer-popup') {
      closePopup()
    }
  }

  const wrapTouch = (e) => {
    e.preventDefault()
  }

  const applyClick = () => {
    setPopup(false)
    setPage(1)
  }

  const tabClick = (type, value) => {
    if (type === 'align') {
      if (liveAlign !== value) {
        setLiveAlign(value)
      }
    } else if (type === 'gender') {
      if (liveGender === value) {
        setLiveGender('')
      } else {
        setLiveGender(value)
      }
    }
  }

  return (
    <PopupWrap id="main-layer-popup" ref={layerWrapRef} onClick={wrapClick} onTouchStart={wrapTouch} onTouchMove={wrapTouch}>
      <div className="content-wrap">
        <div className="title-wrap">
          <div className="text">상세조건</div>
          <img src={CloseBtn} className="close-btn" onClick={() => closePopup()} />
        </div>

        <div className="each-line">
          <div className="text">정렬기준</div>
          <div className="tab-wrap">
            {Object.keys(alignSet).map((key, idx) => {
              let NumberKey = Number(key)
              return (
                <div
                  className={`tab ${NumberKey === liveAlign ? 'active' : ''}`}
                  key={`align-${idx}`}
                  onClick={() => tabClick('align', NumberKey)}>
                  {alignSet[key]}
                </div>
              )
            })}
          </div>
        </div>
        <div className="each-line">
          <div className="text">DJ 타입 선택</div>
          <div className="tab-wrap">
            {Object.keys(genderSet).map((key, idx) => {
              return (
                <div
                  className={`tab ${key === liveGender ? 'active' : ''}`}
                  key={`gender-${idx}`}
                  onClick={() => tabClick('gender', key)}>
                  {genderSet[key]}
                </div>
              )
            })}
          </div>
        </div>

        <div className="btn-wrap">
          <button className="apply-btn" onClick={applyClick}>
            적용
          </button>
        </div>
      </div>
    </PopupWrap>
  )
}

const PopupWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 60;

  display: flex;
  justify-content: center;
  align-items: center;

  .content-wrap {
    width: calc(100% - 32px);
    max-width: 328px;
    padding: 20px;
    padding-top: 12px;
    border-radius: 12px;
    background-color: #fff;

    .title-wrap {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e0e0e0;
      height: 40px;

      .text {
        width: 100%;
        font-weight: 600;
        font-size: 16px;
        text-align: center;
      }

      .close-btn {
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
      }
    }

    .each-line {
      margin-top: 24px;

      .text {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 10px;
      }

      .tab-wrap {
        display: flex;
        flex-direction: row;

        .tab {
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          font-size: 14px;
          color: #000;

          width: 33.3334%;
          padding: 7px 0;
          margin: 0 2px;
          box-sizing: border-box;
          text-align: center;

          &.active {
            border-color: transparent;
            background-color: #632beb;
            color: #fff;
          }

          &:first-child {
            margin-left: 0;
          }
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }

    .btn-wrap {
      margin-top: 20px;

      .apply-btn {
        display: block;
        width: 100%;
        border-radius: 12px;
        background-color: #632beb;
        color: #fff;
        font-size: 18px;
        font-weight: 600;
        padding: 12px 0;
      }
    }
  }
`
