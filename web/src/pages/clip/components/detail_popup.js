import React, {useState, useContext, useEffect} from 'react'
import styled from 'styled-components'

import CloseBtn from '../static/close_w_l.svg'
import {Context} from 'context'

export default function detailPopup(props) {
  const {setDetailPopup} = props
  const context = useContext(Context)
  const [sortState, setSortState] = useState(0)
  const [sortGender, setSortGender] = useState('')
  const closePopup = () => {
    setDetailPopup(false)
  }

  const applyClick = () => {
    setDetailPopup(false)
    // resetFetchList()
    context.action.setClipMainSort(sortState)
    context.action.setClipMainGender(sortGender)
  }
  const sortFunc = (type) => {
    setSortState(type)
  }
  const genderFunc = (type) => {
    setSortGender(type)
  }
  useEffect(() => {
    setSortState(context.clipMainSort)
    setSortGender(context.clipMainGender)
  }, [])
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
            <div className="text">정렬기준</div>
            <div className="tab-wrap">
              <button type="button" className={sortState === 0 ? 'tab-btn active' : 'tab-btn'} onClick={() => sortFunc(0)}>
                최신순
              </button>
              <button type="button" className={sortState === 1 ? 'tab-btn active' : 'tab-btn'} onClick={() => sortFunc(1)}>
                인기순
              </button>
              <button type="button" className={sortState === 2 ? 'tab-btn active' : 'tab-btn'} onClick={() => sortFunc(2)}>
                재생순
              </button>
            </div>
          </div>

          <div className="each-line">
            <div className="text">DJ 타입</div>
            <div className="tab-wrap dj-type">
              <button type="button" className={'tab-btn '} onClick={() => genderFunc('')}>
                마이스타
              </button>
              <button type="button" className={'tab-btn '} onClick={() => genderFunc('')}>
                스페셜DJ
              </button>
              <button type="button" className={sortGender === 'f' ? 'tab-btn active' : 'tab-btn'} onClick={() => genderFunc('f')}>
                여자
              </button>
              <button type="button" className={sortGender === 'm' ? 'tab-btn active' : 'tab-btn'} onClick={() => genderFunc('m')}>
                남자
              </button>
            </div>
          </div>
          <div className="btn-wrap">
            <button className="apply-btn" onClick={applyClick}>
              기간 적용
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
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 10px;
        color: #000;
      }

      .tab-wrap {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .tab-btn {
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          font-size: 14px;
          color: #000;
          background: #fff;
          width: 32.3%;
          line-height: 42px;
          height: 42px;
          align-content: space-between;
          box-sizing: border-box;
          text-align: center;
          font-weight: bold;

          &.active {
            border-color: #632beb;
            color: #632beb;
          }
        }

        &.dj-type {
          flex-wrap: wrap;
          .tab-btn {
            width: 49.3%;
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
