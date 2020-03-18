import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {isHybrid, Hybrid} from 'context/hybrid'
//components
import Utility from 'components/lib/utility'
import Datepicker from './style-datepicker'
//import Button from './style-button'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, PHOTO_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import moment from 'moment'
import Api from 'context/api'
import {Context} from 'context'

let intervalId = null

export default props => {
  //context
  const context = useContext(Context)
  //useState
  const [allTerm, setAllTerm] = useState(false) // 약관동의 전체 체크
  const [boxState, setBoxState] = useState(false) // 약관동의 박스 열고닫음 상태값
  const [validate, setValidate] = useState({
    // 유효성 체크
    loginID: false,
    loginPwd: false,
    loginPwdCheck: false,
    loginNickNm: false,
    birth: false,
    term: false, // 약관동의는 필수만 체크하기
    auth: false
  })
  const [validatePass, setValidatePass] = useState(false) // 유효성 모두 통과 여부. 회원가입 버튼 활성시 쓰임
  const [currentPwd, setCurrentPwd] = useState() // 비밀번호 도움 텍스트 값. html에 뿌려줄 state
  const [currentPwdCheck, setCurrentPwdCheck] = useState() // 비밀번호 확인 도움 텍스트 값.
  const [currentNick, setCurrentNick] = useState() // 닉네임 확인 도움 텍스트 값.
  const [currentName, setCurrentName] = useState() // 이름 확인 도움 텍스트 값.
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
  let setTime = 300

  //포토서버에 올라간 디폴트 이미지
  const defaultImage = `${PHOTO_SERVER}/profile_3/profile_n.png`
  const defaultImagePath = defaultImage.replace(`${PHOTO_SERVER}`, '')

  //생년월일 유효성에서 계산할 현재 년도 date
  const d = new Date()
  const date = moment(d).format('YYYYMMDD')
  const dateYear = date.slice(0, 4) - 17
  let dateDefault = ''

  let leadingZeros = (n, digits) => {
    var zero = ''
    n = n.toString()
    if (n.length < digits) {
      for (var i = 0; i < digits - n.length; i++) zero += '0'
    }
    return zero + n
  }

  //회원가입 들어온 후 gnb닫아줘야 메인으로 갔을때 제대로 열림
  context.action.updateGnbVisible(false)

  // changes 초기값 셋팅
  const [changes, setChanges] = useState({
    loginID: '',
    loginPwd: '',
    loginPwdCheck: '',
    loginNickNm: '',
    loginName: '',
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
    deviceid: context.customHeader.deviceid,

    ...props.location.state
  })

  const {loginID, loginPwd, loginPwdCheck, loginNickNm, loginName, gender, birth, image, memType, osName} = changes
  const [fetch, setFetch] = useState(null)

  //회원가입 input onChange
  const onLoginHandleChange = e => {
    //대소문자 구분없음, 소문자만 입력
    console.log('e.targete.targete.targete.target', e.target.defaultChecked)
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
    } else if (e.target.name == 'loginID') {
      validateID(e.target.value)
    } else if (e.target.name == 'loginNickNm') {
      validateNick(e.target.value.replace(/(\s*)/g, ''))
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
    //let loginIdVal = idEntered.replace(/[^0-9]/gi, '')
    let rgEx = /(01[016789])[-](\d{4}|\d{3})[-]\d{4}$/g
    const loginIdVal = Utility.phoneAddHypen(idEntered)
    setChanges({
      ...changes,
      loginID: loginIdVal
    })
    if (!(loginIdVal == undefined)) {
      if (loginIdVal.length >= 12) {
        // setValidate({
        //   ...validate,
        //   loginID: true
        // })
        if (!rgEx.test(loginIdVal)) {
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
      } else if (loginIdVal.length < 12) {
        setValidate({
          ...validate,
          loginID: false
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

  const validateNick = nickEntered => {
    let nm = nickEntered
    setChanges({
      ...changes,
      loginNickNm: nm
    })
    console.log('changes.loginNickNm.length', changes.loginNickNm)
    let nmVal = {loginNickNm: false}
    if (nickEntered.length == 0) {
      setValidate({
        ...validate,
        loginNickNm: false
      })
      setCurrentNick('')
    } else {
      if (nm.length > 1 && nm.length < 21) {
        if (fetchNickData(nm)) {
          nmVal = {...nmVal, loginNickNm: true}
          console.log('nmVal', nmVal)
          setCurrentNick('사용 가능한 닉네임 입니다.')
        } else {
          setCurrentNick('닉네임 중복입니다.')
        }
      } else if (nm.length < 2) {
        setCurrentNick('최소 2자 이상 입력해주세요.')
      } else if (nm.length > 20) {
        setCurrentNick('최대 20자 까지 입력이 가능합니다.')
      }
    }
    console.log('?')
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
    reader.onload = function() {
      // console.log('reader', reader)
      // console.log('reader.', reader.result)
      if (reader.result) {
        // setChanges({
        //   ...changes,
        //   image: reader.result
        // })
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

  //---------------------------------------------------------------------
  //fetchData
  async function fetchData() {
    console.log('회원가입 버튼 클릭 후 props= ' + JSON.stringify(changes))
    //이미지가 기본 이미지면 image_upload를 날리지 않는다.
    let resultImg = ''

    if (imgData == defaultImage) {
      //기본 이미지면 업로드 날리지 않고 기본이미지의 path바로 세팅
      resultImg = defaultImagePath
    } else {
      //이미지가 등록되었다면 이미지 업로드 후 path 받아서 세팅

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
          //업로드 성공
          //console.log(resUpload.data)
          resultImg = resUpload.data.path
        } else {
          //업로드 실패시 기본이미지 path 세팅
          console.log(resUpload.message)
          resultImg = defaultImagePath
        }
      }
    }

    //업로드 성공, 실패 여부로 이미지 값 다시 셋팅해준 후 member_join은 무조건 날리기
    const loginID = changes.loginID.replace(/-/g, '')
    const res = await Api.member_join({
      data: {
        memType: changes.memType,
        memId: loginID,
        memPwd: changes.loginPwd,
        gender: changes.gender,
        nickNm: changes.loginNickNm,
        birth: changes.birth,
        term1: changes.term1,
        term2: changes.term2,
        term3: changes.term3,
        term4: changes.term4,
        term5: changes.term5,
        name: changes.loginName,
        profImg: resultImg,
        profImgRacy: 3,
        email: '',
        os: changes.osName
      }
    })
    //console.log('회원가입 REST 결과값 = ' + JSON.stringify(res))
    if (res && res.code) {
      if (res.code == 0) {
        //alert(res.message)
        context.action.alert({
          callback: () => {
            async function fetchLogin() {
              const resLogin = await Api.member_login({
                data: {
                  memType: changes.memType,
                  memId: loginID,
                  memPwd: changes.loginPwd
                }
              })
              if (resLogin && resLogin.code) {
                if (resLogin.code == 0) {
                  //Webview 에서 native 와 데이터 주고 받을때 아래와 같이 사용
                  props.update({loginSuccess: resLogin.data})
                  Api.profile({params: {memNo: resLogin.data.memNo}}).then(profileInfo => {
                    if (profileInfo.result === 'success') {
                      context.action.updateProfile(profileInfo.data)
                    }
                  })
                  props.history.push('/') //회원가입 완료 후 authToken, memNo 넘겨주기
                  context.action.updateToken(res.data)
                } else {
                  console.log(resLogin)
                }
              }
            }
            fetchLogin()
          },
          msg: '회원가입 완료되었습니다.'
        })

        // context.action.updateState(res.data) //회원정보 조회할수있게 memNo넘겼지만.. 조회안됨
        //일단 이미지랑 닉네임 여기서 넘겨줌. 나중에 조회로 바꿀수있게 하고 지울것.
        // context.action.updateState({
        //   nickNm: changes.loginNickNm,
        //   profImg: resultImg
        // })
        //@hybrid
        if (isHybrid()) {
          //alert('앱내 회원가입완료')
          context.action.alert({
            msg: '앱내 회원가입완료'
          })
          Hybrid('GetLoginToken', res.data)
        }
        context.action.updateLogin(true)
      } else {
        context.action.alert({
          msg: res.message
        })
        context.action.updateLogin(false)
      }
    } //(res && res.code)
  }

  let validateSetting = {}
  async function fetchNickData() {
    const resNick = await Api.nickName_check({
      params: {
        nickNm: changes.loginNickNm
      }
    })
    if (resNick) {
      if (resNick.result === 'success') {
        if (resNick.code == '1') {
          return 1
        }
      } else if (resNick.result === 'fail') {
        if (resNick.code == '0') {
          return 0
        } else {
          console.log('중복체크 실패', resNick)
        }
      }
    }
  }

  async function fetchAuth() {
    const resAuth = await Api.sms_request({
      data: {
        phoneNo: changes.loginID,
        authType: 0
      }
    })
    if (resAuth.result === 'success') {
      console.log(resAuth)
      setValidate({
        ...validate,
        loginID: true,
        auth: false
      })
      setChanges({...changes, CMID: resAuth.data.CMID})
      setCurrentAuth1(resAuth.message)
      setCurrentAuth2('')
      document.getElementsByClassName('auth-btn1')[0].innerText = '재전송'
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
          setCurrentAuth2('인증시간이 초과되었습니다. 인증을 다시 받아주세요.')
          setCurrentAuthBtn({
            request: false,
            check: true
          })
        }
      }, 1000)

      // setThisTimer(createAuthTimer)
    } else {
      console.log(resAuth)
      setCurrentAuth1(resAuth.message)
    }
  }

  async function fetchAuthCheck() {
    console.log('체크합니다..', changes.CMID, Number(changes.auth))
    const resCheck = await Api.sms_check({
      data: {
        CMID: changes.CMID,
        code: Number(changes.auth)
      }
    })
    if (resCheck.result === 'success') {
      console.log(resCheck)
      setValidate({...validate, auth: true})
      setCurrentAuth2(resCheck.message)
      clearInterval(intervalId)
      document.getElementsByClassName('timer')[0].innerHTML = ''
    } else {
      console.log(resCheck)
      setCurrentAuth2(resCheck.message)
    }
  }

  useEffect(() => {
    //이미지 값 비었을 경우 기본 프로필 이미지 셋팅
    //state 시점차이때문에 birth와 image를 처음 동시에 셋팅해주어야함, 그렇지 않으면 하나는 계속 빈값으로 엎어쳐진다.
    let firstSetting = {}
    if (!changes.image && !changes.birth) {
      firstSetting = {birth: dateDefault, image: defaultImage}
      setImgData(firstSetting.image)
    } else if (!changes.image) {
      firstSetting = {
        image: defaultImage
      }
      setImgData(defaultImage)
    } else if (!changes.birth) {
      firstSetting = {birth: dateDefault}
    }
    setChanges({
      ...changes,
      ...firstSetting
    })
  }, [])
  //datepicker에서 올려준 값 받아서 birth 바로 변경하기
  const pickerOnChange = value => {
    if (!changes.birth) {
      dateDefault = value
    } else {
      setChanges({
        ...changes,
        birth: value
      })
    }
  }

  useEffect(() => {
    console.log(JSON.stringify(validate, null, 1))
  }, [validate])

  useEffect(() => {
    console.log(JSON.stringify(changes, null, 1))
    if (changes.term1 == 'y' && changes.term2 == 'y' && changes.term3 == 'y' && changes.term4 == 'y') {
      setAllTerm(true)
      setValidate({...validate, term: true})
    } else {
      setAllTerm(false)
      setValidate({...validate, term: false})
    }

    if (!(changes.memType == 'p')) {
      //validateNickNm(changes.loginNickNm)
      validateSetting = {
        ...validateSetting,
        loginID: true,
        loginPwd: true,
        loginPwdCheck: true
      }
      setValidate(
        {
          ...validate,
          ...validateSetting
        }
        //
      )
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

  //생년월일 바뀔때마다 유효성
  useEffect(() => {
    let year = changes.birth.slice(0, 4)
    //현재 날짜 일때는 -17 한 년도로 년도만 바꿔치기 해주고 -> datepicker 에서 셋팅해줌
    // 체인지 됐을때는 17세 이상만 가입가능하다고 하기
    if (year <= dateYear) {
      setCurrentBirth('')
      setValidate({
        ...validate,
        birth: true
      })
      validateSetting = {...validateSetting, birth: true}
    } else {
      setCurrentBirth('17세 이상만 가입 가능합니다.')
      setValidate({
        ...validate,
        birth: false
      })
    }
  }, [changes.birth])

  //유효성 전부 체크되었을 때 회원가입 완료 버튼 활성화 시키기
  useEffect(() => {
    if (validate.loginID && validate.loginPwd && validate.loginPwdCheck && validate.loginNickNm && validate.birth && validate.term && validate.auth) {
      setValidatePass(true)
    } else {
      setValidatePass(false)
    }
  }, [validate])

  // useEffect(() => {
  //   return () => {
  //     console.log('remove join from')
  //   }
  // })

  return (
    <>
      <FormWrap>
        {/* 휴대폰 인증, 전화번호 가입시에만 노출*/}
        {changes.memType == 'p' && (
          <>
            <PhoneAuth>
              <input type="tel" name="loginID" value={changes.loginID} onChange={onLoginHandleChange} placeholder="휴대폰 번호" className="auth" maxLength="13" />
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
              <HelpText state={validate.loginID} className={validate.loginID ? 'pass' : 'help'}>
                {currentAuth1}
              </HelpText>
            )}
            <PhoneAuth>
              <input type="number" name="auth" placeholder="인증번호" className="auth" value={changes.auth} onChange={onLoginHandleChange} />
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
        <ProfileUpload imgUrl={imgData}>
          <label htmlFor="profileImg">
            <div></div>
            <span>클릭 이미지 파일 추가</span>
          </label>
          <input
            type="file"
            id="profileImg"
            accept=".gif, .jpg, .png"
            onChange={e => {
              uploadSingleFile(e)
            }}
          />
          <p className="img-text">프로필 사진을 등록해주세요!</p>
        </ProfileUpload>
        {/* 닉네임 */}
        <InputWrap type="닉네임">
          <input autoComplete="off" type="text" name="loginNickNm" value={changes.loginNickNm} onChange={onLoginHandleChange} placeholder="닉네임" />
          <span className={validate.loginNickNm ? 'off' : 'on'}>2~20자 한글/영문/숫자</span>
          {currentNick && (
            <HelpText state={validate.loginNickNm} className={validate.loginNickNm ? 'pass' : 'help'}>
              {currentNick}
            </HelpText>
          )}
          {/* <input type="text" name="loginName" defaultValue={changes.loginName} onChange={onLoginHandleChange} placeholder="이름" />
          <span className={validate.loginName ? 'off' : 'on'}>2~10자</span>
          {currentNick && (
            <HelpText state={validate.loginName} className={validate.loginName ? 'pass' : 'help'}>
              {currentNick}
            </HelpText>
          )} */}
        </InputWrap>
        {/* 비밀번호, 전화번호 가입시에만 노출 */}
        {changes.memType == 'p' && (
          <InputWrap>
            <input autoComplete="new-password" type="password" name="loginPwd" value={changes.loginPwd} onChange={onLoginHandleChange} placeholder="비밀번호" />
            <span className={validate.loginPwd ? 'off' : 'on'}>8~20자 영문/숫자/특수문자 중 2가지 이상 조합</span>
            {currentPwd && (
              <HelpText state={validate.loginPwd} className={validate.loginPwd ? 'pass' : 'help'}>
                {currentPwd}
              </HelpText>
            )}
            <input type="password" name="loginPwdCheck" defaultValue={changes.loginPwdCheck} onChange={onLoginHandleChange} placeholder="비밀번호 확인" />
            {currentPwdCheck && (
              <HelpText state={validate.loginPwdCheck} className={validate.loginPwdCheck ? 'pass' : 'help'}>
                {currentPwdCheck}
              </HelpText>
            )}
          </InputWrap>
        )}
        {/* 생년월일 */}
        <Datepicker text="생년월일" name="birth" value={changes.birth} change={pickerOnChange} />
        {currentBirth && (
          <HelpText state={validate.birth} className={validate.birth ? 'pass' : 'help'}>
            {currentBirth}
          </HelpText>
        )}
        {/* 성별 */}
        <GenderRadio>
          <label htmlFor="genderMale" className={changes.gender == 'm' ? 'on' : 'off'}>
            <input type="checkbox" name="gender" id="genderMale" value="m" defaultChecked={changes.gender === 'm'} onChange={onLoginHandleChange} />
            남자
          </label>
          <label htmlFor="genderFemale" className={changes.gender == 'f' ? 'on' : 'off'}>
            <input type="checkbox" name="gender" id="genderFemale" value="f" defaultChecked={changes.gender === 'f'} onChange={onLoginHandleChange} />
            여자
          </label>
        </GenderRadio>
        {/* 약관동의 */}
        <CheckWrap className={boxState ? 'on' : ''}>
          <div>
            <input type="checkbox" name="allTerm" id="allTerm" checked={allTerm} onChange={selectAllTerm} /> <label htmlFor="allTerm">약관 전체 동의</label>
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
              <input type="checkbox" name="term1" id="term1" checked={changes.term1 == 'y' ? true : false} value={termHandle(changes.term1)} onChange={termCheckHandle} />
              <label htmlFor="term1">
                <span>[필수]</span>서비스 이용약관 동의(필수)
              </label>
              <button
                onClick={() => {
                  context.action.updatePopup('TERMS', 'service')
                }}>
                자세히 보기
              </button>
            </div>
            <div>
              <input type="checkbox" name="term2" id="term2" checked={changes.term2 == 'y' ? true : false} value={termHandle(changes.term2)} onChange={termCheckHandle} />
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
              <input type="checkbox" name="term3" id="term3" checked={changes.term3 == 'y' ? true : false} value={termHandle(changes.term3)} onChange={termCheckHandle} />
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
              <input type="checkbox" name="term4" id="term4" checked={changes.term4 == 'y' ? true : false} value={termHandle(changes.term4)} onChange={termCheckHandle} />
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
            {/* <div>
              <input type="checkbox" name="term5" id="term5" checked={changes.term5 == 'y' ? true : false} value={termHandle(changes.term5)} onChange={termCheckHandle} />
              <label htmlFor="term5">
                <span>[선택]</span>마케팅 정보 제공 동의
              </label>
              <button
                onClick={() => {
                  context.action.updatePopup('TERMS', 'marketing')
                }}>
                자세히 보기
              </button>
            </div> */}
          </CheckBox>
        </CheckWrap>
        <Button onClick={() => fetchData()} disabled={!validatePass}>
          회원가입 완료
        </Button>
      </FormWrap>
    </>
  )
}

//---------------------------------------------------------------------
//styled
//핸드폰 인증 영역
const PhoneAuth = styled.div`
  overflow: hidden;
  button {
    float: left;
    width: 28%;
    background: ${COLOR_MAIN};
    color: #fff;
    font-weight: 600;
    line-height: 50px;
  }
  button:disabled {
    background: #a8a8a8;
  }
  & + & {
    margin-top: 20px;
  }
  .timer {
    display: block;
    position: absolute;
    right: 31%;
    color: ${COLOR_MAIN};
    font-size: 14px;
    line-height: 50px;
    z-index: 3;
    transform: skew(-0.03deg);
  }
`
//프로필 업로드 영역
const ProfileUpload = styled.div`
  margin: 40px 0 35px 0;
  text-align: center;
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

    img {
      /* width: 88px;
      height: 88px;
      margin: -1px;
      border-radius: 50%;
      border: 1px solid ${COLOR_MAIN};
      box-sizing: content-box; */
    }

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

  .img-text{
    padding-top:18px;
    font-size:12px;
    color:#feac2c;
    text-align:center;
    transform:skew(-0.03deg);
  }
`
//성별 선택 라디오 박스 영역
const GenderRadio = styled.div`
  display: flex;
  margin: 32px 0;
  label {
    flex: 1;
    border: 1px solid #e0e0e0;
    color: #757575;
    line-height: 48px;
    text-align: center;
    transform: skew(-0.03deg);
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
      border: 1px solid ${COLOR_MAIN};
      content: '';
    }
  }
  label + label {
    border-left: 0;
    input {
      margin-left: 0;
    }
    input::after {
      margin-left: -1px;
    }
  }
  label.on {
    color: ${COLOR_MAIN};
  }
`
//약관 동의 박스 영역
const CheckWrap = styled.div`
  overflow: hidden;
  position: relative;
  height: 52px;
  border: 1px solid #e0e0e0;
  transition: height 0.5s ease-in-out;
  &.on {
    /* height: 303px; */
    height: 253px;
  }
  div {
    position: relative;

    & input {
      position: relative;
      width: 24px;
      height: 24px;
      margin: 0 15px 0 0;
      appearance: none;
      border: none;
      outline: none;
      /* cursor: pointer; */
      background: #fff url(${IMG_SERVER}/images/api/ico-checkbox-off.png) no-repeat center center / cover;
      &:checked {
        background: #8556f6 url(${IMG_SERVER}/images/api/ico-checkbox-on.png) no-repeat center center / cover;
      }

      &:after {
        position: absolute;
        top: 20px;
        right: 8px;
        color: #bdbdbd;
        font-size: 12px;
        font-weight: 600;
      }
      &[name='loginNickNm']:after {
        content: '2~20자 한글/영문/숫자';
      }
      &[name='loginName']:after {
        content: '10자 한글/영문';
      }
    }

    * {
      line-height: 24px;
      vertical-align: top;
    }
    button {
      position: absolute;
      right: 13px;
      top: 13px;
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
    /* transition: transform 0.3s ease-in-out; */

    &.on {
      transform: rotate(0deg);
    }
  }
  & > div:first-child {
    padding: 13px;
  }
`
const CheckBox = styled.div`
  overflow: hidden;
  position: relative;
  border-top: 1px solid #e0e0e0;

  input[type='checkbox'] {
  }

  div {
    padding: 13px;
    * {
      line-height: 24px;
      vertical-align: top;
    }
    span {
      padding-right: 6px;
      color: #ec455f;
    }
    &:last-child span {
      /* color: #bdbdbd; */
    }
  }
  button {
    background: url(${IMG_SERVER}/svg/ico_check_more.svg) no-repeat center;
  }
`

const JoinText = styled.p`
  font-size: 14px;
  line-height: 1.5;
`

const FormWrap = styled.div`
  margin: 40px 0;
`

const Label = styled.div``

const ValidateText = styled.p`
  margin: 5px 0;
  color: #909090;
  font-size: 12px;
  line-height: 1.5;
  & + input {
    margin-top: 15px;
  }
`

const SelectWrap = styled.div`
  select:nth-child(2) {
    margin: 0 3%;
  }
`

const Select = styled.select`
  height: 48px;
  width: 31.333%;
  border: 1px solid #dadada;
  border-radius: 5px;
  text-indent: 10px;
  color: #555;
`

const Button = styled.button`
  width: 100%;
  margin-top: 30px;
  background: ${COLOR_MAIN};
  color: #fff;
  line-height: 50px;

  &:disabled {
    background: #a8a8a8;
  }
`
const InputWrap = styled.div`
  position: relative;
  margin: 32px 0;
  input {
    position: relative;
    margin-top: -1px;
  }
  input + span {
    position: absolute;
    top: 19px;
    right: 12px;
    color: #bdbdbd;
    font-size: 12px;
    transform: skew(-0.03deg);

    &.off {
      display: none;
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
