import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import qs from 'query-string'
import {Hybrid, isHybrid} from 'context/hybrid'

//components
import PureLayout from 'pages/common/layout/new_pure.js'
import Utility from 'components/lib/utility'
import Datepicker from './style-datepicker'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, PHOTO_SERVER, WIDTH_MOBILE_S} from 'context/config'
import moment from 'moment'
import Api from 'context/api'
import {Context} from 'context'
import _ from 'lodash'

let intervalId = null
let pickerHolder = true

export default props => {
  let snsInfo = qs.parse(location.search)
  const {webview, redirect} = qs.parse(location.search)

  if (_.hasIn(snsInfo, 'nickNm')) {
    snsInfo = {...snsInfo, nickNm: snsInfo.nickNm.replace(/(\s*)/g, '')}
  }
  if (_.hasIn(snsInfo, 'profImgUrl') && snsInfo.profImgUrl.includes('http://')) {
    snsInfo = {...snsInfo, profImgUrl: snsInfo.profImgUrl.replace('http://', 'https://')}
  }

  //context
  const context = useContext(Context)
  const globalCtx = useContext(Context)

  //useState
  const [allTerm, setAllTerm] = useState(false) // 약관동의 전체 체크
  const [boxState, setBoxState] = useState(true) // 약관동의 박스 열고닫음 상태값
  const [validate, setValidate] = useState({
    // 유효성 체크
    memId: false,
    loginPwd: false,
    loginPwdCheck: false,
    nickNm: false,
    birth: false,
    term: false, // 약관동의는 필수만 체크하기
    auth: false
  })
  const [validatePass, setValidatePass] = useState(false) // 유효성 모두 통과 여부. 회원가입 버튼 활성시 쓰임
  const [currentPwd, setCurrentPwd] = useState() // 비밀번호 도움 텍스트 값. html에 뿌려줄 state
  const [currentPwdCheck, setCurrentPwdCheck] = useState() // 비밀번호 확인 도움 텍스트 값.
  const [currentNick, setCurrentNick] = useState() // 닉네임 확인 도움 텍스트 값.
  const [currentBirth, setCurrentBirth] = useState() // 생년월일 확인 도움 텍스트 값
  const [currentAuth1, setCurrentAuth1] = useState() // 휴대폰인증1 텍스트값
  const [currentAuth2, setCurrentAuth2] = useState() // 휴대폰인증2 텍스트값
  const [currentAuthBtn, setCurrentAuthBtn] = useState({
    request: true, //버튼 disable true
    check: true
  }) // 인증확인 버튼
  const [imgData, setImgData] = useState()
  const [thisTimer, setThisTimer] = useState()
  const [timeText, setTimeText] = useState()
  const [pickerState, setPickerState] = useState(true)
  const [nickCheck, setNickSheck] = useState()
  let setTime = 300

  //포토서버에 올라간 디폴트 이미지
  const defaultImage = `${PHOTO_SERVER}/profile_3/profile_n.png`
  const defaultImagePath = defaultImage.replace(`${PHOTO_SERVER}`, '')

  //생년월일 유효성에서 계산할 현재 년도 date
  const d = new Date()
  const date = moment(d).format('YYYYMMDD')
  const dateYear = date.slice(0, 4) - 17
  let dateDefault = ''

  // changes 초기값 셋팅
  const [changes, setChanges] = useState({
    memId: '',
    loginPwd: '',
    loginPwdCheck: '',
    nickNm: '',
    name: '',
    birth: '',
    gender: 'n',
    image: '',
    memType: 'p',
    term1: 'n',
    term2: 'n',
    term3: 'n',
    term4: 'n',
    term5: 'n',
    auth: '',
    CMID: '',
    osName: context.customHeader.os,
    ...snsInfo
  })

  const onLoginHandleChange = e => {
    //대소문자 구분없음, 소문자만 입력
    if (e.target.name == 'loginPwd' || e.target.name == 'loginPwdCheck') {
      e.target.value = e.target.value.toLowerCase()
      setChanges({
        ...changes,
        [e.target.name]: e.target.value
      })
    }

    //유효성검사
    if (e.target.name == 'loginPwd') {
      validatePwd(e.target.value)
    } else if (e.target.name == 'memId') {
      validateID(e.target.value)
    } else if (e.target.name == 'nickNm') {
      validateNick(e.target.value.replace(/(\s*)/g, ''))
      //validateNick(e.target.value)
    } else if (e.target.name == 'auth') {
      setChanges({
        ...changes,
        [e.target.name]: e.target.value
      })
      if (e.target.value.length == 6) {
        if (changes.CMID) {
          setCurrentAuthBtn({
            request: currentAuthBtn.request,
            check: false
          })
        }
        e.target.blur()
      } else if (e.target.value.length > 6) {
        setChanges({
          ...changes,
          [e.target.name]: e.target.value.slice(0, -1)
        })
      }
    } else if (e.target.name == 'gender') {
      let thisGender = e.target.value
      if (e.target.defaultChecked) {
        thisGender = 'n'
      }
      setChanges({
        ...changes,
        [e.target.name]: thisGender
      })
    } else {
      setChanges({
        ...changes,
        [e.target.name]: e.target.value
      })
    }
  }

  //---------------------------------------------------------------------
  //유효성 검사 함수

  const validatePwd = pwdEntered => {
    //비밀번호 유효성 체크 로직 (숫자,영문,특수문자 중 2가지 이상 조합, 공백 체크)
    let pw = pwdEntered
    let blank_pattern = pw.search(/[\s]/g)
    let num = pw.search(/[0-9]/g)
    let kor = pw.search(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/)
    let eng = pw.search(/[a-zA-Z]/gi)
    let spe = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi)

    if (blank_pattern != -1) {
      var pw2 = pw.substring(0, pw.length - 1)
      setChanges({
        ...changes,
        loginPwd: pw2
      })
    }
    if (pw.length == 0) {
      setValidate({
        ...validate,
        loginPwd: false
      })
      setCurrentPwd('')
    } else {
      if (kor > 0) {
        setValidate({
          ...validate,
          loginPwd: false
        })
        setCurrentPwd('영문/숫자/특수문자만 입력가능합니다.')
      } else {
        if (pw.length > 7 && pw.length < 21) {
          //영문,숫자,특수문자 중 2가지 이상을 혼합 체크 로직
          if ((num < 0 && eng < 0) || (eng < 0 && spe < 0) || (spe < 0 && num < 0)) {
            setValidate({
              ...validate,
              loginPwd: false
            })
            setCurrentPwd('2가지 이상 조합으로 입력하세요.')
          } else {
            setValidate({
              ...validate,
              loginPwd: true
            })
            setCurrentPwd('사용 가능한 비밀번호 입니다.')
          }
        } else if (pw.length > 20) {
          setValidate({
            ...validate,
            loginPwd: false
          })
          setCurrentPwd('최대 20자 까지 입력하세요.')
        } else {
          setValidate({
            ...validate,
            loginPwd: false
          })
          setCurrentPwd('최소 8자 이상 입력하세요.')
        }
      }
    }
  }

  const validateID = idEntered => {
    //휴대폰 번호 유효성 검사 오직 숫자만 가능
    let rgEx = /(01[0123456789])(\d{4}|\d{3})\d{4}$/g
    const memIdVal = idEntered
    setChanges({
      ...changes,
      memId: memIdVal
    })
    if (!(memIdVal == undefined)) {
      if (memIdVal.length >= 11) {
        if (!rgEx.test(memIdVal)) {
          setCurrentAuth1('올바른 휴대폰 번호가 아닙니다.')
          setCurrentAuthBtn({
            request: true,
            check: true
          })
        } else {
          setCurrentAuthBtn({
            request: false,
            check: true
          })
        }
      } else if (memIdVal.length < 12) {
        setValidate({
          ...validate,
          memId: false
        })
        setCurrentAuthBtn({
          request: true,
          check: true
        })
        setCurrentAuth1('')
        document.getElementsByClassName('auth-btn1')[0].innerText = '인증요청'
        clearInterval(intervalId)
        document.getElementsByClassName('timer')[0].innerHTML = ''
      }
    }
  }

  const validateNick = async (nickEntered, type) => {
    let nm = nickEntered
    if (type !== 'sns') {
      setChanges({
        ...changes,
        nickNm: nm
      })
    }

    let nmVal = {nickNm: false}
    if (changes.nickNm.length == 0 && nm.length == 0) {
      setValidate({
        ...validate,
        nickNm: false
      })
      setCurrentNick('')
    } else {
      if (nm.length <= 2) {
        setCurrentNick('최소 2자 이상 입력해주세요.')
      } else if (nm.length > 2 && nm.length < 21) {
        const resNick = await Api.nickName_check({
          params: {
            nickNm: nickEntered
          }
        })
        if (resNick) {
          if (resNick.result === 'success') {
            if (resNick.code == '1') {
              nmVal = {...nmVal, nickNm: true}
              setCurrentNick('사용 가능한 닉네임 입니다.')
            }
          } else if (resNick.result === 'fail') {
            nmVal = {...nmVal, nickNm: false}
            if (resNick.code == '0') {
              setCurrentNick('닉네임 중복입니다.')
            } else {
              setCurrentNick('사용 불가능한 닉네임 입니다.')
              context.action.alert({
                msg: resNick.message
              })
            }
          }
        }
        ///////////////////////////////////
      } else if (nm.length > 20) {
        setCurrentNick('최대 20자 까지 입력이 가능합니다.')
      }
    }
    setValidate({
      ...validate,
      ...nmVal
    })
  }

  //---------------------------------------------------------------------
  // input file에서 이미지 업로드했을때 파일객체 dataURL로 값 셋팅
  function uploadSingleFile(e) {
    let reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    const file = e.target.files[0]
    const fileName = file.name
    const fileSplited = fileName.split('.')
    const fileExtension = fileSplited.pop()
    const extValidator = ext => {
      const list = ['jpg', 'jpeg', 'png']
      return list.includes(ext)
    }

    if (!extValidator(fileExtension)) {
      return context.action.alert({
        msg: 'jpg, png 이미지만 사용 가능합니다.'
      })
    }
    reader.onload = function() {
      if (reader.result) {
        setImgData(reader.result)
      } else {
      }
    }
  }

  // term  value값 n,y로 리턴수정
  const termHandle = value => {
    return value == 'y' ? 'n' : 'y'
  }

  // 약관 전체 동의 체크 시 실행
  const selectAllTerm = () => {
    setAllTerm(!allTerm)
    if (!allTerm) {
      setChanges({
        ...changes,
        term1: 'y',
        term2: 'y',
        term3: 'y',
        term4: 'y',
        term5: 'y'
      })
      setValidate({...validate, term: true})
    } else {
      setChanges({
        ...changes,
        term1: 'n',
        term2: 'n',
        term3: 'n',
        term4: 'n',
        term5: 'n'
      })
      setValidate({...validate, term: false})
    }
  }

  // @todo 약관 동의 하나씩 모두 체크, 체크해제 했을때 전체 동의 체크 작동
  const termCheckHandle = e => {
    onLoginHandleChange(e)
  }

  //datepicker에서 올려준 값 받아서 birth 바로 변경하기
  const pickerOnChange = value => {
    if (changes.birth == '') {
      dateDefault = value
    } else {
      validateBirth(value)
    }
  }

  const validateBirth = value => {
    let year = value.slice(0, 4)

    if (year == '') {
    } else if (year <= dateYear || value == date) {
      setCurrentBirth('')
      setValidate({
        ...validate,
        birth: true
      })
      if (pickerHolder) {
        pickerHolder = false
        setPickerState(true)
      } else {
        setPickerState(false)
      }
      setChanges({
        ...changes,
        birth: value
      })
    } else {
      if (pickerHolder) {
        pickerHolder = false
      }
      setCurrentBirth('17세 이상만 가입 가능합니다.')
      setValidate({
        ...validate,
        birth: false
      })
      setPickerState(false)
    }
  }

  //---------------------------------------------------------------------
  //fetchData
  const fetchPhoneLogin = async (phone, pw) => {
    const loginInfo = await Api.member_login({
      data: {
        memType: changes.memType,
        memId: changes.memId,
        memPwd: changes.loginPwd
      }
    })

    if (loginInfo.result === 'success') {
      const {memNo} = loginInfo.data
      globalCtx.action.updateToken(loginInfo.data)
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
        globalCtx.action.updateProfile(profileInfo.data)
        return props.history.push('/')
      }
    } else if (loginInfo.result === 'fail') {
      globalCtx.action.alert({
        title: '로그인 실패',
        msg: `${loginInfo.message}`
      })
    }
  }

  async function fetchData() {
    let resultImg = ''
    if (imgData == defaultImage) {
      resultImg = defaultImagePath
    } else {
      const resUpload = await Api.image_upload({
        data: {
          file: '',
          dataURL: imgData,
          imageURL: '',
          uploadType: 'profile'
        }
      })
      if (resUpload) {
        if (resUpload.code == 0 || resUpload.result === 'success') {
          resultImg = resUpload.data.path
        } else {
          resultImg = defaultImagePath
          context.action.alert({
            msg: resUpload.message
          })
        }
      }
    }

    //업로드 성공, 실패 여부로 이미지 값 다시 셋팅해준 후 member_join은 무조건 날리기
    const memId = changes.memId.replace(/-/g, '')
    const res = await Api.member_join({
      data: {
        memType: changes.memType,
        memId: memId,
        memPwd: changes.loginPwd,
        gender: changes.gender,
        nickNm: changes.nickNm,
        birth: changes.birth,
        term1: changes.term1,
        term2: changes.term2,
        term3: changes.term3,
        term4: changes.term4,
        term5: changes.term5,
        name: changes.name,
        profImg: resultImg,
        profImgRacy: 3,
        email: '',
        os: changes.osName
      }
    })
    if (res && res.code) {
      if (res.code == 0) {
        //alert(res.message)
        context.action.alert({
          callback: () => {
            fetchPhoneLogin()
          },
          msg: '회원가입 기념으로 달 1개를 선물로 드립니다.\n달빛라이브 즐겁게 사용하세요.'
        })
      } else {
        context.action.alert({
          msg: res.message
        })
        context.action.updateLogin(false)
      }
    } //(res && res.code)
  }

  let validateSetting = {}

  async function fetchAuth() {
    const resAuth = await Api.sms_request({
      data: {
        phoneNo: changes.memId,
        authType: 0
      }
    })
    if (resAuth.result === 'success') {
      setValidate({
        ...validate,
        memId: true,
        auth: false
      })
      setChanges({...changes, CMID: resAuth.data.CMID})
      setCurrentAuth1('인증번호 요청이 완료되었습니다.')
      document.getElementsByName('memId')[0].disabled = true
      setCurrentAuth2('')
      clearInterval(intervalId)
      setTime = 300
      setCurrentAuthBtn({
        request: true,
        check: true
      })

      intervalId = setInterval(() => {
        let timer = `${Utility.leadingZeros(Math.floor(setTime / 60), 2)}:${Utility.leadingZeros(setTime % 60, 2)}`
        setTimeText(timer)
        setTime--
        if (setTime < 0) {
          clearInterval(intervalId)
          setCurrentAuth2('인증시간이 초과되었습니다.')
          document.getElementsByName('auth')[0].disabled = true
          setCurrentAuthBtn({
            request: true,
            check: true
          })
        }
      }, 1000)
    } else {
      setCurrentAuth1(resAuth.message)
    }
  }

  async function fetchAuthCheck() {
    const resCheck = await Api.sms_check({
      data: {
        CMID: changes.CMID,
        code: Number(changes.auth)
      }
    })
    if (resCheck.result === 'success') {
      setValidate({...validate, auth: true})
      setCurrentAuth2(resCheck.message)
      clearInterval(intervalId)
      document.getElementsByClassName('timer')[0].innerHTML = ''
      document.getElementsByName('auth')[0].disabled = true
      setCurrentAuthBtn({
        request: true,
        check: true
      })
    } else {
      setCurrentAuth2('인증번호(가) 일치하지 않습니다.')
    }
  }

  useEffect(() => {
    context.action.updateGnbVisible(false)
    let firstSetting = {}
    if (!changes.image && !changes.birth) {
      if (_.hasIn(changes, 'profImgUrl')) {
        firstSetting = {birth: dateDefault, image: changes.profImgUrl}
        setImgData(changes.profImgUrl)
      } else {
        firstSetting = {birth: dateDefault, image: defaultImage}
        setImgData(firstSetting.image)
      }
    } else if (!changes.image) {
      if (_.hasIn(changes, 'profImgUrl')) {
        firstSetting = {
          image: changes.profImgUrl
        }
        setImgData(changes.profImgUrl)
      } else {
        firstSetting = {
          image: defaultImage
        }
        setImgData(defaultImage)
      }
    } else if (!changes.birth) {
      firstSetting = {birth: dateDefault}
    }
    setChanges({
      ...changes,
      ...firstSetting
    })

    if (changes.memType !== 'p') {
      changes.nickNm && validateNick(changes.nickNm, 'sns')
    }
  }, [])

  useEffect(() => {
    if (!(changes.memType == 'p')) {
      if (changes.term1 == 'y' && changes.term2 == 'y' && changes.term3 == 'y' && changes.term4 == 'y') {
        validateSetting = {
          ...validateSetting,
          memId: true,
          loginPwd: true,
          loginPwdCheck: true,
          term: true
        }
        setAllTerm(true)
      } else {
        validateSetting = {
          ...validateSetting,
          memId: true,
          loginPwd: true,
          loginPwdCheck: true,
          term: false
        }
        setAllTerm(false)
      }
      setValidate({
        ...validate,
        ...validateSetting
      })
    } else {
      if (changes.term1 == 'y' && changes.term2 == 'y' && changes.term3 == 'y' && changes.term4 == 'y') {
        setAllTerm(true)
        setValidate({...validate, term: true})
      } else {
        setAllTerm(false)
        setValidate({...validate, term: false})
      }
    }
  }, [changes])

  //비밀번호 입력때마다 일치 체크
  useEffect(() => {
    if (changes.loginPwdCheck.length == 0) {
      setCurrentPwdCheck('')
      setValidate({
        ...validate,
        loginPwdCheck: false
      })
    } else {
      if (changes.loginPwd == changes.loginPwdCheck) {
        setCurrentPwdCheck('비밀번호가 일치합니다.')
        setValidate({
          ...validate,
          loginPwdCheck: true
        })
      } else {
        setCurrentPwdCheck('비밀번호가 일치하지 않습니다.')
        setValidate({
          ...validate,
          loginPwdCheck: false
        })
      }
    }
  }, [changes.loginPwdCheck, changes.loginPwd])

  //유효성 전부 체크되었을 때 회원가입 완료 버튼 활성화 시키기
  useEffect(() => {
    // console.log(JSON.stringify(validate, null, 1))
    if (changes.memType == 'p') {
      if (
        validate.memId &&
        validate.loginPwd &&
        validate.loginPwdCheck &&
        validate.nickNm &&
        validate.birth &&
        validate.term &&
        validate.auth
      ) {
        setValidatePass(true)
      } else {
        setValidatePass(false)
      }
    } else {
      if (validate.nickNm && validate.birth && validate.term) {
        setValidatePass(true)
      } else {
        setValidatePass(false)
      }
    }
  }, [validate])

  return (
    <PureLayout>
      <SignUpWrap>
        {changes.memType == 'p' && (
          <>
            <PhoneAuth className="top">
              <label className="input-label require" htmlFor="memId" style={{maginTop: '0px'}}>
                휴대폰 번호
              </label>
              <input
                type="tel"
                id="memId"
                name="memId"
                value={changes.memId}
                onChange={onLoginHandleChange}
                placeholder="휴대폰 번호를 입력해주세요"
                className="auth"
                maxLength="11"
              />
              <button
                className="auth-btn1"
                disabled={currentAuthBtn.request}
                onClick={() => {
                  fetchAuth()
                }}>
                인증요청
              </button>
            </PhoneAuth>
            {currentAuth1 && (
              <HelpText state={validate.memId} className={validate.memId ? 'pass' : 'help'}>
                {currentAuth1}
              </HelpText>
            )}
            <PhoneAuth>
              <label className="input-label require" htmlFor="auth">
                인증번호
              </label>
              <input
                type="number"
                name="auth"
                id="auth"
                placeholder="인증번호를 입력해주세요"
                className="auth"
                value={changes.auth}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                inputMode="decimal"
                pattern="\d*"
                onChange={onLoginHandleChange}
              />
              <span className="timer">{timeText}</span>
              <button
                className="auth-btn2"
                disabled={currentAuthBtn.check}
                onClick={() => {
                  fetchAuthCheck()
                }}>
                인증확인
              </button>
            </PhoneAuth>
            {currentAuth2 && (
              <HelpText state={validate.auth} className={validate.auth ? 'pass' : 'help'}>
                {currentAuth2}
              </HelpText>
            )}
          </>
        )}
        {/* 프로필 이미지 등록, 전화번호 가입시에만 노출 */}
        <ProfileUpload imgUrl={imgData} className={changes.memType !== 'p' && 'top'}>
          <label htmlFor="profileImg">
            <div></div>
            <span>클릭 이미지 파일 추가</span>
          </label>
          <input
            type="file"
            id="profileImg"
            accept="image/jpg, image/jpeg, image/png"
            onChange={e => {
              uploadSingleFile(e)
            }}
          />
          <p className="img-text">프로필 사진을 등록(선택사항)</p>
        </ProfileUpload>
        {/* 닉네임 */}
        <InputWrap type="닉네임">
          <label className="input-label require" htmlFor="nickNm">
            닉네임
          </label>
          <input
            autoComplete="off"
            type="text"
            name="nickNm"
            id="nickNm"
            value={changes.nickNm}
            onChange={onLoginHandleChange}
            placeholder="닉네임은 2~20자 이내로 입력해주세요"
          />
          {currentNick && (
            <HelpText state={validate.nickNm} className={validate.nickNm ? 'pass' : 'help'}>
              {currentNick}
            </HelpText>
          )}
        </InputWrap>
        {/* 비밀번호, 전화번호 가입시에만 노출 */}
        {changes.memType == 'p' && (
          <InputWrap>
            <label className="input-label require" htmlFor="loginPwd">
              비밀번호
            </label>
            <input
              autoComplete="new-password"
              type="password"
              name="loginPwd"
              id="loginPwd"
              value={changes.loginPwd}
              onChange={onLoginHandleChange}
              placeholder="8~20자 영문/숫자/특수문자 중 2가지 이상 조합"
              maxLength="20"
            />
            {currentPwd && (
              <HelpText state={validate.loginPwd} className={validate.loginPwd ? 'pass' : 'help'}>
                {currentPwd}
              </HelpText>
            )}
            <label className="input-label require" htmlFor="loginPwdCheck" style={{marginTop: '16px'}}>
              비밀번호 확인
            </label>
            <input
              type="password"
              name="loginPwdCheck"
              defaultValue={changes.loginPwdCheck}
              onChange={onLoginHandleChange}
              placeholder="비밀번호를 다시 확인해주세요"
              maxLength="20"
            />
            {currentPwdCheck && (
              <HelpText state={validate.loginPwdCheck} className={validate.loginPwdCheck ? 'pass' : 'help'}>
                {currentPwdCheck}
              </HelpText>
            )}
          </InputWrap>
        )}
        {/* 생년월일 */}
        <InputWrap>
          <label className="input-label require">생년월일</label>
          <Datepicker
            text="YYYY / MM / DD"
            name="birth"
            value={changes.birth}
            change={pickerOnChange}
            placeholder="YYYY / MM / DD"
            pickerState={pickerState}
          />

          {currentBirth && (
            <HelpText state={validate.birth} className={validate.birth ? 'pass' : 'help'}>
              {currentBirth}
            </HelpText>
          )}
        </InputWrap>
        {/* 성별 */}
        <InputWrap>
          <label className="input-label">
            성별 <span>(선택사항)</span>
          </label>
          <GenderRadio>
            <label htmlFor="genderMale" className={changes.gender == 'm' ? 'on' : 'off'}>
              <input
                type="checkbox"
                name="gender"
                id="genderMale"
                value="m"
                defaultChecked={changes.gender === 'm'}
                onChange={onLoginHandleChange}
              />
              남자
            </label>
            <label htmlFor="genderFemale" className={changes.gender == 'f' ? 'on' : 'off'}>
              <input
                type="checkbox"
                name="gender"
                id="genderFemale"
                value="f"
                defaultChecked={changes.gender === 'f'}
                onChange={onLoginHandleChange}
              />
              여자
            </label>
          </GenderRadio>
        </InputWrap>
        {/* 약관동의 */}
        <CheckWrap className={boxState ? 'on' : ''}>
          <div>
            <input type="checkbox" name="allTerm" id="allTerm" checked={allTerm} onChange={selectAllTerm} />{' '}
            <label htmlFor="allTerm">약관 전체 동의</label>
            <button
              className={boxState ? 'on' : 'off'}
              onClick={() => {
                setBoxState(!boxState)
              }}>
              펼치기
            </button>
          </div>
          <CheckBox>
            <div>
              <input
                type="checkbox"
                name="term1"
                id="term1"
                checked={changes.term1 == 'y' ? true : false}
                value={termHandle(changes.term1)}
                onChange={termCheckHandle}
              />
              <label htmlFor="term1">
                <span>[필수]</span>서비스 이용약관 동의
              </label>
              <button
                onClick={() => {
                  context.action.updatePopup('TERMS', 'service')
                }}>
                자세히 보기
              </button>
            </div>
            <div>
              <input
                type="checkbox"
                name="term2"
                id="term2"
                checked={changes.term2 == 'y' ? true : false}
                value={termHandle(changes.term2)}
                onChange={termCheckHandle}
              />
              <label htmlFor="term2">
                <span>[필수]</span>개인정보 취급방침
              </label>
              <button
                onClick={() => {
                  context.action.updatePopup('TERMS', 'privacy')
                }}>
                자세히 보기
              </button>
            </div>
            <div>
              <input
                type="checkbox"
                name="term3"
                id="term3"
                checked={changes.term3 == 'y' ? true : false}
                value={termHandle(changes.term3)}
                onChange={termCheckHandle}
              />
              <label htmlFor="term3">
                <span>[필수]</span>청소년 보호정책
              </label>
              <button
                onClick={() => {
                  context.action.updatePopup('TERMS', 'youthProtect')
                }}>
                자세히 보기
              </button>
            </div>
            <div>
              <input
                type="checkbox"
                name="term4"
                id="term4"
                checked={changes.term4 == 'y' ? true : false}
                value={termHandle(changes.term4)}
                onChange={termCheckHandle}
              />
              <label htmlFor="term4">
                <span>[필수]</span>운영정책
              </label>
              <button
                onClick={() => {
                  context.action.updatePopup('TERMS', 'operating')
                }}>
                자세히 보기
              </button>
            </div>
          </CheckBox>
        </CheckWrap>
        <Button
          onClick={() => {
            if (!validatePass) {
              let message = ''
              if (!validate.auth && changes.memType === 'p') {
                message = '휴대폰 본인인증을 진행해주세요.'
              } else if (!validate.nickNm) {
                message = '닉네임은 2~20자 이내로 입력해주세요.'
              } else if (!validate.loginPwd && changes.memType === 'p') {
                message = '비밀번호는 8~20자 영문/숫자/특수문자 중 2가지 이상 조합으로 입력해주세요.'
              } else if (!validate.loginPwdCheck && changes.memType === 'p') {
                message = '비밀번호를 다시 확인해주세요.'
              } else if (!validate.birth) {
                message = '생년월일을 선택해주세요.'
              } else if (!validate.term) {
                message = '필수 약관에 모두 동의해주세요.'
              }
              context.action.alert({
                callback: () => {
                  return null
                },
                msg: `${message}`
              })
            } else {
              fetchData()
            }
          }}
          className={`${validatePass ? 'on' : 'off'}`}>
          회원가입
        </Button>
      </SignUpWrap>
    </PureLayout>
  )
}

