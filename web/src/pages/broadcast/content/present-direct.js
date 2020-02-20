import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

const testData = [20, 50, 100, 500, 1000]
export default props => {
  //-------------------------------------------------------- declare start
  const [point, setPoint] = useState()
  const [text, setText] = useState('')
  //-------------------------------------------------------- func start
  const handleChangeInput = event => {
    const {value, maxLength} = event.target
    console.log('# maxLength : ', maxLength)
    if (value.length > maxLength) {
      alert('## Max Length is 5 ##')
      return false
    }

    setText(value)
  }
  //-------------------------------------------------------- components start
  console.log('## text : ', text)
  return (
    <Container>
      <Contents>
        <div>
          <p>
            <b>솜사탕사탕사탕</b> 님에게
          </p>
          <p>루비를 선물하시겠습니까?</p>
        </div>
      </Contents>
      <MyPoint>
        <div>보유 달 &nbsp;120</div>
      </MyPoint>
      <ButtonArea>
        {testData.map((data, idx) => {
          return (
            <PointButton key={idx} onClick={() => setPoint(idx)} active={point == idx ? 'active' : ''}>
              {data}
            </PointButton>
          )
        })}
      </ButtonArea>
      <TextArea>
        <PointInput placeholder="직접 입력a" type="number" maxLength="5" value={text} onChange={handleChangeInput} />
        <p>*선물하신 달은 별로 전환되지 않습니다.</p>
      </TextArea>
    </Container>
  )
}
//-------------------------------------------------------- styled start

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 338%;
`
const Contents = styled.div`
  display: flex;
  width: 100%;
  height: 98px;
  justify-content: center;
  align-items: center;

  & > div {
    width: 168px;
    height: 42px;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: -0.4px;
    text-align: center;
  }
`

const MyPoint = styled.div`
  display: flex;
  width: 100%;
  height: 20px;
  justify-content: flex-end;
  margin-bottom: 10px;

  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.13;
  letter-spacing: -0.4px;
  text-align: center;
  color: #ec455f;
`
const ButtonArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: center;
  width: 100%;
  height: 32px;
`

const PointButton = styled.button`
  width: 64px;
  height: 32px;
  border-style: solid;
  border-color: ${props => (props.active == 'active' ? '#8556f6' : '#e0e0e0')};
  border-width: 1px;
  border-radius: 10px;
  color: ${props => (props.active == 'active' ? '#8556f6' : '#616161')};
`
const TextArea = styled.div`
  display: flex;
  width: 100%;
  height: 58px;
  flex-direction: column;
  margin-top: 8px;
`
const PointInput = styled.input`
  display: flex;
  width: 100%;
  height: 32px;
  border-style: solid;
  border-width: 1px;
  border-radius: 10px;
  border-color: #e0e0e0;
  padding-left: 10px;
  padding-right: 10px;

  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: -0.35px;
`
