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
  //useState
  const [file, setFile] = useState(null) // img 업로드 file
  const [url, setUrl] = useState(null) // img 미리보기 img url
  const [radio, setRadio] = useState('m') // 성별 선택 radio 버튼 checked
  const d = new Date()
  const date = moment(d).format('YYYYMMDD')
  //console.log(date)
  let leadingZeros = (n, digits) => {
    var zero = ''
    n = n.toString()
    if (n.length < digits) {
      for (var i = 0; i < digits - n.length; i++) zero += '0'
    }
    return zero + n
  }
  const context = useContext(Context)

  console.log('customHeader = ' + JSON.stringify(context.customHeader, null, 1))
  console.log(JSON.stringify(changes, null, 1))

  const [boxState, setBoxState] = useState(false)
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
    osName: context.customHeader.os,
    deviceid: context.customHeader.deviceid,

    ...props.location.state
  })

  const {loginID, loginPwd, loginPwdCheck, loginNickNm, loginName, gender, birth, image, memType, osName} = changes
  const [fetch, setFetch] = useState(null)

  const onLoginHandleChange = e => {
    // var blank_pattern = pw.search(/[\s]/g)

    // if (blank_pattern != -1) {
    //   //string=string.substring(0, string.length()-1);
    // }
    console.log('onLoginHandleChange')
    setChanges({
      ...changes,
      [e.target.name]: e.target.value
    })
  }

  async function fetchData() {
    //console.log(JSON.stringify(obj))
    console.log('회원가입 버튼 클릭 후 props= ' + JSON.stringify(changes))

    // console.log(JSON.stringify(changes, null, 1))
    const res = await Api.member_join({
      data: {
        memType: changes.memType,
        memId: changes.loginID,
        memPwd: changes.loginPwd,
        gender: changes.gender,
        nickNm: changes.loginNickNm,
        birth: changes.birth,
        term1: 'y',
        term2: 'y',
        term3: 'y',
        term4: 'y',
        term5: 'y',
        name: changes.loginName,
        profImg: '',
        profImgRacy: 3,
        email: '',
        os: changes.osName
      }
    })
    setFetch(res)
    console.log('회원가입 REST 결과값 = ' + JSON.stringify(res))
    if (res && res.code) {
      if (res.code == 0) {
        alert(res.message)
        //window.location.href = '/' // 홈페이지로 새로고침
        props.history.push('/', changes)
        context.action.updateLogin(true)
        const resUpload = await Api.image_upload({
          data: {
            file: '',
            dataURL: changes.image,
            imageURL: '',
            uploadType: 'profile'
          }
        })
        if (resUpload && resUpload.code) {
          console.log('성공했으니 올려 멍청아 ')
          console.log('resUpload = ' + JSON.stringify(resUpload, null, 1))
        } else {
          console.log('안올라갔어.')
        }
      } else {
        alert(res.message)
        context.action.updateLogin(false)
      }
    }
  }

  // 이미지 업로드 관련
  function uploadSingleFile(e) {
    console.log('uploadSingleFile = ' + e.target.files[0])
    setFile(e.target.files[0])
    setUrl(URL.createObjectURL(e.target.files[0]))

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
    // reader.onload = function () {
    //     formData.append('dataURL', reader.result);
    //     ajaxUploadFile(formData);
    // }
  }
  function upload(e) {
    //이미지 업로드 확인, 나중에 삭제.
    e.preventDefault()
    console.log(file)
    console.log(url)
  }
  // 이미지 초기값 설정
  //setUrl(image)

  useEffect(() => {
    //console.clear()
    console.log(JSON.stringify(changes, null, 1))
  }, [changes])

  //datepicker에서 올려준 값 받아서 바로 changes에 넣을 수 있도록 값 다듬기
  const pickerTest = value => {
    // console.log('pickerTest = ' + pickerTest)
    const target = {
      name: 'birth',
      value: value
    }
    value = {target}
    onLoginHandleChange(value)
  }

  return (
    <>
      {/* <input type="phone" name="loginID" defaultValue={changes.loginID} onChange={onLoginHandleChange} /> */}
      {/* <Input type="phone" name="loginID" onChange={onLoginHandleChange} /> */}
      {/* <Button text="인증번호 받기" joinState={props.joinState} update={props.update} /> */}

      <FormWrap>
        {/* 휴대폰 인증 */}
        <PhoneAuth>
          <input type="number" name="loginID" defaultValue={changes.loginID} onChange={onLoginHandleChange} placeholder="휴대폰 번호" className="auth" />
          <button>인증요청</button>
        </PhoneAuth>
        <PhoneAuth>
          <input type="number" placeholder="인증번호" className="auth" />
          <button>인증요청</button>
        </PhoneAuth>
        {/* 프로필 이미지 등록 */}
        <ProfileUpload imgUrl={url}>
          <label htmlFor="profileImg">
            <div className={url ? 'on' : 'off'}>
              <img src={changes.image ? changes.image : `${IMG_SERVER}/images/api/join-profile-none.png`} />
            </div>
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
        {/* 닉네임, 실명 */}
        <InputWrap>
          <input type="text" name="loginNickNm" defaultValue={changes.loginNickNm} onChange={onLoginHandleChange} placeholder="닉네임" />
          <input type="text" name="loginName" defaultValue={changes.loginName} onChange={onLoginHandleChange} placeholder="실명" />
        </InputWrap>
        {/* 비밀번호 */}
        <InputWrap>
          <input type="password" name="loginPwd" defaultValue={changes.loginPwd} onChange={onLoginHandleChange} placeholder="비밀번호" />
          <input type="password" name="loginPwdCheck" defaultValue={changes.loginPwdCheck} onChange={onLoginHandleChange} placeholder="비밀번호 확인" />
        </InputWrap>
        {/* 생년월일 */}
        <Datepicker text="생년월일" name="birth" value={changes.birth} change={pickerTest} />
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
        <CheckWrap>
          <input type="checkbox" /> <Label text="약관 전체 동의" />
          <button
            onClick={() => {
              setBoxState(true)
            }}>
            펼치기
          </button>
          <CheckBox className={boxState ? 'on' : ''}>
            <input type="checkbox" defaultChecked={boxState === 'on' ? true : false} /> 서비스 이용약관 동의(필수)
            <input type="checkbox" defaultChecked={boxState === 'on' ? true : false} /> 개인정보 취급방침(필수)
            <input type="checkbox" defaultChecked={boxState === 'on' ? true : false} /> 마케팅 정보 제공 동의(선택)
          </CheckBox>
        </CheckWrap>
        <Button onClick={() => fetchData()}>회원가입 완료</Button>
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
    background: #a8a8a8;
    color: #fff;
    font-weight: 600;
    line-height: 50px;
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
      width: 88px;
      height: 88px;
      margin: -1px;
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
const CheckWrap = styled.div``

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

const CheckBox = styled.div`
  overflow: hidden;
  height: 0px;
  transition: height 1s;
  &.on {
    height: 100px;
  }
`

const Button = styled.button`
  width: 100%;
  margin-top: 30px;
  background: ${COLOR_MAIN};
  color: #fff;
  line-height: 50px;
`
const InputWrap = styled.div`
  margin: 32px 0;
  input {
    margin-top: -1px;
  }
`
