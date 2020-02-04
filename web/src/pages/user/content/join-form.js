import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

//components
import Input from './input-type'
import Datepicker from './style-datepicker'
//import Button from './style-button'
import {COLOR_WHITE, COLOR_MAIN, COLOR_POINT_Y} from 'context/color'

import Api from 'context/api'

const JoinForm = props => {
  const [boxState, setBoxState] = useState(false)
  const {loginID, loginNickNm, loginName, gender, birth, image, memType, osName} = props.location.state
  const [changes, setChanges] = useState({...props.location.state, birth: new Date()})
  const [fetch, setFetch] = useState(null)

  // changes 의 변화의 따라 값을 넘기지 못한다. 20200204 제기랄
  const onLoginHandleChange = e => {
    console.log('------')
    setChanges({...changes, [e.target.name]: e.target.value})
  }

  async function fetchData() {
    //console.log(JSON.stringify(obj))
    console.log('회원가입 버튼 클릭 = ' + JSON.stringify(props))
    console.log('----')
    let birthYY = ''
    let birthMM = ''
    let birthDD = ''

    console.log('birth = ' + birth)
    if (changes.birth) {
      birthYY = birth.substring(0, 4)
      birthMM = birth.substring(5, 6)
      birthDD = birth.substring(7, 8)
    }

    console.log('birthYY = ' + birthYY)
    console.log('birthMM = ' + birthMM)
    console.log('birthDD = ' + birthDD)
    //if(props.loginNickNm)
    const res = await Api.member_join({
      data: {
        memType: memType,
        memId: loginID,
        gender: 'm',
        nickNm: loginNickNm,
        birthYY: birthYY,
        birthMM: birthMM,
        birthDD: birthDD,
        term1: 'y',
        term2: 'y',
        term3: 'y',
        name: props.loginName,
        os: osName
      }
    })
    setFetch(res)
    console.log('회원가입 = ' + JSON.stringify(res))
    if (res && res.code) {
      if (res.code == 0) {
        alert(res.message)
        window.location.href = '/' // 홈페이지로 새로고침
      } else {
        alert(res.message)
      }
    }
  }

  useEffect(() => {
    console.log('changes = ' + JSON.stringify(changes, null, 1))
  }, [changes])

  return (
    <>
      <JoinText>
        입력하신 번호는 안전하게 보관됩니다. <br />
        휴대폰 번호 인증 후 새로운 비밀번호로 재등록 하셔야 합니다.
      </JoinText>

      <FormWrap>
        닉네임
        <input type="text" name="loginNickNm" defaultValue={loginNickNm} onChange={onLoginHandleChange} />
        실명
        <input type="text" name="loginName" defaultValue={loginName} onChange={onLoginHandleChange} />
        <Input type="password" />
        <Label before={true} text="성별" />
        <input type="radio" name="gender" value="남성" defaultChecked={gender === 'm' ? true : false} /> 남성
        <input type="radio" name="gender" value="여성" defaultChecked={gender === 'f' ? true : false} /> 여성
        <input type="text" name="birth" defaultValue={changes.birth} onChange={onLoginHandleChange} />
        {/* <Datepicker
          text="생년월일"
          name="birth"
          value={changes.birth}
          onChange={() => {
            console.log('생년월일 ㅁ변화')
          }}
        /> */}
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
        <Button onClick={() => fetchData()}>회원가입</Button>
      </FormWrap>
    </>
  )
}

export default JoinForm

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

const CheckWrap = styled.div`
  margin-top: 30px;
`

const CheckBox = styled.div`
  overflow: hidden;
  height: 0px;
  transition: height 1s;
  &.on {
    height: 100px;
  }
`
//---------------------------------------------------------------------
const Button = styled.button`
  width: 100%;
  margin-top: 30px;
  background: ${COLOR_MAIN};
  color: #fff;
  line-height: 50px;
`
