import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {BotButton} from './bot-button'
import {Context} from 'context'

const testData = [20, 50, 100, 500, 1000]
// 선택 한 유저에게 선물하기 청취자or게스트 화면과 연동 필요함
export default props => {
  //-------------------------------------------------------- declare start
  const [point, setPoint] = useState()
  const [text, setText] = useState('')
  const [active, setActive] = useState(false)
  const [send, setSend] = useState(false)
  const context = useContext(Context)
  //-------------------------------------------------------- func start
  const handleChangeInput = event => {
    const {value, maxLength} = event.target
    console.log('# value', value)
    if (value.length > maxLength) {
      alert('## Max Length is 5 ##')
      return false
    }

    setText(value)
  }

  const _active = param => {
    if (param === 'input') {
      setPoint(-1)
      setActive(true)
    } else {
      setPoint(param)
      setActive(false)
      setText('')
    }
    setSend(true)
  }

  useEffect(() => {
    context.action.updatePopup('CHARGE')
    context.action.updatePopupVisible(false)
  }, [])
  //-------------------------------------------------------- components start
  console.log('## text : ', text)
  console.log('## context : ', context)
  return (
    <Container>
      <Contents>
        <div>
          <p>
            <span>솜사탕사탕사탕</span> 님에게
          </p>
          <p>루비를 선물하시겠습니까?</p>
        </div>
      </Contents>
      <MyPoint>
        <div>보유 달 &nbsp;120</div>
      </MyPoint>
      <Select>
        {testData.map((data, idx) => {
          return (
            <PointButton key={idx} onClick={() => _active(idx)} active={point == idx ? 'active' : ''}>
              {data}
            </PointButton>
          )
        })}
      </Select>
      <TextArea>
        <PointInput placeholder="직접 입력" type="number" maxLength="5" value={text} onChange={handleChangeInput} onClick={() => _active('input')} active={active ? 'active' : ''} />
        <p>*선물하신 달은 별로 전환되지 않습니다.</p>
      </TextArea>
      <ButtonArea>
        <BotButton title={'충전하기'} borderColor={'#8556f6'} color={'#8556f6'} clickEvent={() => context.action.updatePopupVisible(true)} />
        <BotButton title={'선물하기'} borderColor={'#bdbdbd'} background={send ? '#8556f6' : '#bdbdbd'} color={'#fff'} />
      </ButtonArea>
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
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: -0.4px;
    text-align: center;
  }

  & > div > p > span {
    font-weight: 600;
  }
`

const MyPoint = styled.div`
  display: flex;
  width: 100%;
  height: 20px;
  justify-content: flex-end;
  margin-bottom: 10px;

  font-size: 16px;
  font-weight: 600;
  line-height: 1.13;
  letter-spacing: -0.4px;
  text-align: center;
  color: #ec455f;
`
const Select = styled.div`
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
  font-weight: 400;
`
const TextArea = styled.div`
  display: flex;
  width: 100%;
  height: 58px;
  flex-direction: column;
  margin-top: 8px;

  & > p {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.14;
    letter-spacing: -0.35px;
    color: #bdbdbd;
  }
`
const PointInput = styled.input`
  display: flex;
  width: 100%;
  height: 32px;
  border-style: solid;
  border-width: 1px;
  border-radius: 10px;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 10px;

  font-size: 14px;
  font-weight: 400;
  line-height: 1.14;
  letter-spacing: -0.35px;
  border-color: ${props => (props.active === 'active' ? '#8556f6' : '#e0e0e0')};
`
const ButtonArea = styled.div`
  display: flex;
  width: 100%;
  height: 8%;
  justify-content: space-between;
  align-items: center;
`
