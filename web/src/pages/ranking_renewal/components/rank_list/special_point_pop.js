import React, {useEffect, useContext} from 'react'
import styled from 'styled-components'

import {RankContext} from 'context/rank_ctx'

export default ({setPopState}) => {
  const {rankState, rankAction} = useContext(RankContext)

  const closePopup = () => {
    setPopState(false)
    // rank.action('')
  }

  // console.log(rankState.specialPoint)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <PopupWrap>
      <div className="content-wrap">
        <button className="close-btn">
          <img src="https://image.dalbitlive.com/svg/close_w_l.svg" onClick={() => closePopup()} />
        </button>

        <div className="scrollBox">
          <p className="topBox">
            <span>{rankState.specialPoint.nickNm} 님</span>은<br />
            스페셜 DJ 선발 누적 가산점
            <br />
            <span>{rankState.specialPoint.totalPoint}점</span>을 획득했습니다
          </p>

          <div className="tableBox">
            <div className="tableBox__title">
              <span>일간 TOP3 일자</span>
              <span>순위</span>
              <span>가산점</span>
            </div>

            <ul>
              <li>
                <span>2021년 02월</span>
                <span>1위</span>
                <span>2.0점</span>
              </li>
              {rankState.specialPointList.map((item, index) => {
                const {rankDate, rank, addPoint} = item

                return (
                  <li key={index}>
                    {/* <span>{rankDate}</span>
                    <span>{rank}</span>
                    <span>{addPoint}</span> */}
                  </li>
                )
              })}
            </ul>
          </div>

          <p className="noticeBox">
            ※ 스페셜 DJ 선발 누적 가산점은 선발 총점 100점 기준
            <br />월 최대 10점까지만 인정되며 표기됩니다.
            <br />
            단, 매월 스페셜 DJ 선발 데이터 수집 기간 변동에 따라
            <br />
            내부 검토 시 수집 기간 외 점수는 이월되어 집계됩니다.
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
  z-index: 60;
  display: flex;
  justify-content: center;
  align-items: center;

  .content-wrap {
    position: relative;
    width: calc(100% - 32px);
    max-width: 328px;
    padding: 16px;
    padding-top: 12px;
    border-radius: 12px;
    background-color: #fff;

    .close-btn {
      position: absolute;
      top: -40px;
      right: 0;
    }

    .scrollBox {
      overflow-y: auto;
      height: auto;
    }

    .topBox {
      margin-bottom: 20px;
      border: 1px solid #bdbdbd;
      border-radius: 16px;
      padding: 16px;
      text-align: center;
      line-height: 22px;
      font-weight: 600;

      span {
        color: #632beb;
      }
    }

    .tableBox {
      font-size: 12px;

      &__title {
        display: flex;
        justify-content: space-between;
        padding: 7px 0;
        color: #632beb;
        border-top: 1px solid #632beb;
        border-bottom: 1px solid #632beb;

        span {
          display: block;
          width: 30%;
          text-align: center;

          &:first-child {
            width: 40%;
          }
        }
      }

      li {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #e0e0e0;
        padding: 12px 0;
        color: #424242;

        span {
          display: block;
          width: 30%;
          text-align: center;

          &:first-child {
            width: 40%;
          }
        }
      }
    }

    .noticeBox {
      margin-top: 20px;
      padding-bottom: 20px;
      line-height: 18px;
      font-size: 12px;
      color: #424242;
      letter-spacing: -0.3px;
    }
  }
`
