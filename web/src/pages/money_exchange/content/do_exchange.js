import React, {useState, useContext, useEffect, useReducer} from 'react'
import {useHistory} from 'react-router-dom'

import {Context} from 'context'
import Api from 'context/api'
// import {selfAuthCheck, getExchangeHistory, getExchangeCalc, exchangeApply, exchangeReApply} from 'common/api'

import calcAge from 'components/lib/calc_age'

import {Inspection} from './common_fn'

import MakeCalcContents from './subcontent/do_exchange_calc'
import MakeRadioWrap from './subcontent/do_exchange_radio_wrap'
import MakeFormWrap from './subcontent/do_exchange_form'
import MakeRepplyWrap from './subcontent/do_exchange_repply'

import BackBtn from '../static/ic_back.svg'
import Popup from 'pages/common/popup'

const FormDataReducer = (state, action) => {
  switch (action.type) {
    case 'byeol':
      if (isNaN(action.val)) {
        return state
      } else {
        return {
          ...state,
          byeolCnt: action.val
        }
      }

    case 'name':
      return {
        ...state,
        name: action.val
      }
    case 'bank':
      return {
        ...state,
        selectBank: action.val
      }
    case 'account':
      if (action.val.toString().length <= 20 && !isNaN(action.val)) {
        return {
          ...state,
          account: action.val
        }
      } else {
        return state
      }
    case 'fSocial':
      if (action.val.length > 6 || isNaN(action.val)) {
        return state
      } else {
        if (action.val.length === 6) {
          let currentDt
          if (action.val[0] === '0' || action.val[0] === '1') {
            currentDt = '20' + action.val
          } else {
            currentDt = '19' + action.val
          }
          const age = calcAge(currentDt)
          if (age <= 15) {
            return {
              ...state,
              fSocialNo: action.val,
              noUsage: true,
              usageAlert: true
            }
          } else {
            return {
              ...state,
              fSocialNo: action.val,
              noUsage: false,
              usageAlert: false
            }
          }
        } else {
          return {
            ...state,
            fSocialNo: action.val
          }
        }
      }
    case 'bSocial':
      if (isNaN(action.val) || action.val.length > 7) {
        return state
      } else {
        return {
          ...state,
          bSocialNo: action.val
        }
      }
    case 'phone':
      if (isNaN(action.val) || action.val.length > 15) {
        return state
      } else {
        return {
          ...state,
          phone: action.val
        }
      }
    case 'fAddress':
      return {
        ...state,
        fAddress: action.val
      }
    case 'bAddress':
      return {
        ...state,
        bAddress: action.val
      }
    case 'zoneCode':
      return {
        ...state,
        zoneCode: action.val
      }
    case 'check':
      return {
        ...state,
        check: action.val
      }
    case 'file':
      return {
        ...state,
        files: action.val
      }
    case 'consent':
      return {
        ...state,
        consent: action.val
      }
    case 'usageAlert':
      return {
        ...state,
        usageAlert: action.val
      }
    default:
      throw new Error()
  }
}

const formInit = {
  byeolCnt: 0,
  name: '',
  selectBank: 0,
  account: '',
  fSocialNo: '',
  bSocialNo: '',
  phone: '',
  fAddress: '',
  bAddress: '',
  zoneCode: '',
  files: [false, false, false],
  check: false,
  noUsage: false,
  consent: false,
  usageAlert: false
}

