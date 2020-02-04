import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

//components
import Input from './input-type'
import Datepicker from './style-datepicker'
import Button from './style-button'

const JoinForm = props => {
  const [boxState, setBoxState] = useState(false)
  const {loginID, loginNickNm, loginName, gender, birth, image} = props.location.state
  const [changes, setChanges] = useState(props.location.state)

  const onLoginHandleChange = e => {
    setChanges({...changes, [e.target.name]: e.target.value})
  }
  useEffect(() => {
    console.log('changes = ' + JSON.stringify(changes))
  }, [changes])

  return (
    <>
      <JoinText>
        입력하신 번호는 안전하게 보관됩니다. <br />
        휴대폰 번호 인증 후 새로운 비밀번호로 재등록 하셔야 합니다.
      </JoinText>

      <FormWrap>
        닉네임
        <input type="text" name="loginID" onChange={onLoginHandleChange} />
        실명
        <input type="text" name="loginName" onChange={onLoginHandleChange} />
        <Input type="password" />
        <Label before={true} text="성별" />
        <input type="radio" name="gender" value="남성" defaultChecked={gender === 'm' ? true : false} /> 남성
        <input type="radio" name="gender" value="여성" defaultChecked={gender === 'f' ? true : false} /> 여성
        <Datepicker text="생년월일" value={birth} />
        <CheckWrap>
          <input type="checkbox" /> <Label text="약관 전체 동의" />
          <button
            onClick={() => {
              setBoxState(true)
            }}>
            펼치기
          </button>
          <CheckBox className={boxState ? 'on' : ''}>
            <input type="checkbox" /> 서비스 이용약관 동의(필수)
            <input type="checkbox" /> 개인정보 취급방침(필수)
            <input type="checkbox" /> 마케팅 정보 제공 동의(선택)
          </CheckBox>
        </CheckWrap>
        <Button text="회원가입 완료" {...changes}></Button>
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
