import React, {useEffect, useState} from 'react'
import Api from 'context/api'

import {useHistory} from 'react-router-dom'
import qs from 'query-string'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default ({setSendPop}) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory()
  const parameter = qs.parse(location.search)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const closePopup = () => {
    setSendPop(false)
  }

  const closePopupDim = (e) => {
    const target = e.target
    if (target.id === 'layerPopup') {
      closePopup()
    }
  }

  const handlePhone = (e) => {
    if (e.target.value.toString().length > 15) {
    } else if (isNaN(e.target.value)) {
    } else {
      setPhone(e.target.value.trim())
    }
  }

  function alertValidation() {
    if (name === '') {
      return dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '이름을 입력해주세요.',
        callback: () => {
          dispatch(setGlobalCtxMessage({type: "alert", visible: false}))
        }
      }))
    }
    if (phone === '') {
      return dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '휴대폰 번호는 필수입력 값입니다',
        callback: () => {
          dispatch(setGlobalCtxMessage({type: "alert", visible: false}))
        }
      }))
    }

    const rgEx = /(01[0123456789])(\d{3}|\d{4})\d{4}$/g
    if (!rgEx.test(phone) || phone.length < 11) {
      return dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '올바른 휴대폰 번호가 아닙니다.',
        callback: () => {
          dispatch(setGlobalCtxMessage({type: "alert", visible: false}))
        }
      }))
    }

    specialdjUpload()
  }

  async function specialdjUpload() {
    const res = await Api.event_specialdj_upload({
      data: {
        name: name,
        phone: phone,
        select_year: parameter.select_year,
        select_month: parameter.select_month
      }
    })

    const {result} = res
    if (result === 'success') {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '스페셜 DJ 신청 및 접수가 \n 완료됐습니다.',
        callback: () => history.push('/')
      }))
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: res.message
      }))
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
    <div id="layerPopup" onClick={closePopupDim}>
      <div className="layerContainer isGray send_pop">
        <h3>스페셜 DJ 지원하기</h3>
        <div className="layerContent">
          <p className="note">
            스페셜 DJ에 지원하시겠습니까?
            <br />
            지원 후 취소는 불가합니다.
          </p>

          <p className="note point">
            합격 여부를 확인할 수 있는 <br />
            이름과 연락처를 반드시 기입해주세요.
          </p>

          <div className="input_box">
            <label>이름(실명)</label>
            <input type="text" onChange={(e) => setName(e.target.value)} placeholder="이름을 입력하세요." maxLength={4} />
          </div>

          <div className="input_box">
            <label>휴대폰번호</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => handlePhone(e)}
              placeholder="'-'를 뺀 숫자만 입력하세요."
              maxLength={11}
            />
          </div>

          <div className="btnWrap">
            <button className="btn btn_cancel" onClick={closePopup}>
              취소
            </button>
            <button className="btn btn_ok" onClick={alertValidation}>
              확인
            </button>
          </div>
        </div>
        <button className="btnClose" onClick={closePopup}>
          닫기
        </button>
      </div>
    </div>
  )
}
