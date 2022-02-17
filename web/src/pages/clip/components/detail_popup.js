import React, {useState} from 'react'
import styled from 'styled-components'

import CloseBtn from '../static/close_w_l.svg'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxClipMainDate, setGlobalCtxClipMainSort} from "redux/actions/globalCtx";

export default function detailPopup(props) {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {setDetailPopup} = props;

  const [sortState, setSortState] = useState(globalState.clipMainSort)
  const [sortDate, setSortDate] = useState(globalState.clipMainDate)
  const closePopup = () => {
    setDetailPopup(false)
  }

  const applyClick = () => {
    dispatch(setGlobalCtxClipMainSort(sortState))
    dispatch(setGlobalCtxClipMainDate(sortDate))
    setDetailPopup(false)
  }
  const sortFunc = (type) => {
    setSortState(type)
  }
  const DateFunc = (type) => {
    setSortDate(type)
  }

  return (
    <PopupWrap>
      <div className="content-wrap">
        <div className="title-wrap">
          <div className="text">상세조건</div>
          <button className="close-btn" onClick={() => closePopup()}>
            <img src={CloseBtn} alt="close" />
          </button>
        </div>
        <div className="inner-wrap">
          <div className="each-line">
            <div className="text">정렬 조건</div>
            <div className="tab-wrap">
              <button type="button" className={sortState === 6 ? 'tab-btn active' : 'tab-btn'} onClick={() => sortFunc(6)}>
                랜덤
              </button>
              <button type="button" className={sortState === 1 ? 'tab-btn active' : 'tab-btn'} onClick={() => sortFunc(1)}>
                최신순
              </button>
              <button type="button" className={sortState === 5 ? 'tab-btn active' : 'tab-btn'} onClick={() => sortFunc(5)}>
                스페셜DJ
              </button>
              <button type="button" className={sortState === 2 ? 'tab-btn active' : 'tab-btn'} onClick={() => sortFunc(2)}>
                인기순
              </button>
              <button type="button" className={sortState === 3 ? 'tab-btn active' : 'tab-btn'} onClick={() => sortFunc(3)}>
                선물순
              </button>
              <button type="button" className={sortState === 4 ? 'tab-btn active' : 'tab-btn'} onClick={() => sortFunc(4)}>
                재생순
              </button>
            </div>
          </div>

          <div className="each-line">
            <div className="text">
              조회 기간
              <span className="infoTxt">선택된 정렬의 데이터 조회기간</span>
            </div>
            <div className="tab-wrap dj-type">
              <button type="button" className={sortDate === 1 ? 'tab-btn active' : 'tab-btn'} onClick={() => DateFunc(1)}>
                1일
              </button>
              <button type="button" className={sortDate === 2 ? 'tab-btn active' : 'tab-btn'} onClick={() => DateFunc(2)}>
                1주일
              </button>
              <button type="button" className={sortDate === 0 ? 'tab-btn active' : 'tab-btn'} onClick={() => DateFunc(0)}>
                전체
              </button>
              {/* <button type="button" className={sortGender === 'f' ? 'tab-btn active' : 'tab-btn'} onClick={() => genderFunc('f')}>
                여자
              </button>
              <button type="button" className={sortGender === 'm' ? 'tab-btn active' : 'tab-btn'} onClick={() => genderFunc('m')}>
                남자
              </button> */}
            </div>
          </div>
          <div className="btn-wrap">
            <button className="apply-btn" onClick={applyClick}>
              적용 하기
            </button>
          </div>
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
      padding: 12px 16px 16px 16px;
      background: #eeeeee;
      border-bottom-right-radius: 12px;
      border-bottom-left-radius: 12px;
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

    .each-line {
      .text {
        display: flex;
        align-items: center;
        flex-direction: row;

        font-size: 16px;
        font-weight: 600;
        margin-bottom: 6px;
        color: #000;
      }
      .infoTxt {
        margin-left: 4px;
        font-size: 12px;
        color: #000;
        font-weight: normal;
      }
      .tab-wrap {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .tab-btn {
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          font-size: 14px;
          color: #000;
          background: #fff;
          width: 33%;
          line-height: 42px;
          height: 42px;
          align-content: space-between;
          box-sizing: border-box;
          text-align: center;
          font-weight: bold;
          margin-top: 4px;
          &.active {
            border-color: #632beb;
            color: #632beb;
          }
        }

        &.dj-type {
          flex-wrap: wrap;
          .tab-btn {
            width: 32.5%;
            margin-bottom: 4px;
          }
        }
      }
    }

    .each-line + .each-line {
      margin-top: 12px;
    }

    .btn-wrap {
      margin-top: 21px;

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
