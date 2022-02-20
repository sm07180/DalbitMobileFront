import React, {useState, useEffect, useContext, useReducer, useRef} from 'react'
import styled from 'styled-components'

import {Context} from 'context'
import Api from 'context/api'
import qs from 'query-string'
import Utility from 'components/lib/utility'
import {COLOR_MAIN} from 'context/color'
import {PHOTO_SERVER} from 'context/config'
import {Hybrid, isHybrid, isAndroid} from 'context/hybrid'

//components
import SignField from './components/signField'

//static
// import IcoProfile from './static/ico-profil.svg'
// import IcoCamera from './static/ico-camera.svg'
// import IcoCheckOn from './static/checkbox_on.svg'
// import IcoCheckOff from './static/checkbox_off.svg'
// import IcoArrow from './static/arrow.svg'

import './style.scss'

let intervalId = null
let setTime = 300

export default (props) => {
  const context = useContext(Context)
  const {webview, redirect} = qs.parse(location.search)

  const memIdRef = useRef(null)
  const authRef = useRef(null)

  const [timeText, setTimeText] = useState()
  const [btnState, setBtnState] = useState({
    memId: false,
    auth: false
  })
  const [termOpen, setTermOpen] = useState(true)
  const [step, setStep] = useState(1);

  //SNS 회원가입 셋팅
  let snsInfo = qs.parse(location.search)

  if (_.hasIn(snsInfo, 'nickNm')) {
    snsInfo = {...snsInfo, nickNm: snsInfo.nickNm.replace(/(\s*)/g, '')}
  }
  if (_.hasIn(snsInfo, 'profImgUrl') && snsInfo.profImgUrl.includes('http://')) {
    snsInfo = {...snsInfo, profImgUrl: snsInfo.profImgUrl.replace('http://', 'https://')}
  }

  //validation
  const spacePattern = /\s/g

  //약관
  const termsItem = [
    '약관 전체 동의',
    '[필수] 서비스 이용약관 동의',
    '[필수] 개인정보 취급방침',
    '[필수] 청소년 보호정책',
    '[필수] 운영정책'
  ]

  function reducer(state, action) {
    let {name, value} = action

    //휴대폰번호
    if (name === 'memId' && value.length === 11) {
      setBtnState({
        ...btnState,
        memId: true
      })
    } else {
      setBtnState({
        ...btnState,
        memId: false
      })
    }

    //인증번호
    if (name === 'auth') {
      if (value.length === 6) {
        setBtnState({
          ...btnState,
          auth: true
        })
      } else if (value.length > 6) {
        return {...state}
      } else {
        setBtnState({
          ...btnState,
          auth: false
        })
      }
    }

    //닉네임
    if (spacePattern.test(value)) return {...state}

    //약관
    let termsSetting = {}
    if (name === 'allTerm') {
      if (value === 'y') {
        termsSetting = {term1: 'y', term2: 'y', term3: 'y', term4: 'y'}
      } else if (value === 'n' && state.term1 === 'y' && state.term2 === 'y' && state.term3 === 'y' && state.term4 === 'y') {
        termsSetting = {term1: 'n', term2: 'n', term3: 'n', term4: 'n'}
      }
    }

    if (name === 'loginPwd' || name === 'loginPwdCheck') {
      value = value.toLowerCase()
    }

    return {
      ...state,
      [name]: value,
      ...termsSetting
    }
  }

  const [changes, dispatch] = useReducer(reducer, {
    memId: '',
    loginPwd: '',
    loginPwdCheck: '',
    nickNm: '',
    birth: null,
    // gender: 'n',
    profImgUrl: '',
    memType: 'p',
    allTerm: 'n',
    term1: 'n',
    term2: 'n',
    term3: 'n',
    term4: 'n',
    auth: '',
    CMID: '',
    ...snsInfo
  })

  function validateReducer(state, validate) {
    if (validate.name === 'nickNm' && validate.check) {
      if (state.birth.check && state.loginPwd.check && state.loginPwdCheck.check && state.term.check) {
        sighUpFetch()
      }
    }
    return {
      ...state,
      [validate.name]: {
        check: validate.check,
        text: validate.text === undefined ? '' : validate.text
      }
    }
  }

  const [validate, setValidate] = useReducer(validateReducer, {
    memId: {
      check: true,
      text: ''
    },
    auth: {
      check: true,
      text: ''
    },
    nickNm: {
      check: true,
      text: ''
    },
    birth: {
      check: true,
      text: ''
    },
    loginPwd: {
      check: true,
      text: ''
    },
    loginPwdCheck: {
      check: true,
      text: ''
    },
    term: {
      check: true,
      text: ''
    }
  })

  const {
    memId,
    loginPwd,
    loginPwdCheck,
    nickNm,
    birth,
    // gender,
    profImgUrl,
    memType,
    allTerm,
    term1,
    term2,
    term3,
    term4,
    auth,
    CMID
  } = changes

  //------------------------------------------------------------------------------
  //휴대폰 본인인증
  const validateID = (target) => {
    const rgEx = /(01[0123456789])(\d{4}|\d{3})\d{4}$/g
    const memIdVal = target
    if (memIdVal !== undefined) {
      if (memIdVal.length >= 11) {
        if (!rgEx.test(memIdVal)) {
          setValidate({
            name: 'memId',
            check: false,
            text: '올바른 휴대폰 번호가 아닙니다.'
          })
          return false
        } else {
          setValidate({
            name: 'memId',
            check: true
          })
          return true
        }
      }
    }
  }
  const fetchSmsReq = async () => {
    if (!validateID(memId)) return null
    const {result, data, message, code} = await Api.sms_request({
      data: {
        phoneNo: memId,
        authType: 0
      }
    })
    if (result === 'success') {
      dispatch({name: 'CMID', value: data.CMID})
      setValidate({
        name: 'memId',
        check: true,
        text: '인증번호 요청이 완료되었습니다.'
      })
      memIdRef.current.disabled = true
      authRef.current.disabled = false
      startAuthTimer()
    } else {
      setValidate({name: 'memId', check: false, text: message})
      context.action.alert({
        msg: message
      })
      if (code === '-1') {
        context.action.alert({
          msg: message
          // callback: () => {
          //   props.history.push('/login')
          // }
        })
      }
    }
  }
  const fetchSmsCheck = async () => {
    const {result, message} = await Api.sms_check({
      data: {
        CMID: CMID,
        code: Number(auth)
      }
    })
    if (result === 'success') {
      dispatch({name: 'CMID', value: true})
      setValidate({name: 'auth', check: true, text: message})
      setValidate({name: 'memId', check: true})
      clearInterval(intervalId)
      setTimeText('')
      authRef.current.disabled = true
      setBtnState({memId: false, auth: false})
    } else {
      setValidate({
        name: 'auth',
        check: false,
        text: '인증번호(가) 일치하지 않습니다.'
      })
      console.log("asdad");
    }
  }

  const startAuthTimer = () => {
    clearInterval(intervalId)
    setTime = 300
    intervalId = setInterval(() => {
      let timer = `${Utility.leadingZeros(Math.floor(setTime / 60), 2)}:${Utility.leadingZeros(setTime % 60, 2)}`
      setTimeText(timer)
      setTime--
      if (setTime < 0) {
        clearInterval(intervalId)
        setValidate({
          name: 'memId',
          check: false,
          text: '인증시간이 초과되었습니다.'
        })
        authRef.current.disabled = true
        setBtnState({memId: true, auth: true})
      }
    }, 1000)
  }

  //프로필사진
  const uploadSingleFile = (e) => {
    let reader = new FileReader()
    if (e.target.files.length === 0) return null
    const file = e.target.files[0]
    const fileName = file.name
    const fileSplited = fileName.split('.')
    const fileExtension = fileSplited.pop()
    const extValidator = (ext) => {
      const list = ['jpg', 'jpeg', 'png']
      return list.includes(ext)
    }

    if (!extValidator(fileExtension)) {
      return context.action.alert({
        msg: 'jpg, png 이미지만 사용 가능합니다.'
      })
    }

    //파일을 배열 버퍼로 읽는 최신 약속 기반 API
    reader.readAsArrayBuffer(file)
    //오리엔테이션 뽑아내는 함수
    function getOrientation(buffer) {
      var view = new DataView(buffer)
      if (view.getUint16(0, false) !== 0xffd8) {
        return {
          buffer: view.buffer,
          orientation: -2
        }
      }
      var length = view.byteLength,
        offset = 2
      while (offset < length) {
        var marker = view.getUint16(offset, false)
        offset += 2
        if (marker === 0xffe1) {
          if (view.getUint32((offset += 2), false) !== 0x45786966) {
            return {
              buffer: view.buffer,
              orientation: -1
            }
          }
          var little = view.getUint16((offset += 6), false) === 0x4949
          offset += view.getUint32(offset + 4, little)
          var tags = view.getUint16(offset, little)
          offset += 2
          for (var i = 0; i < tags; i++) {
            if (view.getUint16(offset + i * 12, little) === 0x0112) {
              const orientation = view.getUint16(offset + i * 12 + 8, little)
              view.setUint16(offset + i * 12 + 8, 1, little)
              return {
                buffer: view.buffer,
                orientation
              }
            }
          }
        } else if ((marker & 0xff00) !== 0xff00) {
          break
        } else {
          offset += view.getUint16(offset, false)
        }
      }
      return {
        buffer: view.buffer,
        orientation: -1
      }
    }
    //캔버스로 그려서 dataurl 로 뽑아내는 함수
    function drawAdjustImage(img, orientation) {
      const cnvs = document.createElement('canvas')
      const ctx = cnvs.getContext('2d')
      let dx = 0
      let dy = 0
      let dw
      let dh
      let deg = 0
      let vt = 1
      let hr = 1
      let rad
      let sin
      let cos
      cnvs.width = orientation >= 5 ? img.height : img.width
      cnvs.height = orientation >= 5 ? img.width : img.height
      switch (orientation) {
        case 2: // flip horizontal
          hr = -1
          dx = cnvs.width
          break
        case 3: // rotate 180 degrees
          deg = 180
          dx = cnvs.width
          dy = cnvs.height
          break
        case 4: // flip upside down
          vt = -1
          dy = cnvs.height
          break
        case 5: // flip upside down and rotate 90 degrees clock wise
          vt = -1
          deg = 90
          break
        case 6: // rotate 90 degrees clock wise
          deg = 90
          dx = cnvs.width
          break
        case 7: // flip upside down and rotate 270 degrees clock wise
          vt = -1
          deg = 270
          dx = cnvs.width
          dy = cnvs.height
          break
        case 8: // rotate 270 degrees clock wise
          deg = 270
          dy = cnvs.height
          break
      }
      rad = deg * (Math.PI / 180)
      sin = Math.sin(rad)
      cos = Math.cos(rad)
      ctx.setTransform(cos * hr, sin * hr, -sin * vt, cos * vt, dx, dy)
      dw = orientation >= 5 ? cnvs.height : cnvs.width
      dh = orientation >= 5 ? cnvs.width : cnvs.height
      ctx.drawImage(img, 0, 0, dw, dh)
      return cnvs.toDataURL('image/jpeg', 1.0)
    }

    reader.onload = function () {
      if (reader.result) {
        const originalBuffer = reader.result
        const {buffer, orientation} = getOrientation(originalBuffer)
        const blob = new Blob([buffer])
        //createObjectURL 주어진 객체를 가리키는 URL을 DOMString으로 반환합니다
        const originalCacheURL = (window.URL || window.webkitURL || window || {}).createObjectURL(file)
        const cacheURL = (window.URL || window.webkitURL || window || {}).createObjectURL(blob)
        const img = new Image()
        img.src = cacheURL

        //setTempPhoto(originalCacheURL)

        img.onload = async () => {
          const limitSize = 1280
          if (img.width > limitSize || img.height > limitSize) {
            img.width = img.width / 5
            img.height = img.height / 5
          }

          const encodedDataAsBase64 = drawAdjustImage(img, orientation)
          uploadImageToServer(encodedDataAsBase64)
        }
      }
    }
  }
  async function uploadImageToServer(imgData) {
    const {result, data} = await Api.image_upload({
      data: {
        dataURL: imgData,
        uploadType: 'profile'
      }
    })
    if (result === 'success') {
      dispatch({
        name: 'profImgUrl',
        value: data.path
      })
    } else {
      context.action.alert({
        msg: '사진 업로드에 실패하였습니다.\n다시 시도해주세요.'
      })
    }
  }
  useEffect(() => {
    if (profImgUrl.includes('https://')) uploadImageToServer(profImgUrl)
  }, [profImgUrl])

  //닉네임
  const validateNick = async () => {
    if (nickNm.length < 2 || nickNm.length > 20) {
      return setValidate({name: 'nickNm', check: false, text: '닉네임은 2~20자 이내로 입력해주세요.'})
    } else {
      const {result, code} = await Api.nickName_check({
        params: {
          nickNm: nickNm
        }
      })
      if (result === 'success' && code === '1') {
        return setValidate({name: 'nickNm', check: true})
      } else if (result === 'fail') {
        if (code === '0') {
          return setValidate({name: 'nickNm', check: false, text: '닉네임 중복입니다.'})
        } else {
          return setValidate({name: 'nickNm', check: false, text: '사용 불가능한 닉네임 입니다.'})
        }
      }
    }
  }

  //생년월일
  const birthChange = (birth) => {
    dispatch({name: 'birth', value: birth})
  }
  // const baseDateYear = moment(new Date()).format('YYYYMMDD').slice(0, 4) - 11
  const validateBirth = () => {
    if (birth === null) return setValidate({name: 'birth', check: false, text: '생년월일을 선택해주세요.'})
    return setValidate({name: 'birth', check: true})
    // const currentBirthYear = birth.slice(0, 4)
    // if (currentBirthYear <= baseDateYear) {
    //   return setValidate({name: 'birth', check: true})
    // } else {
    //   return setValidate({name: 'birth', check: false, text: '만 14세 이상만 가입 가능합니다.'})
    // }
  }

  //비밀번호
  const validatePwd = () => {
    const num = loginPwd.search(/[0-9]/g)
    const eng = loginPwd.search(/[a-zA-Z]/gi)
    const spe = loginPwd.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi)
    if (loginPwd.length < 8 || loginPwd.length > 20) {
      return setValidate({name: 'loginPwd', check: false, text: '비밀번호는 8~20자 이내로 입력해주세요.'})
    } else {
      if ((num < 0 && eng < 0) || (eng < 0 && spe < 0) || (spe < 0 && num < 0)) {
        return setValidate({
          name: 'loginPwd',
          check: false,
          text: '비밀번호는 영문/숫자/특수문자 중 2가지 이상 조합으로 입력해주세요.'
        })
      } else {
        return setValidate({name: 'loginPwd', check: true})
      }
    }
  }
  const validatePwdCheck = () => {
    if (loginPwd === loginPwdCheck) {
      return setValidate({name: 'loginPwdCheck', check: true})
    } else {
      return setValidate({name: 'loginPwdCheck', check: false, text: '비밀번호를 다시 확인해주세요.'})
    }
  }

  //성별
  const genderBtnHandle = (e) => {
    const {value} = e.target
    if (value === gender) return dispatch({name: 'gender', value: 'n'})
    dispatch({name: 'gender', value: value})
  }

  //약관동의
  const createTermsItem = () => {
    return termsItem.map((item, index) => {
      const termsName = index === 0 ? 'allTerm' : `term${index}`
      return (
        <div key={`term${index}`}>
          {/* <button className={`checkbox state-${changes[termsName]}`} name={termsName} onClick={termsBtnHandle}>
            {item}
          </button> */}
          <label htmlFor={`term${index}`} onClick={termsBtnHandle}>
            <input id={`term${index}`} name={termsName} className={`checkbox ${changes[termsName]}`} type="checkbox" />
            {item}
          </label>
          <button className={`more ${index === 0 ? termOpen : ''}`} name={termsName} onClick={termsMoreBtnHandle}></button>
        </div>
      )
    })
  }
  const termsBtnHandle = (e) => {
    const {name} = e.target
    dispatch({name: name, value: changes[name] === 'y' ? 'n' : 'y'})
  }
  const termsMoreBtnHandle = (e) => {
    const {name} = e.target
    switch (name) {
      case 'allTerm':
        return setTermOpen(!termOpen)
        break
      case 'term1':
        return context.action.updatePopup('TERMS', 'service')
        break
      case 'term2':
        return context.action.updatePopup('TERMS', 'privacy')
        break
      case 'term3':
        return context.action.updatePopup('TERMS', 'youthProtect')
        break
      case 'term4':
        return context.action.updatePopup('TERMS', 'operating')
        break
      default:
        break
    }
  }
  useEffect(() => {
    if (term1 === 'y' && term2 === 'y' && term3 === 'y' && term4 === 'y') return dispatch({name: 'allTerm', value: 'y'})
    dispatch({name: 'allTerm', value: 'n'})
  }, [term1, term2, term3, term4])
  const validateTerm = () => {
    if (term1 === 'n' || term2 === 'n' || term3 === 'n' || term4 === 'n') {
      return setValidate({name: 'term', check: false, text: '필수 약관에 모두 동의해주세요.'})
    } else if (term1 === 'y' || term2 === 'y' || term3 === 'y' || term4 === 'y') {
      return setValidate({name: 'term', check: true})
    }
  }

  //로그인
  async function loginFetch() {
    const loginInfo = await Api.member_login({
      data: {
        memType: changes.memType,
        memId: changes.memId,
        memPwd: changes.loginPwd
      }
    })

    if (loginInfo.result === 'success') {
      const {memNo} = loginInfo.data

      context.action.updateToken(loginInfo.data)
      const profileInfo = await Api.profile({params: {memNo}})
      if (profileInfo.result === 'success') {
        if (isHybrid()) {
          if (webview && webview === 'new') {
            Hybrid('GetLoginTokenNewWin', loginInfo.data)
          } else {
            Hybrid('GetLoginToken', loginInfo.data)
          }
        }

        if (redirect) {
          const decodedUrl = decodeURIComponent(redirect)
          return (window.location.href = decodedUrl)
        }
        context.action.updateProfile(profileInfo.data)
        return props.history.push('/')
      }
    } else if (loginInfo.result === 'fail') {
      context.action.alert({
        title: '로그인 실패',
        msg: `${loginInfo.message}`
      })
    }
  }

  //회원가입 Data fetch
  async function sighUpFetch() {
    const nativeTid = context.nativeTid == null || context.nativeTid == 'init' ? '' : context.nativeTid
    const {result, data, message} = await Api.member_join({
      data: {
        memType: changes.memType,
        memId: changes.memId,
        memPwd: changes.loginPwd,
        // gender: changes.gender,
        nickNm: changes.nickNm,
        birth: changes.birth,
        term1: changes.term1,
        term2: changes.term2,
        term3: changes.term3,
        term4: changes.term4,
        term5: 'y',
        profImg: changes.profImgUrl,
        profImgRacy: 3,
        nativeTid: nativeTid,
        os: context.customHeader.os
      }
    })
    if (result === 'success') {
      const cmd = 'CompleteRegistration';
      const successCallback = () => { // appVer 이상
        Utility.addAdsData(cmd);
      };
      const failCallback = async () => { // appVer 미만
        const successCallback2 = () => {
          Utility.oldAddAdsData(cmd);
        }

        const failCallback2 = () => {
          try {
            firebase.analytics().logEvent(cmd)
            Hybrid('adbrixEvent', data.adbrixData);
            fbq('track', cmd)
          } catch (e) {}
        }

        const targetVersion = isAndroid() ? '1.6.9' : '1.6.3';
        await Utility.compareAppVersion(targetVersion, successCallback2, failCallback2);
      }

      if(isHybrid()) {
        const targetVersion = isAndroid() ? '1.8.2' : '1.6.6';
        await Utility.compareAppVersion(targetVersion, successCallback, failCallback);
      }else {
        failCallback();
      }

      context.action.alert({
        callback: () => {
          //애드브릭스 이벤트 전달 => native에서 처리
          // if (data.adbrixData != '' && data.adbrixData != 'init') {
          //   Hybrid('adbrixEvent', data.adbrixData)
            // if (__NODE_ENV === 'dev') {
              // alert(JSON.stringify('adbrix in dev:' + JSON.stringify(data.adbrixData)));
            // }
          // }
          loginFetch()
        },
        msg: '회원가입 기념으로 달 1개를 선물로 드립니다.\n달라 즐겁게 사용하세요.'
      })
    } else {
      context.action.alert({
        msg: message
      })
      context.action.updateLogin(false)
    }
  }

  //회원가입 완료 버튼
  const signUp = () => {
    if (CMID !== true && memType === 'p') {
      return context.action.alert({
        msg: '휴대폰 본인인증을 진행해주세요.'
      })
    }
    validateNick()
    if(context.appInfo.showBirthForm) {
      validateBirth()
    }
    if (memType === 'p') {
      validatePwd()
      validatePwdCheck()
    }

    validateTerm()
  }

  const phoneCertification = () => {
    setStep(step + 1);
  }

  useEffect(() => {
    const validateKey = Object.keys(validate)
    //ios 이슈 수정
    const nickIndex = validateKey.indexOf('nickNm')
    const temp = validateKey[nickIndex]
    validateKey.splice(nickIndex, 1)
    validateKey.unshift(temp)
    for (let index = 0; index < validateKey.length; index++) {
      if (validate[validateKey[index]].check === false) {
        context.action.alert({
          msg: validate[validateKey[index]].text
        })
        break
      }
    }
  }, [validate.nickNm])

  useEffect(() => {
    //Facebook,Firebase 이벤트 호출
    try {
      fbq('track', 'Lead')
      firebase.analytics().logEvent('Lead')
      kakaoPixel('114527450721661229').participation()
    } catch (e) {}
  }, [])

  return (
    <div id='sign'>
      {
        step === 1 &&
          <SignField title="번호를 입력해주세요." btnFunction={phoneCertification}>
            <InputItem button={true} validate={validate.memId.check}>
              {validate.memId.text && <p className="helpText">{validate.memId.text}</p>}
              <div className="inputRow">
                <input
                  type="tel"
                  ref={memIdRef}
                  id="memId"
                  className={`inputfield ${auth ? "check" : ""}`}
                  name="memId"
                  placeholder="휴대폰 번호"
                  maxLength={11}
                  autoComplete="off"
                  value={memId}
                  onChange={(e) => dispatch(e.target)}
                />
                <button className={`certificationBtn ${btnState.memId ? "active" : ""}`} disabled={!btnState.memId} onClick={fetchSmsReq}>
                  인증요청
                </button>
              </div>
            </InputItem>
            <InputItem button={true} validate={validate.auth.check}>
              {validate.auth.text && <p className="helpText">{validate.auth.text}</p>}
              <div className="inputRow">
                <input
                  type="number"
                  ref={authRef}
                  id="auth"
                  className="inputfield"
                  name="auth"
                  placeholder="인증 번호 4자리"
                  autoComplete="off"
                  value={auth}
                  onChange={(e) => dispatch(e.target)}
                  disabled={true}
                />
              </div>
            </InputItem>
          </SignField>
      }
      {        
        step === 2 &&
          <SignField title="닉네임을 설정해주세요." btnFunction={phoneCertification}>
            <InputItem button={false} validate={validate.nickNm.check}>
              {validate.nickNm.text && <p className="helpText">{validate.nickNm.text}</p>}
              <div className="inputRow">
                <input
                  type="text"
                  id="nickNm"
                  className="inputfield"
                  name="nickNm"
                  placeholder="2~20자 한글/영문/숫자"
                  autoComplete="off"
                  maxLength={20}
                  value={nickNm}
                  onChange={(e) => dispatch(e.target)}
                />
              </div>
            </InputItem>
          </SignField>
      }
      {        
        step === 3 &&
          <SignField title="비밀번호를 설정해주세요." btnFunction={phoneCertification}>
            {memType === 'p' && (
               <>
                 <InputItem button={false} validate={validate.loginPwd.check}>
                   {validate.loginPwd.text && <p className="helpText">{validate.loginPwd.text}</p>}
                   <div className="inputRow">
                     <input
                       type="password"
                       id="loginPwd"
                       className="inputfield"
                       name="loginPwd"
                       placeholder="8~20자 영문/숫자/특수문자 중 2가지 이상"
                       autoComplete="off"
                       maxLength={20}
                       value={loginPwd}
                       onChange={(e) => dispatch(e.target)}
                     />
                   </div>
                 </InputItem>
                 <InputItem button={false} validate={validate.loginPwdCheck.check}>
                   {validate.loginPwdCheck.text && <p className="helpText">{validate.loginPwdCheck.text}</p>}
                   <div className="inputRow">
                     <input
                       type="password"
                       id="loginPwdCheck"
                       className="inputfield"
                       name="loginPwdCheck"
                       placeholder="비밀번호 다시 입력"
                       autoComplete="off"
                       maxLength={20}
                       value={loginPwdCheck}
                       onChange={(e) => dispatch(e.target)}
                     />
                   </div>
                 </InputItem>
               </>
             )}
          </SignField>
      }
      {        
        step === 4 &&
          <SignField title={`소셜 로그인 정보를\n입력해주세요.`} btnFunction={phoneCertification}>
            <InputItem button={false} validate={validate.nickNm.check}>
              {validate.nickNm.text && <p className="helpText">{validate.nickNm.text}</p>}
              <div className="inputRow">
                <input
                  type="text"
                  id="nickNm"
                  className="inputfield"
                  name="nickNm"
                  placeholder="소셜닉네임"
                  autoComplete="off"
                  maxLength={20}
                  value={nickNm}
                  onChange={(e) => dispatch(e.target)}
                />
              </div>
              <ProfileUpload
                imgUrl={profImgUrl ? (profImgUrl.includes('http') ? `${profImgUrl}` : `${PHOTO_SERVER}${profImgUrl}`) : ''}
                // imgUrl={profImgUrl ? `${PHOTO_SERVER}${profImgUrl}` : ''}
                className={memType !== 'p' && 'top'}>
                <label htmlFor="profileImg">
                  <div></div>
                  <span>클릭 이미지 파일 추가</span>
                </label>
                <input
                  type="file"
                  id="profileImg"
                  accept="image/jpg, image/jpeg, image/png"
                  onChange={(e) => {
                    uploadSingleFile(e)
                  }}
                />
              </ProfileUpload>
            </InputItem>            
          </SignField>  
      }
    </div>
    // <Layout status="no_gnb" header="회원가입">
    //   <input type="password" style={{width: '0px', padding: '0px', position: 'absolute'}} />
    //   <input type="password" style={{width: '0px', padding: '0px', position: 'absolute'}} />
    //   <Content>
    //     {/* 휴대폰 본인인증 -------------------------------------------------------- */}
    //     {memType === 'p' && (
    //       <>
    //         <InputItem button={true} validate={validate.memId.check}>
    //           <div className="layer">
    //             <label htmlFor="memId">휴대폰 번호</label>
    //             <input
    //               type="tel"
    //               ref={memIdRef}
    //               id="memId"
    //               name="memId"
    //               placeholder="휴대폰 번호를 입력해주세요"
    //               maxLength={11}
    //               autoComplete="off"
    //               value={memId}
    //               onChange={(e) => dispatch(e.target)}
    //             />
    //             <button disabled={!btnState.memId} onClick={fetchSmsReq}>
    //               인증요청
    //             </button>
    //           </div>
    //           {validate.memId.text && <p className="help-text">{validate.memId.text}</p>}
    //         </InputItem>
    //         <InputItem button={true} validate={validate.auth.check}>
    //           <div className="layer">
    //             <label htmlFor="auth">인증번호</label>
    //             <input
    //               type="number"
    //               ref={authRef}
    //               id="auth"
    //               name="auth"
    //               placeholder="인증번호를 입력해주세요"
    //               autoComplete="off"
    //               value={auth}
    //               onChange={(e) => dispatch(e.target)}
    //               disabled={true}
    //             />
    //             <span className="timer">{timeText}</span>
    //             <button disabled={!btnState.auth} onClick={fetchSmsCheck}>
    //               인증확인
    //             </button>
    //           </div>
    //           {validate.auth.text && <p className="help-text">{validate.auth.text}</p>}
    //         </InputItem>
    //       </>
    //     )}

    //     {/* 프로필 사진 ---------------------------------------------------------- */}
    //     <ProfileUpload
    //       imgUrl={profImgUrl ? (profImgUrl.includes('http') ? `${profImgUrl}` : `${PHOTO_SERVER}${profImgUrl}`) : ''}
    //       // imgUrl={profImgUrl ? `${PHOTO_SERVER}${profImgUrl}` : ''}
    //       className={memType !== 'p' && 'top'}>
    //       <label htmlFor="profileImg">
    //         <div></div>
    //         <span>클릭 이미지 파일 추가</span>
    //       </label>
    //       <input
    //         type="file"
    //         id="profileImg"
    //         accept="image/jpg, image/jpeg, image/png"
    //         onChange={(e) => {
    //           uploadSingleFile(e)
    //         }}
    //       />
    //       <p className="img-text">프로필 사진을 등록 해주세요</p>
    //     </ProfileUpload>

    //     {/* 닉네임 ---------------------------------------------------------- */}
    //     <InputItem button={false} validate={validate.nickNm.check}>
    //       <div className="layer">
    //         <label htmlFor="nickNm">닉네임</label>
    //         <input
    //           type="text"
    //           id="nickNm"
    //           name="nickNm"
    //           placeholder="최대 20자까지 입력"
    //           autoComplete="off"
    //           maxLength={20}
    //           value={nickNm}
    //           onChange={(e) => dispatch(e.target)}
    //         />
    //       </div>
    //       {validate.nickNm.text && <p className="help-text">{validate.nickNm.text}</p>}
    //     </InputItem>

    //     {/* 생년월일 ---------------------------------------------------------- */}
    //     {context.appInfo.showBirthForm &&
    //       <>
    //         <InputItem button={false} validate={validate.birth.check}>
    //           <div className="layer">
    //             <label htmlFor="birth">생년월일</label>
    //             <DatePicker id="birth" name="birth" value={birth} change={birthChange} />
    //           </div>
    //           {validate.birth.text && <p className="help-text">{validate.birth.text}</p>}
    //         </InputItem>
    //         <AgeGuidance />
    //       </>
    //     }

    //     {/* 비밀번호 ---------------------------------------------------------- */}
    //     {memType === 'p' && (
    //       <>
    //         <InputItem button={false} validate={validate.loginPwd.check}>
    //           <div className="layer">
    //             <label htmlFor="loginPwd">비밀번호</label>
    //             <input
    //               type="password"
    //               id="loginPwd"
    //               name="loginPwd"
    //               placeholder="8~20자 영문/숫자/특수문자 중 2가지 이상 조합"
    //               autoComplete="off"
    //               maxLength={20}
    //               value={loginPwd}
    //               onChange={(e) => dispatch(e.target)}
    //             />
    //           </div>
    //           {validate.loginPwd.text && <p className="help-text">{validate.loginPwd.text}</p>}
    //         </InputItem>
    //         <InputItem button={false} validate={validate.loginPwdCheck.check}>
    //           <div className="layer">
    //             <label htmlFor="loginPwdCheck">비밀번호 확인</label>
    //             <input
    //               type="password"
    //               id="loginPwdCheck"
    //               name="loginPwdCheck"
    //               placeholder="비밀번호를 한번 더 입력해주세요"
    //               autoComplete="off"
    //               maxLength={20}
    //               value={loginPwdCheck}
    //               onChange={(e) => dispatch(e.target)}
    //             />
    //           </div>
    //           {validate.loginPwdCheck.text && <p className="help-text">{validate.loginPwdCheck.text}</p>}
    //         </InputItem>
    //       </>
    //     )}

    //     {/* 성별 ---------------------------------------------------------- */}
    //     {/* <GenderInput gender={gender}>
    //       <button className="male" value="m" onClick={genderBtnHandle}>
    //         남자
    //         <img src={IcoMale} />
    //       </button>
    //       <button className="female" value="f" onClick={genderBtnHandle}>
    //         여자
    //         <img src={IcoFemale} />
    //       </button>
    //     </GenderInput> */}

    //     {/* 약관 ---------------------------------------------------------- */}
    //     <TermsInput openState={termOpen}>{createTermsItem()}</TermsInput>

    //     <button className="join-btn" onClick={signUp}>
    //       회원가입
    //     </button>
    //   </Content>
    // </Layout>
  )
}

