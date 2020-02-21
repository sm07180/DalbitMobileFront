import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import Navi from './navibar'

const testMoon = [
  {
    name: 30,
    price: '3,000',
    imgUrl: 'https://devimage.dalbitcast.com/images/api/ic_moon1@2x.png'
  },
  {
    name: 100,
    price: '10,000',
    imgUrl: 'https://devimage.dalbitcast.com/images/api/ic_moon2@2x.png'
  },
  {
    name: 300,
    price: '30,000',
    imgUrl: 'https://devimage.dalbitcast.com/images/api/ic_moon3@2x.png'
  },
  {
    name: 500,
    price: '50,000',
    imgUrl: 'https://devimage.dalbitcast.com/images/api/ic_moon4@2x.png'
  },
  {
    name: 1000,
    price: '100,000',
    imgUrl: 'https://devimage.dalbitcast.com/images/api/ic_moon5@2x.png'
  },
  {
    name: 3000,
    price: '300,000',
    imgUrl: 'https://devimage.dalbitcast.com/images/api/ic_moon6@2x.png'
  }
]

const testStar = [
  {
    name: 30,
    price: '50',
    imgUrl: 'https://devimage.dalbitcast.com/images/api/ic_moon1@2x.png'
  },
  {
    name: 100,
    price: '166',
    imgUrl: 'https://devimage.dalbitcast.com/images/api/ic_moon2@2x.png'
  },
  {
    name: 300,
    price: '500',
    imgUrl: 'https://devimage.dalbitcast.com/images/api/ic_moon3@2x.png'
  },
  {
    name: 500,
    price: '833',
    imgUrl: 'https://devimage.dalbitcast.com/images/api/ic_moon4@2x.png'
  },
  {
    name: 1000,
    price: '1666',
    imgUrl: 'https://devimage.dalbitcast.com/images/api/ic_moon5@2x.png'
  },
  {
    name: 3000,
    price: '5000',
    imgUrl: 'https://devimage.dalbitcast.com/images/api/ic_moon6@2x.png'
  }
]
export default props => {
  const [choice, setChoice] = useState('moon')
  const [goodsState, setGoods] = useState(-1)
  const [testData, setTestData] = useState(testMoon)

  const setData = async param => {
    if (param == 'moon') {
      setTestData(testMoon)
      setChoice('moon')
      setGoods(-1)
    } else {
      setTestData(testStar)
      setChoice('star')
      setGoods(-1)
    }
  }

  useEffect(() => {}, [choice])

  const Ctgr = props => {
    return (
      <>
        {choice === 'moon' ? (
          <Choice active onClick={() => setData('moon')}>
            현금 충전
          </Choice>
        ) : (
          <Choice onClick={() => setData('moon')}>현금 충전</Choice>
        )}

        <Separator>|</Separator>
        {choice === 'star' ? (
          <Choice active onClick={() => setData('star')}>
            별 충전
          </Choice>
        ) : (
          <Choice onClick={() => setData('star')}>별 충전</Choice>
        )}
      </>
    )
  }

  // const Title = props => {
  //   return <Navi>{props.title}</Navi>
  // }

  return (
    <Container>
      <Navi title={'충전'} />
      <ChargeChoice>
        <ChargeTitle>
          <Ctgr />
        </ChargeTitle>
      </ChargeChoice>
      <MyPoint>보유 {choice === 'moon' ? '달' : '별'} 120</MyPoint>
      <Goods>
        {testData.map((goods, idx) => {
          return (
            <GoodsInfo active={idx === goodsState ? 'active' : ''} onClick={() => setGoods(idx)} key={idx} state={choice}>
              {/* <Icon imgUrl={goods.imgUrl} /> */}
              <img src={goods.imgUrl} width={80} height={80} />
              <GoodsName active={idx === goodsState ? 'active' : ''} state={choice}>
                달 {goods.name}
              </GoodsName>
              <Price active={idx === goodsState ? 'active' : ''} state={choice}>
                {choice === 'star' && <img src="https://devimage.dalbitcast.com/images/api/ic_star_s@2x.png" width={18} height={18} />}
                {goods.price}
                {choice === 'moon' && '원'}
              </Price>
            </GoodsInfo>
          )
        })}
      </Goods>
      <ButtonArea>
        {choice === 'moon' ? (
          <>
            <Cancel>취소</Cancel>
            <Charge active={goodsState != -1 ? 'active' : ''}>구매하기</Charge>
          </>
        ) : (
          <ChargeS active={goodsState != -1 ? 'active' : ''}>별로 구매하기</ChargeS>
        )}
      </ButtonArea>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
  /* width: 362px; */
  height: 100%;
  background-color: #fff;
  /* margin-left: 20px; */
  flex-direction: column;
  /* background-color: red; */
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 360px;
  }
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
  font-weight: 800;
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
  display: flex;
  width: 100%;
  height: 30px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.14;
  letter-spacing: -0.35px;
  justify-content: center;
`

const Goods = styled.div`
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
  width: 100%;
  height: 290px;
`
const GoodsInfo = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 115px;
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 104px;
  }
  height: 138px;
  margin-bottom: 4px;
  border-color: ${props => (props.state === 'moon' ? (props.active ? '#ec455f' : '') : props.active ? '#fdad2b' : '')};
  border-style: ${props => (props.active ? 'solid' : 'none')};
  border-radius: 10px;
  border-width: 1px;
  background: ${props => (props.active ? '#fff' : '#f5f5f5')};
`

const Price = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 110px;
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 100px;
  }
  height: 28px;
  background-color: ${props => (props.state === 'moon' ? (props.active ? '#ec455f' : '#e0e0e0') : props.active ? '#fdad2b' : '#e0e0e0')};
  color: ${props => (props.active ? '#ffffff' : '#757575')};
  border-radius: 10px;
  margin-top: 4px;

  font-size: 16px;
  font-weight: 600;
  line-height: 1.13;
  letter-spacing: -0.4px;
  text-align: center;
`

const GoodsName = styled.div`
  width: 100px;
  height: 16px;
  display: flex;
  justify-content: center;
  margin-bottom: 6px;
  color: ${props => (props.state === 'moon' ? (props.active ? '#ec455f' : '#424242') : props.active ? '#fdad2b' : '#424242')};
  font-size: 14px;
  font-weight: 400;
  /* line-height: 1.14; */
  letter-spacing: -0.35px;
`
const ButtonArea = styled.div`
  display: flex;
  width: 100%;
  height: 8%;
  /* background-color: blue; */
  justify-content: space-between;
  align-items: center;
`

const Icon = styled.div`
  width: 25px;
  height: 25px;
  /* background-color: black; */
  margin-bottom: 10px;
`
const Cancel = styled.button`
  width: 48%;
  height: 5vh;
  background-color: white;
  border-radius: 10px;
  border-width: 1px;
  border-style: solid;
  border-color: #8556f6;
  color: #8556f6;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.13;
  letter-spacing: -0.4px;
`
const Charge = styled.button`
  width: 48%;
  height: 5vh;
  background: ${props => (props.active ? '#8556f6' : '#bdbdbd')};
  border-radius: 10px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.13;
  letter-spacing: -0.4px;
`
const ChargeS = styled.button`
  display: flex;
  width: 100%;
  height: 5vh;
  background: ${props => (props.active ? '#8556f6' : '#bdbdbd')};
  border-radius: 10px;
  color: #ffffff;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.13;
  letter-spacing: -0.4px;
  align-items: center;
  justify-content: center;
`
