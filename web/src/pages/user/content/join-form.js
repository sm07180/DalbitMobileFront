import React, {useState} from 'react'
import styled from 'styled-components'

import Label from './style-label'
import Input from './style-input'
import Button from './style-button'

const JoinForm = () => {
  const [boxState, setBoxState] = useState(false)

  const makeContents = () => {
    return (
      <SelectWrap>
        <Select>
          <option>년도</option>
          <option>2020</option>
          <option>2019</option>
          <option>2018</option>
          <option>2017</option>
        </Select>
        <Select>
          <option>월</option>
          <option>1</option>
          <option>2</option>
        </Select>
        <Select>
          <option>일</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </Select>
      </SelectWrap>
    )
  }
  return (
    <>
      <JoinText>
        입력하신 번호는 안전하게 보관됩니다. <br />
        휴대폰 번호 인증 후 새로운 비밀번호로 재등록 하셔야 합니다.
      </JoinText>

      <FormWrap>
        <Label before={true} text="닉네임" />
        <Input type="text" placeholder="닉네임을 입력해주세요." />
        <ValidateText>*2~20자 한글/영문/숫자를 포함할 수 있습니다.</ValidateText>
        <Label before={true} text="이름(실명)" />
        <Input type="text" placeholder="이름을 입력해주세요." />
        <ValidateText>*10자 한글/영문을 포함할 수 있습니다.</ValidateText>
        <Label before={true} text="비밀번호" />
        <Input type="text" />
        <ValidateText>
          * 8~20자로 영문/숫자/특수문자 중 2가지 이상 조합으로 입력하세요.<br></br> (대소문자 구분)
        </ValidateText>
        <Input type="password" placeholder="비밀번호 확인" />
        <Label before={true} text="생년월일" />
        {/* 컨텐츠 */}
        {makeContents()}
        <Label before={true} text="성별" />
        <input type="radio" name="gender" value="남성" defaultChecked /> 남성
        <input type="radio" name="gender" value="여성" /> 여성
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
        <Button text="회원가입 완료"></Button>
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
