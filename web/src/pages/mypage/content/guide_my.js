import React, {useEffect, useRef} from 'react'
import styled from 'styled-components'

import CloseBtn from '../static/close_w_l.svg'

export default (props) => {
  const {setDetailPopup} = props

  const closePopup = () => {
    setDetailPopup(false)
  }

  return (
    <PopupWrap>
      <div className="content-wrap">
        <div className="title-wrap">
          <div className="text">랭킹 기준</div>
          <button className="close-btn" onClick={() => closePopup()}>
            <img src={CloseBtn} alt="close" />
          </button>
        </div>
        <div className="inner-wrap">
          <p className="title">최근 팬 랭킹</p>
          <p className="content">
            최근 3개월 간 내 방송에서 선물을 많이
            <br />
            보낸 팬 순위입니다.
          </p>

          <p className="title">누적 팬 랭킹</p>
          <p className="content">
            전체 기간 동안 내 방송에서 선물을 많이
            <br />
            보낸 팬 순위입니다.
          </p>

          <p className="title">선물 전체 랭킹</p>
          <p className="content">
            팬 여부와 관계없이 내 방송에서 선물한 <br /> 전체 회원 순위입니다.
          </p>

          <p className="title">좋아요 전체 랭킹</p>
          <p className="content">
            팬 여부와 관계없이 내 방송에서
            <br />
            좋아요(부스터 포함)를 보낸
            <br />
            전체 회원 순위입니다.
          </p>
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
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;

  .content-wrap {
    position: relative;
    width: 100%;
    max-width: 328px;
    background-color: #fff;
    border-radius: 12px;

    .inner-wrap {
      padding: 0 16px 32px 16px;
      border-bottom-right-radius: 12px;
      border-bottom-left-radius: 12px;
      text-align: center;

      .title {
        padding-top: 20px;
        padding-bottom: 8px;
        font-size: 18px;
        line-height: 1.11;
        color: #FF3C7B;
        font-weight: 800;
      }

      .content {
        font-size: 14px;
      }
    }

    .title-wrap {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e0e0e0;
      height: 52px;

      .text {
        width: 100%;
        font-weight: 600;
        font-size: 18px;
        text-align: center;
      }

      .close-btn {
        position: absolute;
        top: -39px;
        right: 0;

        img {
          width: 100%;
        }
      }
    }
  }
`
