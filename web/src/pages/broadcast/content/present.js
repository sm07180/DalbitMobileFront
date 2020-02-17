import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import Navi from './navibar'
import {calculateString} from 'bytebuffer'

const testData = [
  {
    level: 11,
    expNext: 160,
    exp: 140,
    maxExp: 300,
    percent: 42,
    guestYn: 'Y'
  }
]

const testBox = [0, 1, 2, 3, 4, 5, 6, 7]
export default props => {
  const [bWidth, setWidth] = useState()

  const widthCalc = () => {
    if (testData != undefined) {
      const barWidth = (testData[0].percent * 320) / 100
      setWidth(barWidth)
    }
  }

  useEffect(() => {
    widthCalc()
  }, [])
  console.log('## bWidth : ', bWidth)
  return (
    <Container>
      <Navi title={'선물'} />
      {testData[0].guestYn === 'Y' && (
        <Target>
          <TargetInfo />
        </Target>
      )}
      <LevelInfo>
        <UserLevel>LEVEL {testData[0].level}</UserLevel>
        <NextLevel>다음 레벨까지 {testData[0].expNext}EXP 남았습니다.</NextLevel>
        <BarWrap>
          <span>0</span>
          <Bar>
            <Exp exp={bWidth}>{testData[0].exp}</Exp>
          </Bar>
          <span>{testData[0].maxExp}</span>
        </BarWrap>
      </LevelInfo>
      <BoxArea>
        {testBox.map((data, idx) => {
          return (
            <ItemInfo key={idx}>
              <ItemBox />
              <Icon>
                <div></div>123
              </Icon>
            </ItemInfo>
          )
        })}
      </BoxArea>
      <ButtonArea>
        <Charge>
          <MyPoint>
            <div></div>
            <span>648</span>
          </MyPoint>
          <Plus />
        </Charge>
        <Send>보내기</Send>
        <SecretSend>
          몰래
          <br />
          보내기
        </SecretSend>
      </ButtonArea>
    </Container>
  )
}

const TargetInfo = props => {
  return (
    <>
      <Dj>
        <DjImg></DjImg>
        <DjInfo>
          <Tag target={'dj'}>DJ</Tag>
          <div>{props.nickname}</div>
        </DjInfo>
      </Dj>
      <Dj>
        <DjImg></DjImg>
        <DjInfo>
          <Tag target={'dj'}>DJ</Tag>
          <div>{props.nickname}</div>
        </DjInfo>
      </Dj>
    </>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #fff;
  flex-direction: column;

  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 360px;
  }
`

const Target = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 56px;
  margin-top: 15px;
`

const Dj = styled.button`
  display: flex;
  width: 49%;
  height: 100%;
  border-radius: 10px;
  border-width: 1px;
  border-color: #bdbdbd;
  border-style: solid;
  padding-left: 5px;
  padding-right: 5px;
  /* justify-content: center; */
  /* align-items: center; */
`
const Guest = styled.button`
  display: flex;
  width: 49%;
  height: 100%;
  border-radius: 10px;
  border-width: 1px;
  border-color: #bdbdbd;
  border-style: solid;
`
const LevelInfo = styled.div`
  display: flex;
  width: 100%;
  height: 140px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const UserLevel = styled.div`
  display: flex;
  width: 100%;
  font-size: 22px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.09;
  letter-spacing: -0.55px;
  justify-content: center;
  align-items: center;
  text-align: center;
`
const NextLevel = styled.div`
  display: flex;
  width: 100%;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  color: #616161;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: -0.35px;
  text-align: center;
`
const BarWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 20px;
  margin-top: 10px;

  & span {
    display: flex;
    align-items: center;
    color: #bdbdbd;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
  }
`

const Bar = styled.div`
  display: flex;
  width: 310px;
  background-color: #fff;
  border-radius: 10px;
  margin-left: 5px;
  margin-right: 5px;
  border-width: 1px;
  border-color: #e0e0e0;
  border-style: solid;
`
const Exp = styled.div`
  display: flex;
  width: ${props => (props.exp ? props.exp + 'px' : '0px')};
  border-radius: 10px;
  background-color: #8556f6;
  margin-left: 0px;
  flex-direction: row;
  justify-content: flex-end;
  padding-right: 5px;
  color: #ffffff;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
`
const BoxArea = styled.div`
  display: flex;
  flex-flow: wrap;
  width: 100%;
  height: 250px;
`

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 24%;
  height: 100px;
  margin-right: 3px;
  align-items: center;
`

const ItemBox = styled.button`
  display: flex;
  width: 100%;
  height: 76px;
  border-style: solid;
  border-color: #e0e0e0;
  border-width: 1px;
`
const Icon = styled.div`
  display: flex;
  width: 100%;
  margin-top: 6px;
  justify-content: center;
  align-items: center;

  & div {
    width: 16px;
    height: 16px;
    background-color: black;
    margin-right: 5px;
  }
`
const ButtonArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Charge = styled.button`
  display: flex;
  width: 177px;
  height: 48px;
  border-radius: 10px;
  border-style: solid;
  border-color: #8556f6;
  border-width: 1px;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
`

const Plus = styled.div`
  display: flex;
  width: 16px;
  height: 16px;
  background-color: #8556f6;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
`

const MyPoint = styled.div`
  display: flex;
  width: 50px;
  height: 50px;
  align-items: center;

  & div {
    background-color: black;
    width: 16px;
    height: 16px;
    margin-right: 5px;
  }
`
const Send = styled.button`
  display: flex;
  width: 108px;
  height: 48px;
  background-color: #8556f6;
  border-radius: 10px;
  margin-left: 8px;
  align-items: center;
  justify-content: center;

  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.13;
  letter-spacing: -0.4px;
  text-align: center;
  color: #fff;
`
const SecretSend = styled.button`
  display: flex;
  width: 60px;
  height: 48px;
  background-color: #fdad2b;
  border-radius: 10px;
  margin-left: 8px;
  align-items: center;
  justify-content: center;

  color: #fff;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: -0.35px;
`
const DjImg = styled.div`
  width: 36px;
  height: 36px;
  background-color: #8555f6;
  border-radius: 30px;
`
const Tag = styled.div`
  height: 16px;
  background-color: ${props => (props.target == 'dj' ? '#8555f6' : '#ec455f')};
  width: ${props => (props.target == 'dj' ? '25px' : '42px')};
  border-radius: 10px;
  color: #ffffff;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.67;
  letter-spacing: -0.3px;
  text-align: left;
  padding-left: 5px;
  padding-right: 5px;
  margin-bottom: 5px;
`
const DjInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: -0.35px;
  text-align: left;
  width: 80%;
`
