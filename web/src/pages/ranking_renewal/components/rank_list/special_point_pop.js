import React, {useEffect, useContext} from 'react'
import styled from 'styled-components'
import {useSelector} from "react-redux";


export default ({setPopState}) => {
  const rankState = useSelector(({rankCtx}) => rankCtx);

  const closePopup = () => {
    setPopState(false)
  }

  const closePopupDim = (e) => {
    const target = e.target
    if (target.id === 'layer-popup') {
      closePopup()
    }
  }

  //--------------------------
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <PopupWrap id="layer-popup" onClick={closePopupDim}>
      <div className="content-wrap">
        <button className="close-btn">
          <img src="https://image.dalbitlive.com/svg/close_w_l.svg" onClick={() => closePopup()} />
        </button>

        <p className="topBox">
          <span>{rankState.specialPoint.nickNm} 님</span>은<br />
          스페셜 DJ 선발 누적 가산점
          <br />
          <span>{rankState.specialPoint.totalPoint}점</span>을 획득했습니다
        </p>

        <div className="tableBox">
          <div className="tableBox__th">
            <span>구분</span>
            <span>일자</span>
            <span>가산점</span>
          </div>

          <ul>
            {/* <li>
                <span>2021년 02월</span>
                <span>1위</span>
                <span>2.0점</span>
              </li> */}
            {rankState.specialPointList.map((item, index) => {
              const {rankDate, rank, addPoint, timeRound} = item

              const roundChage = () => {
                if (timeRound === 0) {
                  return <>일간</>
                } else {
                  return <>타임</>
                }
              }

              return (
                <li key={index}>
                  <span>
                    {roundChage()} {rank}위
                  </span>
                  <span>
                    {rankDate} {timeRound !== 0 && <>({timeRound}회차)</>}
                  </span>
                  <span>{addPoint}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <p className="noteBox">
          ※ 스페셜 DJ 선발 누적 가산점은 선발 총점 100점 기준
          <br />월 최대 10점까지만 인정되며 표기됩니다.
          <br />
          단, 매월 스페셜 DJ 선발 데이터 수집 기간 변동에 따라
          <br />
          내부 검토 시 수집 기간 외 점수는 이월되어 집계됩니다.
        </p>
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

    .topBox {
      margin-bottom: 20px;
      border: 1px solid #bdbdbd;
      border-radius: 16px;
      padding: 16px;
      text-align: center;
      line-height: 22px;
      font-weight: 600;

      span {
        color: #FF3C7B;
      }
    }

    .tableBox {
      font-size: 12px;

      &__th {
        display: flex;
        justify-content: space-between;
        padding: 7px 0;
        color: #FF3C7B;
        border-top: 1px solid #FF3C7B;
        border-bottom: 1px solid #FF3C7B;

        span {
          display: block;
          width: 30%;
          text-align: center;

          &:nth-of-type(2) {
            width: 40%;
          }
        }
      }

      ul {
        overflow-y: auto;
        max-height: 200px;
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

          &:nth-of-type(2) {
            width: 40%;
          }
        }
      }
    }

    .noteBox {
      margin-top: 20px;
      padding-bottom: 20px;
      line-height: 18px;
      font-size: 12px;
      color: #424242;
      letter-spacing: -0.3px;
      text-align: center;
    }
  }
`
