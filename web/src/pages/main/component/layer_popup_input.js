import React, {useEffect, useReducer, useRef, useState} from 'react'
// static
import CloseBtn from '../../menu/static/close_w_l.svg'
import 'styles/layerpopup.scss'
import DatePicker from './datepicker'
import Api from 'context/api'

import IcoFemale from '../static/ico_female.svg'
import IcoMale from '../static/ico_male.svg'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const formInit = {
  birth: '20200101',
  gender: 'n'
}

const FormDataReducer = (state, action) => {
  switch (action.type) {
    case 'birth':
      return {
        ...state,
        birth: action.value
      }

    case 'gender':
      return {
        ...state,
        gender: action.value
      }

    default:
      break
  }
}

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {setInputPopup} = props

  const [formData, formDispatch] = useReducer(FormDataReducer, formInit)

  const [validate, setValidate] = useState(false)

  // reference
  const layerWrapRef = useRef()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const layerWrapNode = layerWrapRef.current
    layerWrapNode.style.touchAction = 'none'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const closePopup = () => {
    setInputPopup(false)
  }
  const handleSaveBtn = () => {
    let myBirth = formData.birth.slice(0, 4)
    const baseYear = new Date().getFullYear() - 11

    if (formData.birth === '20200101' || myBirth > baseYear) {
      return dispatch(setGlobalCtxMessage({type: "toast", msg: '생년월일을 정확하게 입력해주세요'}))
    }

    if (formData.gender === 'n') return dispatch(setGlobalCtxMessage({type: "toast", msg: '성별을 선택해주세요'}))

    const saveProfile = async () => {
      const res = await Api.profile_edit({
        data: {
          gender: formData.gender,
          birth: formData.birth,
          nickNm: globalState.profile.nickNm,
          profMsg: globalState.profile.profMsg,
          profImg: globalState.profile.profImg.path
        }
      })
      if (res.result === 'success') {
        dispatch(setGlobalCtxMessage({type: "toast", msg: '회원정보가 변경되었습니다.'}))
        closePopup()
      } else {
        dispatch(setGlobalCtxMessage({type: "alert", msg: res.message}))
      }
    }
    saveProfile()
  }

  const birthChange = (birth) => {
    formDispatch({type: 'birth', value: birth})
  }

  const genderChange = (gender) => {
    formDispatch({type: 'gender', value: gender})
  }

  useEffect(() => {
    let myBirth = formData.birth.slice(0, 4)
    const baseYear = new Date().getFullYear() - 11
    if (myBirth <= baseYear && formData.gender !== 'n') {
      setValidate(true)
    }
  }, [formData])

  return (
    <div id="mainLayerPopup" ref={layerWrapRef} onClick={closePopup}>
      <div className="popup popup-input">
        <div className="popup__wrap">
          <div className="popbox active">
            <div className="popup__box popup__text">
              <div className="popup__inner" onClick={(e) => e.stopPropagation()}>
                <div className="popup__title">
                  <h3 className="h3-tit">추가정보 등록</h3>
                  <button className="close-btn" onClick={() => closePopup()}>
                    <img src={CloseBtn} alt="닫기" />
                  </button>
                </div>
                <div className="inner">
                  <p className="text">
                    정상적인 서비스 이용을 위해 <br />
                    생년월일과 성별을 입력해주세요.
                  </p>
                  <p className="guide-text">
                    입력 후 변경은 불가능하니 <br />
                    신중하게 입력 부탁드립니다.
                  </p>

                  <div className="input-birth">
                    <label htmlFor="birth">생년월일</label>
                    <DatePicker id="birth" name="birth" change={birthChange} />
                  </div>

                  <div className="input-gender">
                    <button
                      className={`male ${formData.gender === 'n' ? 'first' : formData.gender === 'm' ? 'on' : 'off'}`}
                      value="m"
                      onClick={(e) => {
                        genderChange(e.target.value)
                      }}>
                      남자
                      <img
                        src={IcoMale}
                        onClick={(e) => {
                          e.stopPropagation()
                          genderChange(e.target.parentNode.value)
                        }}
                      />
                    </button>
                    <button
                      className={`female ${formData.gender === 'n' ? 'first' : formData.gender === 'f' ? 'on' : 'off'}`}
                      value="f"
                      onClick={(e) => {
                        genderChange(e.target.value)
                      }}>
                      여자
                      <img
                        src={IcoFemale}
                        onClick={(e) => {
                          e.stopPropagation()
                          genderChange(e.target.parentNode.value)
                        }}
                      />
                    </button>
                  </div>

                  <div className="btnWrap">
                    <button
                      className={`btn-ok ${validate ? 'on' : 'off'}`}
                      onClick={() => {
                        handleSaveBtn()
                      }}>
                      저장하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
