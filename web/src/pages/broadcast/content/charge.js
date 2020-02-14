import React, {useEffect, useState} from 'react'
import styled from 'styled-components'

const testData = [
  {
    name: 30,
    price: '3,000'
  },
  {
    name: 100,
    price: '10,000'
  },
  {
    name: 300,
    price: '30,000'
  },
  {
    name: 500,
    price: '50,000'
  },
  {
    name: 1000,
    price: '100,000'
  },
  {
    name: 3000,
    price: '300,000'
  }
]
export default props => {
  const [choice, setChoice] = useState('moon')
  const [goodsState, setGoods] = useState(0)
  return (
    <Container>
      <ChargeChoice>
        <ChargeTitle>
          {choice === 'moon' ? (
            <Choice active onClick={() => setChoice('moon')}>
              달 충전
            </Choice>
          ) : (
            <Choice onClick={() => setChoice('moon')}>달 충전</Choice>
          )}

          <Separator>|</Separator>
          {choice === 'star' ? (
            <Choice active onClick={() => setChoice('star')}>
              별 충전
            </Choice>
          ) : (
            <Choice onClick={() => setChoice('star')}>별 충전</Choice>
          )}
        </ChargeTitle>
      </ChargeChoice>
      <MyPoint>보유 {choice === 'moon' ? '달' : '별'} 120</MyPoint>
      <Goods>
        {testData.map((goods, key) => {
          return (
            <GoodsInfo active={key === goodsState ? 'active' : ''} onClick={() => setGoods(key)}>
              <Icon></Icon>
              <GoodsName active={key === goodsState ? 'active' : ''}>
                {choice === 'moon' ? '달' : '별'} {goods.name}
              </GoodsName>
              <Price active={key === goodsState ? 'active' : ''}>{goods.price}원</Price>
            </GoodsInfo>
          )
        })}
      </Goods>
      <ButtonArea></ButtonArea>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 362px;
  height: 608px;
  background-color: #fff;
  margin-left: 20px;
  flex-direction: column;
  /* background-color: red; */
`

const ChargeChoice = styled.div`
  display: flex;
  width: 100%;
  height: 88px;
  flex-direction: row;
  justify-content: center;
  /* background-color: red; */
`

const Choice = styled.button`
  display: flex;
  width: 50%;
  justify-content: center;
  /* font-family: NanumSquareEB; */
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.17;
  letter-spacing: -0.45px;
  color: ${props => (props.active ? '#8556f6' : '#9e9e9e')};
`

const Separator = styled.section`
  width: 1px;
  height: 18px;
  display: flex;
  color: #e0e0e0;
`
const ChargeTitle = styled.div`
  display: flex;
  width: 100%;
  height: 40%;
  align-items: center;
  padding-top: 5vh;
`

const MyPoint = styled.div`
  /* font-family: NanumSquareB; */
  display: flex;
  width: 100%;
  height: 30px;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: -0.35px;
  justify-content: center;
`

const Goods = styled.div`
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
  width: 100%;
  height: 264px;
`
const GoodsInfo = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 115px;
  height: 126px;
  margin-bottom: 10px;
  border-color: ${props => (props.active ? '#ec455f' : '#e0e0e0')};
  border-style: solid;
  border-radius: 10px;
  border-width: 1px;
`

const Price = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 99px;
  height: 30px;
  background-color: ${props => (props.active ? '#ec455f' : '#eeeeee')};
  color: ${props => (props.active ? '#ffffff' : '#757575')};
  border-radius: 10px;
`

const GoodsName = styled.div`
  width: 100px;
  height: 18px;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  color: ${props => (props.active ? '#ec455f' : '#424242')};
`
const ButtonArea = styled.div`
  width: 100%;
  height: 150px;
  background-color: blue;
`

const Icon = styled.div`
  width: 25px;
  height: 25px;
  background-color: black;
  margin-bottom: 10px;
`
const Cancel = styled.button``
