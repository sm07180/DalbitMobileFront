import React, {useEffect, useState} from 'react'
import styled from 'styled-components'

// static
import CloseBtn from '../static/ic_close.svg'

export default props => {
  const {setPopup} = props

  return (
    <PopupWrap className="main-layer-popup">
      <div className="content-wrap">
        <div className="title-wrap">
          <div className="text">상세조건</div>
          <img src={CloseBtn} className="close-btn" onClick={() => setPopup(false)} />
        </div>

        <div className="each-line">
          <div className="text">정렬기준</div>
          <div className="tab-wrap">
            {['추천', '인기', '좋아요', '청취자'].map((type, idx) => {
              return (
                <div className="tab" key={`align-${idx}`}>
                  {type}
                </div>
              )
            })}
          </div>
        </div>
        <div className="each-line">
          <div className="text">DJ 타입 선택</div>
          <div className="tab-wrap">
            {['여자', '남자'].map((type, idx) => {
              return (
                <div className="tab" key={`gender-${idx}`}>
                  {type}
                </div>
              )
            })}
          </div>
        </div>

        <div className="btn-wrap">
          <button className="apply-btn">적용</button>
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
      }
    }

    .each-line {
      margin-top: 30px;

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
          font-size: 12px;
          color: #000;

          width: 25%;
          padding: 7px 0;
          margin: 1px;
          box-sizing: border-box;
          text-align: center;

          .active {
            border: none;
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
        padding: 15px 0;
      }
    }
  }
`
