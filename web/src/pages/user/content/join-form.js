import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'

//components
import Input from './input-type'
import Datepicker from './style-datepicker'
//import Button from './style-button'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import moment from 'moment'
import Api from 'context/api'
import {Context} from 'context'
/**
곰인형-토끼 : https://devimage.dalbitcast.com/ani/lottie/2020.02.07_1.json
곰인형 : https://devimage.dalbitcast.com/ani/lottie/2020.02.07_2.json
도너츠-달 : https://devimage.dalbitcast.com/ani/lottie/2020.02.07_3.json
도너츠 : https://devimage.dalbitcast.com/ani/lottie/2020.02.07_4.json
곰인형-토끼 : https://devimage.dalbitcast.com/ani/webp/2020.02.07_1.webp
곰인형 : https://devimage.dalbitcast.com/ani/webp/2020.02.07_2.webp
도너츠-달 : https://devimage.dalbitcast.com/ani/webp/2020.02.07_3.webp
도너츠 : https://devimage.dalbitcast.com/ani/webp/2020.02.07_4.webp
 */
const JoinForm = props => {
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
    term: false // 약관동의는 필수만 체크하기
  })
  const [validatePass, setValidatePass] = useState(false) // 유효성 모두 통과 여부. 회원가입 버튼 활성시 쓰임
  const [currentPwd, setCurrentPwd] = useState() // 비밀번호 도움 텍스트 값. html에 뿌려줄 state
  const [currentPwdCheck, setCurrentPwdCheck] = useState() // 비밀번호 확인 도움 텍스트 값.
  const [currentNick, setCurrentNick] = useState() // 닉네임 확인 도움 텍스트 값.
  const [currentName, setCurrentName] = useState() // 이름 확인 도움 텍스트 값.
  const [currentBirth, setCurrentBirth] = useState() // 생년월일 확인 도움 텍스트 값

  //생년월일 유효성에서 계산할 현재 년도 date
  const d = new Date()
  const date = moment(d).format('YYYYMMDD')
  const dateYear = date.slice(0, 4) - 17
  //console.log(date)
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

  // console.log('customHeader = ' + JSON.stringify(context.customHeader, null, 1))
  // console.log(JSON.stringify(changes, null, 1))

  // changes 초기값 셋팅
  const [changes, setChanges] = useState({
    loginID: '',
    loginPwd: '',
    loginPwdCheck: '',
    loginNickNm: '',
    loginName: '',
    birth: '',
    gender: 'm',
    image: '',
    memType: 'p',
    term1: 'n',
    term2: 'n',
    term3: 'n',
    term4: 'n',
    term5: 'n',
    osName: context.customHeader.os,
    deviceid: context.customHeader.deviceid,

    ...props.location.state
  })

  const {loginID, loginPwd, loginPwdCheck, loginNickNm, loginName, gender, birth, image, memType, osName} = changes
  const [fetch, setFetch] = useState(null)

  //회원가입 input onChange
  const onLoginHandleChange = e => {
    setChanges({
      ...changes,
      [e.target.name]: e.target.value
    })
    //유효성검사
    if (e.target.name == 'loginPwd') {
      validatePwd(e.target.value)
    } else if (e.target.name == 'loginNickNm') {
      validateNickNm(e.target.value)
    } else if (e.target.name == 'loginID') {
      validateID(e.target.value)
    }
  }

  //---------------------------------------------------------------------
  //유효성 검사 함수

  const validatePwd = pwdEntered => {
    //비밀번호 유효성 체크 로직 (숫자,영문,특수문자 중 2가지 이상 조합, 공백 체크)
    let pw = pwdEntered
    let blank_pattern = pw.search(/[\s]/g)
    let num = pw.search(/[0-9]/g)
    let eng = pw.search(/[a-zA-Z]/gi)
    let spe = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi)

    if (blank_pattern != -1) {
      var pw2 = pw.substring(0, pw.length - 1)
      setChanges({
        ...changes,
        loginPwd: pw2
      })
    }
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

  const validateNickNm = nickEntered => {
    //닉네임 유효성 검사.. 2~20자 한글.. 전부 입력 가능.
    let nm = nickEntered
    if (nm.length > 1 && nm.length < 21) {
      setValidate({
        ...validate,
        loginNickNm: true
      })
      setCurrentNick('사용 가능한 닉네임 입니다.')
    } else if (nm.length < 2) {
      setValidate({
        ...validate,
        loginNickNm: false
      })
      setCurrentNick('최소 2자 이상 입력해주세요.')
    } else if (nm.length > 20) {
      setValidate({
        ...validate,
        loginNickNm: false
      })
      setCurrentNick('최대 20자 까지 입력이 가능합니다.')
    }
  }

  const validateID = idEntered => {
    //휴대폰 번호 유효성 검사 오직 숫자만 가능
    let loginIdVal = idEntered.replace(/[^0-9]/gi, '')
    setChanges({
      ...changes,
      loginID: loginIdVal
    })
    if (loginIdVal.length > 10) {
      setValidate({
        ...validate,
        loginID: true
      })
    }
  }
  //---------------------------------------------------------------------
  // input file에서 이미지 업로드했을때 파일객체 dataURL로 값 셋팅
  function uploadSingleFile(e) {
    let reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = function() {
      console.log('reader', reader)
      console.log('reader.', reader.result)
      if (reader.result) {
        setChanges({
          ...changes,
          image: reader.result
        })
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
    } else {
      setChanges({
        ...changes,
        term1: 'n',
        term2: 'n',
        term3: 'n',
        term4: 'n',
        term5: 'n'
      })
    }
  }

  // @todo 약관 동의 하나씩 모두 체크, 체크해제 했을때 전체 동의 체크 작동
  const termCheckHandle = e => {
    onLoginHandleChange(e)
    // if(changes.term1 == 'y' && changes.term2 == 'y' && changes.term3 == 'y') {
    //   console.log('모두 체크, 혹은 체크 해제 되었습니다')
    //   selectAllTerm()
    // }
  }

  //---------------------------------------------------------------------
  //fetchData
  async function fetchData() {
    //console.log(JSON.stringify(obj))
    console.log('회원가입 버튼 클릭 후 props= ' + JSON.stringify(changes))

    const resUpload = await Api.image_upload({
      data: {
        file: '',
        dataURL: changes.image,
        imageURL: '',
        uploadType: 'profile'
      }
    })
    if (resUpload && resUpload.result === 'success') {
      console.log('성공했으니 올려 멍청아 ')
      console.log('resUpload = ' + JSON.stringify(resUpload, null, 1))
      console.log('path는?', resUpload.data.path)
      const res = await Api.member_join({
        data: {
          memType: changes.memType,
          memId: changes.loginID,
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
          profImg: resUpload.data.path,
          profImgRacy: 3,
          email: '',
          os: changes.osName
        }
      })
      console.log('회원가입 REST 결과값 = ' + JSON.stringify(res))
      if (res && res.code) {
        if (res.code == 0) {
          alert(res.message)
          props.history.push('/') //회원가입 완료 후 authToken, memNo 넘겨주기
          context.action.updateState(res.data) //회원정보 조회할수있게 memNo넘겼지만.. 조회안됨
          //일단 이미지랑 닉네임 여기서 넘겨줌. 나중에 조회로 바꿀수있게 하고 지울것.
          context.action.updateState({
            nickNm: changes.loginNickNm,
            profImg: resUpload.data.path
          })
          context.action.updateLogin(true)
        } else {
          alert(res.message)
          context.action.updateLogin(false)
        }
      } //(res && res.code)
    } else {
      console.log('안올라갔어.')
      console.log('resUpload = ' + JSON.stringify(resUpload, null, 1))
    }

    //닉네임 중복확인 지금안되서 보류
    // const resCheck = await Api.nickName_check({
    //   date: {
    //     nickNm: changes.loginNickNm
    //   }
    // })
    // if (resCheck && resCheck.result === 'success') {
    //   console.log('성공')
    //   console.log('resCheck = ' + JSON.stringify(resCheck, null, 1))
    // } else {
    //   console.log('실패')
    //   console.log('resCheck = ' + JSON.stringify(resCheck, null, 1))
    // }
  }

  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {
    //이미지 값 비었을 경우 기본 프로필 이미지 셋팅
    //state 시점차이때문에 birth와 image를 처음 동시에 셋팅해주어야함, 그렇지 않으면 하나는 계속 빈값으로 엎어쳐진다.
    if (!changes.image) {
      setChanges({
        ...changes,
        birth: dateDefault,
        image: `${IMG_SERVER}/images/api/ico-profil-w.png`
      })
    }
  }, [])

  //datepicker에서 올려준 값 받아서 birth 바로 변경하기
  let dateDefault = ''
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
    //console.clear()
    console.log(JSON.stringify(changes, null, 1))
    //console.log('체인지일어남')
    //약관 동의 유효성 체크
    if (changes.term1 == 'y' && changes.term2 == 'y' && changes.term3 == 'y' && changes.term4 == 'y') {
      setValidate({
        ...validate,
        term: true
      })
    } else {
      setValidate({
        ...validate,
        term: false
      })
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
    //console.log(JSON.stringify(validate, null, 1))
    if (validate.loginID && validate.loginPwd && validate.loginPwdCheck && validate.loginNickNm && validate.birth && validate.term) {
      setValidatePass(true)
    } else {
      setValidatePass(false)
    }
  }, [validate])

  return (
    <>
      <FormWrap>
        {/* 휴대폰 인증, 전화번호 가입시에만 노출*/}
        {changes.memType == 'p' && (
          <>
            <PhoneAuth>
              <input type="tel" name="loginID" value={changes.loginID} onChange={onLoginHandleChange} placeholder="휴대폰 번호" className="auth" maxLength="11" />
              <button disabled={!validate.loginID}>인증요청</button>
            </PhoneAuth>
            <PhoneAuth>
              <input type="number" placeholder="인증번호" className="auth" />
              <button disabled={true}>인증확인</button>
            </PhoneAuth>
          </>
        )}
        {/* 프로필 이미지 등록, 전화번호 가입시에만 노출 */}
        {changes.memType == 'p' && (
          <ProfileUpload imgUrl={changes.image}>
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
          </ProfileUpload>
        )}
        {/* 닉네임 */}
        <InputWrap type="닉네임">
          <input type="text" name="loginNickNm" defaultValue={changes.loginNickNm} onChange={onLoginHandleChange} placeholder="닉네임" />
          <span className={validate.loginNickNm ? 'off' : 'on'}>2~10자</span>
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
            <input type="password" name="loginPwd" value={changes.loginPwd} onChange={onLoginHandleChange} placeholder="비밀번호" />
            <span className={validate.loginPwd ? 'off' : 'on'}>2~20자 영문/숫자/특수문자</span>
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
            <input type="radio" name="gender" id="genderMale" value="m" defaultChecked={changes.gender === 'm'} onChange={onLoginHandleChange} />
            남자
          </label>
          <label htmlFor="genderFemale" className={changes.gender == 'f' ? 'on' : 'off'}>
            <input type="radio" name="gender" id="genderFemale" value="f" defaultChecked={changes.gender === 'f'} onChange={onLoginHandleChange} />
            여자
          </label>
        </GenderRadio>
        {/* 약관동의 */}
        <CheckWrap className={boxState ? 'on' : ''}>
          <div>
            <input type="checkbox" name="allTerm" id="allTerm" checked={allTerm} onChange={selectAllTerm} /> <label htmlFor="allTerm">약관 전체 동의</label>
            <button
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
              <button onClick={() => {}}>자세히 보기</button>
            </div>
            <div>
              <input type="checkbox" name="term2" id="term2" checked={changes.term2 == 'y' ? true : false} value={termHandle(changes.term2)} onChange={termCheckHandle} />
              <label htmlFor="term2">
                <span>[필수]</span>개인정보 취급방침
              </label>
              <button onClick={() => {}}>자세히 보기</button>
            </div>
            <div>
              <input type="checkbox" name="term3" id="term3" checked={changes.term3 == 'y' ? true : false} value={termHandle(changes.term3)} onChange={termCheckHandle} />
              <label htmlFor="term3">
                <span>[필수]</span>청소년 보호정책
              </label>
              <button onClick={() => {}}>자세히 보기</button>
            </div>
            <div>
              <input type="checkbox" name="term4" id="term4" checked={changes.term4 == 'y' ? true : false} value={termHandle(changes.term4)} onChange={termCheckHandle} />
              <label htmlFor="term4">
                <span>[필수]</span>운영정책
              </label>
              <button onClick={() => {}}>자세히 보기</button>
            </div>
            <div>
              <input type="checkbox" name="term5" id="term5" checked={changes.term5 == 'y' ? true : false} value={termHandle(changes.term5)} onChange={termCheckHandle} />
              <label htmlFor="term5">
                <span>[선택]</span>마케팅 정보 제공 동의3
              </label>
              <button onClick={() => {}}>자세히 보기</button>
            </div>
          </CheckBox>
        </CheckWrap>
        <Button onClick={() => fetchData()} disabled={!validatePass}>
          회원가입 완료
        </Button>
      </FormWrap>
    </>
  )
}

export default JoinForm
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
`
//프로필 업로드 영역
const ProfileUpload = styled.div`
  margin: 40px 0 30px 0;
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
    input:checked {
      color: ${COLOR_MAIN};
    }
    input:checked::after {
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
    height: 303px;
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

    & > button {
      background: url(${IMG_SERVER}/svg/ico_check_wrap.svg) no-repeat center;
    }
    label {
      display: inline-block;
      transform: skew(-0.03deg);
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
      color: #bdbdbd;
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