const AgeGuidance = () => {
  return (
    <p className="birthText">
      * 달라는 만 14세 이상부터 이용 가능한 서비스입니다.
      <br />* 만 14세 미만일 경우 서비스 이용이 제한됩니다.
    </p>
  )
}
const InputItem = styled.section`

`

const Content = styled.section`
  padding: 12px 16px;
  background: #eeeeee;
  .join-btn {
    width: 100%;
    height: 44px;
    margin-top: 32px;
    border-radius: 12px;
    color: #fff;
    font-weight: bold;
    font-size: 18px;
    line-height: 44px;
    background: ${COLOR_MAIN};
  }
  .birthText {
    padding: 3px 0 5px 5px;
    font-size: 12px;
    letter-spacing: -0.3px;
    color: #FF3C7B;
  }
`
const ProfileUpload = styled.div`
  margin-bottom: 24px;
  text-align: center;
  &.top {
    margin-top: 10px;
  }
  input {
    position: absolute;
    height: 0;
    width: 0;
  }
  div {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    border: 1px solid #202020;
    background: url(${(props) => (props.imgUrl ? props.imgUrl : IcoProfile)}) no-repeat center center / cover;
    background-size: ${(props) => (props.imgUrl ? 'cover' : '73px 73px')};
  }
  div.on {
    img {
      display: none;
    }
  }
  label {
    display: block;
    position: relative;
    width: 72px;
    margin: 0 auto;
    cursor: pointer;

    span {
      display: block;
      position: absolute;
      bottom: -5px;
      right: -5px;
      width: 30px;
      height: 30px;
      background: url(${IcoCamera}) no-repeat center / cover;
      text-indent: -9999px;
    }
  }

  .img-text {
    padding-top: 8px;
    font-size: 14px;
    color: ${COLOR_MAIN};
    font-weight: 600;
    letter-spacing: -0.5px;
    text-align: center;
    transform: skew(-0.03deg);
  }
`

