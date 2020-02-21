import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {Context} from 'context'
// import PopUp from '../../../components/ui/pop-mic'

const testData = [
  {
    totalCount: 88,
    rankNow: 15,
    activeType: 'Y'
  }
]

export default props => {
  const context = useContext(Context)
  useEffect(() => {
    console.log('## context : ', context)
    // context.action.updatePopupVisible(false)
  }, [])
  return (
    <Container>
      <Contents>
        <Title>현재 방송방 순위</Title>
        <Rank>
          <Now active={testData[0].activeType === 'Y' ? 'active' : ''}>15&nbsp;</Now>
          <Total>/88</Total>
        </Rank>
        <BoostImgArea>
          <img src="https://devimage.dalbitcast.com/images/api/inactive@2x.png" width={155} height={145} />
        </BoostImgArea>
        {testData[0].activeType === 'Y' ? <TimeActive>n개 사용중 | 24: 30</TimeActive> : <TimeInactive>30:00</TimeInactive>}
        <Info>
          <p>부스트 사용시, 방송방 순위를</p>
          <p>빠르게 올릴수 있습니다.</p>
          <Point active={testData[0].activeType === 'Y' ? 'active' : ''}>30분 동안 인기도(좋아요) +10상승</Point>
        </Info>
        <UseBoost>부스터 사용</UseBoost>
      </Contents>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
`
const Contents = styled.div`
  display: flex;
  width: 100%;
  height: 375px;
  flex-direction: column;
  align-items: center;
`
const Rank = styled.div`
  display: flex;
  width: 49px;
  height: 22px;
  justify-content: center;
  align-items: center;
`

const Now = styled.div`
  display: flex;
  font-size: 20px;
  letter-spacing: -0.5px;
  font-weight: 600;
  color: ${props => (props.active === 'active' ? '#8556f6' : '#616161')};
`
const Total = styled.div`
  display: flex;
  color: #9e9e9e;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.83;
  letter-spacing: -0.35px;
  font-weight: 400;
  text-align: left;
`
const Title = styled.div`
  display: flex;
  width: 100%;
  height: 48px;
  font-size: 20px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.5px;
  justify-content: center;
  align-items: center;
`
const BoostImgArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 169.1px;
  height: 156.2px;
`
const TimeInactive = styled.div`
  display: flex;
  width: 70px;
  height: 32px;
  border-radius: 16px;
  border-style: solid;
  border-color: #9e9e9e;
  border-width: 1px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;

  font-size: 16px;
  font-weight: 600;
  line-height: 1.31;
  letter-spacing: -0.4px;
  text-align: left;
  color: #707070;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 250px;
  height: 56px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.43;
  letter-spacing: -0.35px;
  margin-top: 16px;
  color: #616161;
`

const Point = styled.p`
  display: flex;
  text-align: center;
  justify-content: center;
  width: 250px;
  height: 96px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.43;
  letter-spacing: -0.35px;
  color: ${props => (props.active === 'active' ? '#ec455f' : '#8555f6')};
`
const UseBoost = styled.button`
  display: flex;
  width: 100%;
  height: 48px;
  background-color: #8556f6;
  border-radius: 10px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.13;
  letter-spacing: -0.4px;
  align-items: center;
  justify-content: center;
  margin-top: 14px;
`
const TimeActive = styled.div`
  display: flex;
  height: 32px;
  border-radius: 16px;
  background-color: #ec455f;
  color: #fff;
  justify-content: center;
  align-items: center;
  padding-left: 7px;
  padding-right: 7px;
  margin-top: 10px;

  font-size: 16px;
  font-weight: 600;
  line-height: 1.31;
  letter-spacing: -0.4px;
  text-align: left;
`