const SignUpWrap = styled.div`
  .input-label {
    display: block;
    width: 100%;
    color: #424242;
    font-size: 14px;
    line-height: 16px;
    margin-top: 6px;
    margin-bottom: 8px;
    font-weight: bold;

    &.require:after {
      display: inline-block;
      width: 16px;
      height: 16px;
      font-weight: bold;
      background: url(${IMG_SERVER}/images/api/icn_asterisk.svg) no-repeat center;
      content: '';
      vertical-align: bottom;
    }

    span {
      font-size: 12px;
    }
  }
`

const PhoneAuth = styled.div`
  overflow: hidden;
  &.top {
    margin-top: -20px;
  }
  button {
    float: left;
    width: 26%;
    background: ${COLOR_MAIN};
    color: #fff;
    font-weight: 600;
    line-height: 40px;
    border-radius: 0 4px 4px 0 !important;
    &.off {
      background: #a8a8a8;
    }
  }
  button:disabled,
  button.off {
    background: #a8a8a8;
  }
  & + & {
    margin-top: 10px;
  }
  .timer {
    display: block;
    position: absolute;
    right: 31%;
    color: ${COLOR_MAIN};
    font-size: 14px;
    line-height: 40px;
    z-index: 3;
    transform: skew(-0.03deg);
  }
  input {
    border-radius: 4px 0 0 4px !important;
  }
`
//프로필 업로드 영역
const ProfileUpload = styled.div`
  margin: 20px 0 16px 0;
  text-align: center;
  &.top {
    margin-top: -20px;
  }
  input {
    position: absolute;
    height: 0;
    width: 0;
  }
  div {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    border: 1px solid ${COLOR_MAIN};
    background: url(${props => props.imgUrl}) no-repeat center center / cover;
  }
  div.on {
    img {
      display: none;
    }
  }
  label {
    display: block;
    position: relative;
    width: 88px;
    margin: 0 auto;
    cursor: pointer;

    span {
      display: block;
      position: absolute;
      bottom: -4px;
      right: -15px;
      width: 36px;
      height: 36px;
      background: url(${IMG_SERVER}/svg/ico-camera.svg) no-repeat center / cover;
      text-indent: -9999px;
    }
  }

  .img-text {
    padding-top: 12px;
    font-size: 14px;
    color: #feac2c;
    font-weight: 600;
    letter-spacing: -0.5px;
    text-align: center;
    transform: skew(-0.03deg);
  }
`
//성별 선택 라디오 박스 영역
const GenderRadio = styled.div`
  display: flex;
  margin: 0 0 16px 0;
  label {
    flex: 1;
    border: 1px solid #bdbdbd;
    color: #757575;
    line-height: 40px;
    border-radius: 4px 0 0 4px;
    text-align: center;
    transform: skew(-0.03deg);

    &:before {
      display: inline-block;
      width: 10px;
      height: 16px;
      margin-right: 5px;
      background: url(${IMG_SERVER}/images/api/ico_male.svg) no-repeat center;
      content: '';
      vertical-align: top;
      margin-top: 12px;
    }
    input {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      margin-left: -1px;
      margin-top: -1px;
      outline: none;
      -webkit-appearance: none;
    }
    &.on input {
      color: ${COLOR_MAIN};
    }
    &.on input::after {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 4px 0 0 4px;
      border: 1px solid ${COLOR_MAIN};
      content: '';
    }
  }
  label + label {
    border-left: 0;
    border-radius: 0 4px 4px 0;
    &:before {
      display: inline-block;
      width: 10px;
      height: 16px;
      margin-right: 5px;
      background: url(${IMG_SERVER}/images/api/ico_female.svg) no-repeat center;
      content: '';
      vertical-align: top;
      margin-top: 12px;
    }
    input {
      margin-left: 0;
    }
    input::after {
      margin-left: -1px;
      border-radius: 0 4px 4px 0 !important;
    }
  }
  label.on {
    color: ${COLOR_MAIN};
    font-weight: bold;
  }
`
//약관 동의 박스 영역
const CheckWrap = styled.div`
  overflow: hidden;
  position: relative;
  height: 42px;
  border: 1px solid #bdbdbd;
  transition: height 0.5s ease-in-out;
  border-radius: 4px;

  &.on {
    height: 205px;
  }
  div {
    position: relative;

    & input {
      position: relative;
      width: 24px;
      height: 24px;
      margin: 0 6px 0 0;
      appearance: none;
      border: none;
      outline: none;

      background: #fff url(${IMG_SERVER}/images/api/ico-checkbox-off.svg) no-repeat center center / cover;
      &:checked {
        background: #632beb url(${IMG_SERVER}/images/api/ico-checkbox-on.svg) no-repeat center center / cover;
      }

      &:after {
        position: absolute;
        top: 20px;
        right: 8px;
        color: #bdbdbd;
        font-size: 12px;
        font-weight: 600;
      }
      &[name='nickNm']:after {
        content: '2~20자 한글/영문/숫자';
      }
      &[name='name']:after {
        content: '10자 한글/영문';
      }
    }

    * {
      line-height: 24px;
      vertical-align: top;
    }
    button {
      position: absolute;
      right: 12px;
      top: 8px;
      width: 24px;
      height: 24px;
      text-indent: -9999px;
    }

    label {
      display: inline-block;
      transform: skew(-0.03deg);
    }
  }
  & > div:first-child > button {
    background: url(${IMG_SERVER}/svg/ico_check_wrap.svg) no-repeat center;
    transform: rotate(180deg);

    &.on {
      transform: rotate(0deg);
    }
  }
  & > div:first-child {
    padding: 8px 12px;
    label {
      margin-left: -5px;
    }
  }

  @media (max-width: ${WIDTH_MOBILE_S}) {
    div {
      & input {
        margin: 0 5px 0 0;
      }
      label {
        letter-spacing: -1px;
      }
    }
  }
`
const CheckBox = styled.div`
  overflow: hidden;
  position: relative;
  border-top: 1px solid #e0e0e0;

  div {
    padding: 8px 12px;
    * {
      line-height: 24px;
      vertical-align: top;
    }
    span {
      padding-right: 6px;
      color: #ec455f;
    }
  }
  button {
    background: url(${IMG_SERVER}/svg/ico_check_more.svg) no-repeat center;
  }
`
const Button = styled.button`
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
  background: ${COLOR_MAIN};
  color: #fff;
  line-height: 44px;
  font-size: 18px;
  border-radius: 4px;
  font-weight: bold;

  &:disabled,
  &.off {
    background: #a8a8a8;
  }
`
const InputWrap = styled.div`
  position: relative;
  margin-top: 16px;
  input {
    position: relative;
    margin-top: -1px;
  }
  input + span {
    position: absolute;
    top: 10px;
    right: 12px;
    color: #bdbdbd;
    font-size: 12px;
    transform: skew(-0.03deg);

    &.off {
      display: none;
    }
  }

  @media (max-width: ${WIDTH_MOBILE_S}) {
    input + span {
      right: 8px;
      letter-spacing: -1px;
    }
  }
`
//helptext
const HelpText = styled.div`
  display: block;
  margin-bottom: 10px;
  padding: 10px;
  background: #f8f8f8;
  text-align: center;
  transform: skew(-0.03deg);
  &.help {
    color: #ec455f;
  }
  &.pass {
    color: ${COLOR_MAIN};
  }
`