const GenderInput = styled.div`
  display: flex;
  height: 44px;
  margin: 4px 0;
  background: #fff;
  border-radius: 12px;

  button {
    position: relative;
    width: calc(50% + 1px);
    border: 1px solid #e0e0e0;
    font-size: 16px;
    color: #000;
    font-weight: bold;
    img {
      padding: 3px 0 0 4px;
    }
  }

  button:after {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    content: '';
  }

  button.male {
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    border: ${(props) => props.gender === 'm' && '1px solid #000'};
    z-index: ${(props) => props.gender === 'm' && '2'};
    background: ${(props) => props.gender === 'f' && '#f5f5f5'};
    color: ${(props) => props.gender === 'f' && '#bdbdbd'};
  }

  button.female {
    margin-left: -1px;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    border: ${(props) => props.gender === 'f' && '1px solid #000'};
    z-index: ${(props) => props.gender === 'f' && '2'};
    background: ${(props) => props.gender === 'm' && '#f5f5f5'};
    color: ${(props) => props.gender === 'm' && '#bdbdbd'};
  }
`

const TermsInput = styled.div`
  overflow: hidden;
  height: ${(props) => (props.openState ? '222px' : '46px')};
  margin: 12px 0;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  transition: height 0.5s ease-in-out;

  div {
    display: flex;
    height: 44px;
    padding: 6px 10px;
    border-top: 1px solid #e0e0e0;
    background: #fff;
    label {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .checkbox {
      width: 20px;
      height: 20px;
      margin-right: 10px;
      position: relative;
      overflow: hidden;
      border-radius: 4px;
      appearance: none;
      border: none;
      outline: none;
      cursor: pointer;
      border-radius: 4px;
      border: 1px solid #9e9e9e;
      background-color: #ffffff;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;

      &::before {
        content: '';
        position: absolute;
        width: 13%;
        height: 50%;
        top: 25%;
        left: 57%;
        background-color: #9e9e9e;
        -ms-transform: rotate(45deg); /* IE 9 */
        -webkit-transform: rotate(45deg); /* Chrome, Safari, Opera */
        transform: rotate(45deg);
        border-radius: 10px;
      }

      &::after {
        content: '';
        position: absolute;
        width: 40%;
        height: 13%;
        background-color: #9e9e9e;
        top: 50%;
        left: 17%;
        -ms-transform: rotate(45deg); /* IE 9 */
        -webkit-transform: rotate(45deg); /* Chrome, Safari, Opera */
        transform: rotate(45deg);
        border-radius: 10px;
      }

      &.y {
        border-color: #fff;
        background-color: ${(props) => (props.bgColor ? `${props.bgColor}` : '#FF3C7B')};
        transition: 0.2s all ease 0s;
        border: 1px solid #FF3C7B;

        &::before,
        &::after {
          background-color: #fff;
        }
      }
    }

    /* button.checkbox {
      height: 32px;
      line-height: 32px;
      padding-left: 34px;
      font-size: 14px;
      color: #757575;

      &.state-y {
        background: url(${IcoCheckOn}) no-repeat 0 center;
      }
      &.state-n {
        background: url(${IcoCheckOff}) no-repeat 0 center;
      }
    } */
    button.more {
      width: 32px;
      height: 32px;
      margin-right: -5px;
      margin-left: auto;
      background: url(${IcoArrow}) no-repeat center;
      &.true {
        transform: rotate(-90deg);
      }
      &.false {
        transform: rotate(90deg);
      }
    }
  }
  div:first-child {
    border-top: 0;
    button.checkbox {
      font-size: 16px;
      color: #000;
      font-weight: bold;
    }
  }
`
