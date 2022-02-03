import React, {useState, useContext, useEffect, useReducer, useMemo} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import Api from 'context/api'
// import {selfAuthCheck, getExchangeHistory, getExchangeCalc, exchangeApply, exchangeReApply} from 'common/api'
import calcAge from 'components/lib/calc_age'
import {Inspection} from './common_fn'
import Utility from 'components/lib/utility'
//components
import MakeCalcContents from './subcontent/do_exchange_calc'
import MakeRadioWrap from './subcontent/do_exchange_radio_wrap'
import MakeFormWrap from './subcontent/do_exchange_form'
import MakeRepplyWrap from './subcontent/do_exchange_repply'
import MakeAddWrap from './subcontent/do_exchange_add'
import LayerPopupWrap from '../../main/component/layer_popup_wrap.js'
import Header from 'components/ui/new_header'
//pop
import Popup from 'pages/common/popup'
import AddPop from './subcontent/do_exchange_add_pop'
import SettingPop from './subcontent/do_exchange_setting_pop'

import ic_close from '../static/ic_close_round_g.svg'

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
          if (age < 11) {
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

  const bank = useMemo(() => {
    if (context.splash !== null) {
      return [{cd: '0', cdNm: '은행선택'}, ...context.splash.exchangeBankCode]
    } else {
      return []
    }
  }, [context.splash])

  const history = useHistory()
  const [badgeSpecial, setBadgeSpecial] = useState(false)
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
  const [popupData, setPopupData] = useState([])
  //환전하기 리뉴얼  state
  const [addList, setAddList] = useState([]) // 추가계좌조회리스트
  const [AddPopup, setAddPopup] = useState(false) // 추가계좌 포맷(체킹)
  const [SettingPopup, setSettingPopup] = useState(false)
  const [modifyInfo, setModifyInfo] = useState('') //수정계좌 포맷 fetch용
  const [addInfo, setAddInfo] = useState('') //추가된 계좌 정보 fetch용
  const [addBool, setAddBool] = useState(false) //추가 팝업 감지 체크
  const [modiInfo, setModiInfo] = useState('') //수정정보조회로 각종 탭을통한 props 전딜
  const [modiBool, setModiBool] = useState(false) //수정 팝업 감지 체크
  const [recent, setRecent] = useState('') //최근
  const [recentCheck, setRecentCheck] = useState(false)
  const [recentInfo, setRecentInfo] = useState('')
  const [deleteState, setDeleteState] = useState('')
  const [popState, setPopState] = useState(1)

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
    let paramData = {}
    if (recentInfo !== '') {
      paramData = {
        byeol: formData.byeolCnt,
        exchangeIdx: exchangeHistory.value['exchangeIdx'],
        accountName: recentInfo.accountName,
        accountNo: recentInfo.accountNo,
        bankCode: recentInfo.bankCode
      }
    } else {
      paramData = {
        byeol: formData.byeolCnt,
        exchangeIdx: exchangeHistory.value['exchangeIdx']
      }
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

  async function fetchMainPopupData(arg) {
    const res = await Api.getBanner({
      params: {
        position: arg
      }
    })
    const {result, data, message} = res
    if (result === 'success') {
      if (data) {
        setPopupData(
          data.filter((v) => {
            if (Utility.getCookie('popup_notice_' + `${v.idx}`) === undefined) {
              return v
            } else {
              return false
            }
          })
        )
      }
    } else {
      context.action.alert({
        msg: message,
        callback: () => {
          context.action.alert({visible: false})
        }
      })
    }
  }
  //환전하기 리뉴얼
  async function fetchSearchAccount() {
    const res = await Api.exchangeSearchAccount({})
    const {result, data, message} = res
    if (result === 'success') {
      setAddList(data.list)
    } else {
      context.action.alert({
        msg: message
      })
    }
  }
  async function fetchAddAccount() {
    const res = await Api.exchangeAddAccount({
      data: {
        accountName: addInfo.name,
        accountNo: addInfo.accountNumber,
        bankCode: addInfo.bank.split(',')[0],
        bankName: addInfo.bank.split(',')[1]
      }
    })
    const {result, data, message} = res
    setAddBool(false)
    if (result === 'success') {
    } else {
      context.action.alert({
        msg: message
      })
    }
  }
  async function fetchDeleteAccount() {
    const res = await Api.exchangeDeleteAccount({
      data: {
        idx: deleteState.modifyIdx,
        beforeAccountNo: deleteState.beforeAccount
      }
    })
    const {result, data, message} = res
    setDeleteState('')
    setModiInfo('')
    setModiBool(false)
    if (result === 'success') {
      context.action.alert({
        //콜백처리
        callback: () => {
          setDeleteState('')
        },
        //캔슬콜백처리
        cancelCallback: () => {},
        msg: message
      })
    } else {
      context.action.alert({
        msg: message
      })
    }
  }
  async function fetchModiAccount() {
    const res = await Api.exchangeEditAccount({
      data: {
        accountName: modiInfo.name,
        accountNo: modiInfo.accountNumber,
        bankCode: modiInfo.bank,
        bankName: modiInfo.accountName,
        beforeAccountNo: modiInfo.beforeAccount,
        idx: modiInfo.idx
      }
    })
    const {result, data, message} = res
    setDeleteState('')
    setModiInfo('')
    setModiBool(false)
    if (result === 'success') {
      context.action.alert({
        msg: message
      })
    } else {
      context.action.alert({
        msg: message
      })
    }
  }
  useEffect(() => {
    if (formData.noUsage === true && formData.usageAlert === true) {
      context.action.alert({
        msg: '만 14세 미만 미성년자 회원은\n서비스 이용을 제한합니다.',
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

    if (userProfile.badgeSpecial > 0) {
      setBadgeSpecial(true)
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
    if (radioCheck === 2) {
      fetchSearchAccount()
    }

    fetchMainPopupData('11')

    // context.action.alert({
    //   className: 'mobile',
    //   title: '추석 연휴 기간 환전신청 및 지급 안내',
    //   msg: `<p style="line-height:1.7">추석 연휴 기간 환전처리 일정을 안내드립니다.\n
    //   -----------------------------------------------------------\n
    //   <strong>◎ 환전 신청</strong> : 2020.9/29(화)~10/4(일)
    //   <strong>◎ 승인 처리 및 입금</strong> : 2020.10/5(월) 당일 영업시간 지급\n
    //   <strong>※ 이 점 참고해 주세요!!</strong>
    //    1. 9/29(화) 환전 신청건의 승인일자인 9/30(수)은\n 비 영업일인 관계로 10/5(월) 처리 됩니다.
    //    2.  환전 승인 및 입금은 10/5(월) 순차적으로 모두 처리가 완료될 예정입니다.\n
    //   -----------------------------------------------------------\n
    //   2020.10/5(월) 이후 신청 건은 기존 처리일정과 같이 다음날 정상적으로 처리되어 지급됩니다.</p>`
    // })
    const checkAutoState = async () => {
      const {result, data} = await Api.getDalAutoExchange()
      if (result === 'success') {
        setPopState(data.autoChange)
      }
    }
    checkAutoState()
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (popState === 0) {
        setPopState(1)
      }
    }, 8000)
  }, [popState])

  useEffect(() => {
    if (modiBool && deleteState.state === true && modiInfo === '') {
      fetchDeleteAccount()
    } else if (modiBool && modiInfo !== '' && deleteState === '') {
      fetchModiAccount()
    } else if (addBool && !modiBool) {
      fetchAddAccount()
    } else if (radioCheck === 2) {
      fetchSearchAccount()
    }
  }, [modiBool, addBool, deleteState, radioCheck])
  useEffect(() => {
    if (recent !== '') {
      setRadioCheck(1)
      setRecentInfo(recent)
    }
  }, [recent])
  return (
    <div className="doExchangeWrap">
      <Header title="환전하기" />
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
              <span>환전안내</span>
            </div>
          </div>
          {badgeSpecial > 0 && (
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
        {/* <button
          className={`doExchangeWrap__star--button ${exchangeCalc.basicCash <= 0 && 'active'}`}
          onClick={() => {
            fnExchangeCalc()
          }}>
          환전 계산하기
        </button> */}
        <div className="top__btn--wrap">
          <button
            className={`doExchangeWrap__star--button ${exchangeCalc.basicCash <= 0 && 'active'}`}
            onClick={() => {
              fnExchangeCalc()
            }}>
            환전 계산하기
          </button>
          <button
            className={`doExchangeWrap__star--button active`}
            onClick={() => {
              history.push('/exchange')
            }}>
            달 교환
          </button>
          {/* <div className={`auto-exchange-pop ${popState === 0 ? 'on' : 'off'}`}>
            <p>
              보유별을 “달”로 교환하시면<br></br> 아이템을 선물할 수 있습니다.
            </p>
            <button
              className="close"
              onClick={() => {
                setPopState(1)
              }}>
              <img src={ic_close} alt="닫기" />
            </button>
          </div> */}
        </div>

        {exchangeCalc.basicCash > 0 && <MakeCalcContents exchangeCalc={exchangeCalc} />}
        {exchangeHistory.exist && (
          <MakeRadioWrap
            radioCheck={radioCheck}
            handleEv={(prop) => {
              setRadioCheck(prop)
              setRecentCheck(false)
              setRecentInfo('')
            }}
          />
        )}
        <div className="doExchangeWrap__contentsHeader">
          {radioCheck === 1 ? '최근 입금 정보' : radioCheck === 2 ? '내 계좌 관리' : '신규 입금 정보'}
          {radioCheck === 2 && (
            <button className="plusBtn" onClick={() => setAddPopup(true)}>
              계좌추가
            </button>
          )}
        </div>
        {radioCheck === 0 && <MakeFormWrap state={formData} dispatch={formDispatch} inspection={checkInspection} bank={bank} />}
        {radioCheck === 1 && (
          <MakeRepplyWrap
            state={exchangeHistory.value}
            inspection={checkInspection}
            recentCheck={recentCheck}
            recentInfo={recentInfo}
          />
        )}
        {radioCheck === 2 && (
          <MakeAddWrap
            addList={addList}
            setSettingPopup={setSettingPopup}
            setModifyInfo={setModifyInfo}
            setRecent={setRecent}
            setRecentCheck={setRecentCheck}
          />
        )}
      </div>
      <Popup />
      {popupData.length > 0 && <LayerPopupWrap data={popupData} setData={setPopupData} />}
      {/* 계좌추가 팝업 */}
      {AddPopup && <AddPop setAddPopup={setAddPopup} setAddInfo={setAddInfo} setAddBool={setAddBool} bank={bank} />}
      {/* 계좌수정 팝업 */}
      {SettingPopup && (
        <SettingPop
          setSettingPopup={setSettingPopup}
          modifyInfo={modifyInfo}
          setModiInfo={setModiInfo}
          setModiBool={setModiBool}
          setDeleteState={setDeleteState}
        />
      )}
    </div>
  )
}
