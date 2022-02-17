import React, {useState} from 'react'
import styled from 'styled-components'

import CloseBtn from '../../static/close_w_l.svg'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default function detailPopup(props) {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {setAddPopup, bank} = props

  const [addName, setAddName] = useState('')
  const [addBank, setAddBank] = useState('')
  const [addAccountNumber, setAccountNumber] = useState('')

  const closePopup = () => {
    setAddPopup(false)
  }
  const applyClick = () => {
    if (addName === '') {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '예금주명을 입력해주세요'
      }))
    } else if (addBank === '' || addBank.split(',')[0] == 0) {
      console.log(addBank)
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '은행을 선택해주세요'
      }))
    } else if (addAccountNumber === '' || addAccountNumber.length < 9) {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '계좌번호를 확인해주세요'
      }))
    } else {
      setAddPopup(false)
      props.setAddInfo({
        name: addName,
        bank: addBank,
        accountNumber: addAccountNumber
      })
      props.setAddBool(true)
    }
  }
  const AddBankFunc = (code) => {
    setAddBank(code)
  }
  const trackOnChange = (e) => {
    if (!isNaN(e.target.value) && e.target.value.length < 21) {
      setAccountNumber(e.target.value.trim())
    } else {
      return false
    }
  }
  const validateName = (name) => {
    if (name.length > 20) {
      return false
    } else {
      setAddName(name)
    }
  }
  return (
    <PopupWrap>
      <div className="content-wrap">
        <div className="title-wrap">
          <div className="text">계좌 추가</div>
          <button className="close-btn" onClick={() => closePopup()}>
            <img src={CloseBtn} alt="close" />
          </button>
        </div>
        <div className="inner-wrap">
          <div className="each-line">
            <div className="tab-wrap">
              <div className="formData__list">
                <div className="formData__title">예금주</div>
                <div className="formData__input">
                  <input
                    type="text"
                    className="formData__input--text"
                    onChange={(e) => validateName(e.target.value)}
                    value={addName}
                  />
                </div>
              </div>
              <div className="formData__list">
                <div className="formData__title">은행</div>
                <div className={`${open && 'on'} formData__input formData__input--select`}>
                  <select onChange={(e) => AddBankFunc(e.target.value)}>
                    {bank.map((v, idx) => {
                      return (
                        <option key={idx} value={[v.cd, v.cdNm]} text={v.cdNm}>
                          {v.cdNm}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>
              <div className="formData__list">
                <div className="formData__title">계좌번호</div>
                <div className="formData__input">
                  <input
                    type="tel"
                    className="formData__input--text"
                    value={addAccountNumber}
                    onChange={(e) => trackOnChange(e)}
                    placeholder="입력 주세요"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="btn-wrap">
            <button className="apply-btn delete" onClick={closePopup}>
              취소
            </button>
            <button className="apply-btn" onClick={applyClick}>
              등록
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
        margin-bottom: 6px;
        color: #000;
      }

      .tab-wrap {
        .tab-btn {
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          font-size: 14px;
          color: #000;
          background: #fff;
          width: 100%;
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
      display: flex;
      justify-content: space-between;
      margin-top: 21px;

      .apply-btn {
        display: block;
        width: calc(50% - 2px);
        border-radius: 12px;
        background-color: #632beb;
        color: #fff;
        font-size: 18px;
        font-weight: 600;
        padding: 12px 0;
        &.delete {
          background-color: #757575;
        }
      }
    }
  }
`
const bankList = [
  {text: '은행선택', value: 0},
  {text: '경남은행', value: 39},
  {text: '광주은행', value: 34},
  {text: '국민은행', value: 4},
  {text: '기업은행', value: 3},
  {text: '농협', value: 11},
  {text: '대구은행', value: 31},
  {text: '도이치은행', value: 55},
  {text: '부산은행', value: 32},
  {text: '비엔피파리바은행', value: 61},
  {text: '산림조합중앙회', value: 64},
  {text: '산업은행', value: 2},
  {text: '저축은행', value: 50},
  {text: '새마을금고중앙회', value: 45},
  {text: '수출입은행', value: 8},
  {text: '수협은행', value: 7},
  {text: '신한은행', value: 88},
  {text: '신협', value: 48},
  {text: '우리은행', value: 20},
  {text: '우체국', value: 71},
  {text: '전북은행', value: 37},
  {text: '제주은행', value: 35},
  {text: '중국건설은행', value: 67},
  {text: '중국공상은행', value: 62},
  {text: '카카오뱅크', value: 90},
  {text: '케이뱅크', value: 89},
  {text: '펀드온라인코리아', value: 294},
  {text: '한국씨티은행', value: 27},
  {text: 'BOA은행', value: 60},
  {text: 'HSBC은행', value: 54},
  {text: '제이피모간체이스은행', value: 57},
  {text: '하나은행', value: 81},
  {text: 'SC제일은행', value: 23},
  {text: 'NH투자증권', value: 247},
  {text: '교보증권', value: 261},
  {text: '대신증권', value: 267},
  {text: '메리츠종합금융증권', value: 287},
  {text: '미래에셋대우', value: 238},
  {text: '부국증권', value: 290},
  {text: '삼성증권', value: 240},
  {text: '신영증권', value: 291},
  {text: '신한금융투자', value: 278},
  {text: '유안타증권', value: 209},
  {text: '유진투자증권', value: 280},
  {text: '이베스트투자증권', value: 265},
  {text: '케이프투자증권', value: 292},
  {text: '키움증권', value: 264},
  {text: '하나금융투자', value: 270},
  {text: '하이투자증권', value: 262},
  {text: '한국투자증권', value: 243},
  {text: '한화투자증권', value: 269},
  {text: '현대차증권', value: 263},
  {text: 'DB금융투자', value: 279},
  {text: 'KB증권', value: 218},
  {text: 'KTB투자증권', value: 227},
  {text: 'SK증권', value: 266}
]
