import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {Context} from 'context'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

export default props => {
  //----------------------------------------------- declare
  const context = useContext(Context)

  //----------------------------------------------- func

  //----------------------------------------------- components
  return (
    <Container>
      <Main>
        <Title>몰래 온 선물</Title>
        <Info>
          <img src={`${IMG_SERVER}/images/api/ic_moon4@2x.png`} width={48} height={48} />
          <img src={`${IMG_SERVER}/images/api/ic_multiplication_p@2x.png`} width={18} height={18} />
          10
        </Info>
        <Contents>
          <div>
            <span>BJ라디오라디오😍</span>님께서<p>도넛 10개를 선물하셨습니다.</p>
          </div>
        </Contents>
      </Main>
      <Confirm onClick={() => context.action.updatePopupVisible(false)}>확인</Confirm>
    </Container>
  )
}

//----------------------------------------------- styled
const Container = styled.div`
  display: flex;
  width: 300px;
  height: 239px;
  background-color: #fff;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  padding-top: 30px;
  padding-bottom: 12px;
`

const Title = styled.div`
  display: flex;
  width: 100%;
  height: 22px;
  /* & h4 {
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: center;
    color: #424242;
  } */
  font-size: 20px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: center;
  color: #424242;
  justify-content: center;
`
const Info = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 48px;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
  margin-bottom: 4px;

  font-size: 18px;
  font-weight: 600;
  line-height: 1.44;
  letter-spacing: normal;
  text-align: center;
  color: #8555f6;
`
const Contents = styled.div`
  display: flex;
  width: 190px;
  height: 39px;

  font-size: 14px;
  font-weight: 400;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: center;
  justify-content: center;
  align-items: center;

  & div > span {
    font-family: 600;
  }
`
const Confirm = styled.button`
  display: flex;
  width: 276px;
  height: 48px;
  border-radius: 10px;
  border: solid 1px #8555f6;
  background-color: #8555f6;
  justify-content: center;
  align-items: center;

  font-size: 14px;
  font-weight: 400;
  line-height: 1.71;
  letter-spacing: -0.35px;
  text-align: center;
  color: #fff;
`
const Main = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 120px;
  justify-content: center;
  align-items: center;
`
const Close = styled.button`
  position: absolute;
  top: 328px;
  left: 858px;
`