export default function DoExchange({state, dispatch}) {
  const context = useContext(Context)

  const history = useHistory()
  const [isSpecial, setIsSpecial] = useState(false)
  const [currentByeol, setCurrentByeol] = useState(0)
  const [exchangeCalc, setExchangeCalc] = useState({
    basicCash: 0, // 환전예상금액
    benefitCash: 0, // 스페셜DJ혜택
    taxCash: 0, // 원천징수세액
    feeCash: 0, // 이체수수료
    realCash: 0 // 환전실수령액
  })
  const [exchangeHistory, setExchangeHistory] = useState({
    exist: false,
    value: {}
  })

  const [radioCheck, setRadioCheck] = useState(0)
  const [formData, formDispatch] = useReducer(FormDataReducer, formInit)

  const userProfile = context.profile || {}

  const exchangeSubmit = async () => {
    const paramData = {
      byeol: formData.byeolCnt,
      accountName: formData.name,
      bankCode: formData.selectBank,
      accountNo: formData.account,
      socialNo: formData.fSocialNo + formData.bSocialNo,
      phoneNo: formData.phone,
      address1: formData.fAddress,
      address2: formData.bAddress,
      addFile1: formData.files[0].path,
      addFile2: formData.files[1].path,
      addFile3: formData.files[2] !== false ? formData.files[2].path : '',
      termsAgree: 1
    }

    const res = await Api.exchangeApply({data: {...paramData}})

    if (res.result === 'success') {
      dispatch({type: 'result', value: {...res.data}})
    } else {
      context.action.alert({
        msg: res.message,
        callback: () => {
          context.action.alert({visible: false})
        }
      })
    }
  }

  const repplySubmit = async () => {
    const paramData = {
      byeol: formData.byeolCnt,
      exchangeIdx: exchangeHistory.value['exchangeIdx']
    }

    const res = await Api.exchangeReApply({data: {...paramData}})

    if (res.result === 'success') {
      dispatch({type: 'result', value: {...res.data}})
    } else {
      context.action.alert({
        msg: res.message,
        callback: () => {
          context.action.alert({visible: false})
        }
      })
    }
  }

  const checkInspection = (type) => {
    const result = Inspection(formData, type, currentByeol)
    if (result['status']) {
      if (type === 0) {
        exchangeSubmit()
      } else {
        repplySubmit()
      }
    } else {
      if (result.skip !== undefined && result.skip === true) {
      } else {
        context.action.alert({
          msg: result.content,
          callback: () => {
            context.action.alert({
              visible: false
            })
          }
        })
      }
    }
  }

  const fnExchangeCalc = async () => {
    if (formData.byeolCnt < 570) {
      context.action.alert({
        msg: '환전 신청별은\n570개 이상이어야 합니다.',
        callback: () => {
          context.action.alert({
            visible: false
          })
        }
      })
    } else if (formData.byeolCnt > currentByeol) {
      context.action.alert({
        msg: '환전 신청별은\n보유 별보다 같거나 작아야 합니다.',
        callback: () => {
          context.action.alert({
            visible: false
          })
        }
      })
      return
    } else {
      const res = await Api.exchangeCalc({
        data: {
          byeol: formData.byeolCnt
        }
      })

      if (res.result === 'success') {
        setExchangeCalc({...res.data})
      }
    }
  }

  const handleChange = (e) => {
    const num = e.split(',').join('')
    if (!isNaN(parseInt(num))) {
      if (currentByeol < parseInt(num)) {
        formDispatch({type: 'byeol', val: currentByeol})
      } else {
        formDispatch({type: 'byeol', val: num})
      }
    } else {
      if (num === '') {
        formDispatch({type: 'byeol', val: 0})
      }
    }
  }

  useEffect(() => {
    if (formData.noUsage === true && formData.usageAlert === true) {
      context.action.alert({
        msg: '17세 미만 미성년자 회원은\n서비스 이용을 제한합니다.',
        callback: () => {
          formDispatch({type: 'usageAlert', val: false})
          context.action.alert({visible: false})
        }
      })
    }
  }, [formData.usageAlert])

  useEffect(() => {
    if (!userProfile.hasOwnProperty('byeolCnt')) {
      history.goBack()
      return
    }

    if (userProfile.byeolCnt > 0) {
      setCurrentByeol(userProfile.byeolCnt)
      formDispatch({type: 'byeol', val: userProfile.byeolCnt})
    }

    if (userProfile.isSpecial) {
      setIsSpecial(true)
    }

    async function fetchData() {
      const authCheck = await Api.self_auth_check()
      if (authCheck.result === 'success') {
        if (authCheck.data.parentsAgreeYn === 'y') {
          formDispatch({type: 'consent', val: true})
        }
      }
      const res = await Api.exchangeSelect()
      if (res.result === 'success') {
        setExchangeHistory({
          ...exchangeHistory,
          exist: true,
          value: {...res.data}
        })
        setRadioCheck(1)
      }
    }

    fetchData()

    context.action.alert({
      className: 'mobile',
      title: '[시스템 보완작업으로 인한 환전 일정 변경]',
      msg: `시스템 보완작업으로 아래와 같이 환전 업무가 조정되오니 일정을 확인해 주세요.\n
        ——————아  래——————\n
        ■ 스페셜 회원 (변동 없음)
        - 신청일 : 20/08/11(화)
        - 지급일 : 20/08/12(수)\n
        ■ 일반회원
        - 신청일 : 20/08/10(월)~20/08/11(화)
        - 지급일 : 20/08/13(목)이지만 하루 앞당긴 
        → 20/08/12(수) 오전 순차 지급\n
        ■ 스페셜, 일반회원 추가 변경 일정
        - 신청일 : 8/12(수)~8/18(화)
        - 지급일 : 20/08/19(수) 오전부터 순차 지급\n
        2020.08.19(수) 이후 신청 건은 일반과 스페셜 조건에 맞춰 정상 일정으로 지급됩니다.\n
        감사합니다.`
    })
  }, [])

  return (
    <div className="doExchangeWrap">
      <div className="doExchangeWrap__header">
        <img src={BackBtn} className="doExchangeWrap__header--button" onClick={() => history.goBack()} />
        <h3 className="doExchangeWrap__header--title">환전하기</h3>
      </div>
      <div className="doExchangeWrap__contents">
        <div>
          <div className="doExchangeWrap__contentsHeader">
            <div>환전 정보</div>
            <div
              className="doExchangeWrap__contentsHeader--info"
              onClick={() => {
                context.action.updatePopup('GUIDANCE')
              }}>
              <span className="doExchangeWrap__contentsHeader--icon" />
              <span>유의사항</span>
            </div>
          </div>
          {isSpecial && (
            <div className="doExchangeWrap__special">
              <p className="doExchangeWrap__special--title">DJ님은 스페셜 DJ 입니다.</p>
              <p className="doExchangeWrap__special--point">환전 실수령액이 5% 추가 됩니다.</p>
            </div>
          )}
        </div>
        <div className="doExchangeWrap__star">
          <div className="doExchangeWrap__star--box">
            <div className="doExchangeWrap__star--title">보유 별</div>
            <div className="doExchangeWrap__star--value">{Number(currentByeol).toLocaleString()}</div>
          </div>
          <div
            className="doExchangeWrap__star--arrow"
            onClick={() => {
              formDispatch({type: 'byeol', val: currentByeol})
            }}></div>
          <div className="doExchangeWrap__star--box doExchangeWrap__star--box--input">
            <div className="doExchangeWrap__star--title">환전 신청 별</div>
            <div className="doExchangeWrap__star--value">
              <input value={Number(formData.byeolCnt).toLocaleString()} onChange={(e) => handleChange(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="doExchangeWrap__star--caption">
          <div>*</div>
          <div>
            별은 570개 이상이어야 환전 신청이 가능하며,
            <br />별 1개당 KRW 60으로 환전됩니다.
          </div>
        </div>
        <button
          className={`doExchangeWrap__star--button ${exchangeCalc.basicCash > 0 && 'active'}`}
          onClick={() => {
            fnExchangeCalc()
          }}>
          환전 계산하기
        </button>

        {exchangeCalc.basicCash > 0 && <MakeCalcContents exchangeCalc={exchangeCalc} />}

        <div className="doExchangeWrap__contentsHeader">입금 정보</div>
        {exchangeHistory.exist && (
          <MakeRadioWrap
            radioCheck={radioCheck}
            handleEv={(prop) => {
              setRadioCheck(prop)
            }}
          />
        )}
        {radioCheck === 0 && <MakeFormWrap state={formData} dispatch={formDispatch} inspection={checkInspection} />}
        {radioCheck === 1 && <MakeRepplyWrap state={exchangeHistory.value} inspection={checkInspection} />}
      </div>
      <Popup />
    </div>
  )
}
