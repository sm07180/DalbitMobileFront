import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {Context} from 'context'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

export default props => {
  //-------------------------------------------------- declare start
  const context = useContext(Context)
  const [bWidth, setWidth] = useState()
  const [tData, setTData] = useState([])
  const [item, setItem] = useState(-1)
  const [count, setCount] = useState(0)
  const [sendType, setSendType] = useState(1)

  //-------------------------------------------------- func start

  const widthCalc = () => {
    if (props.testData != undefined) {
      const barWidth = (props.testData.percent * 320) / 100
      setWidth(barWidth)
    }
  }

  const pickItem = idx => {
    if (item != idx) {
      setItem(idx)
      setCount(1)
    } else if (item === idx) {
      setCount(count + 1)
    }
  }

  useEffect(() => {
    widthCalc()
    context.action.updatePopup('SEND_PRESENT')
    context.action.updatePopupVisible(false)
  }, [])

  //-------------------------------------------------- components start

  return (
    <>
      {props.testData.guestYn === 'Y' && (
        <Target>
          <TargetInfo targetData={props.targetData} />
        </Target>
      )}
      <LevelInfo>
        <UserLevel>LEVEL {props.testData.level}</UserLevel>
        <NextLevel>다음 레벨까지 {props.testData.expNext}EXP 남았습니다.</NextLevel>
        <BarWrap>
          <span>0</span>
          <Bar>
            <Exp exp={bWidth}>{props.testData.exp}</Exp>
          </Bar>
          <span>{props.testData.maxExp}</span>
        </BarWrap>
      </LevelInfo>
      <BoxArea>
        {props.testBox.map((data, idx) => {
          return (
            <ItemInfo key={idx} onClick={() => pickItem(idx)}>
              {item == idx && (
                <Picked>
                  <img src={'https://devimage.dalbitcast.com/images/api/ic_multiplication@2x.png'} width={18} height={18} /> {count}
                </Picked>
              )}
              <ItemBox>
                <ItemImg>
                  <img src={'https://devimage.dalbitcast.com/images/api/ic_moon1@2x.png'} width={70} height={70} />
                </ItemImg>
                <Icon active={idx === item ? 'active' : ''}>
                  <img src={'https://devimage.dalbitcast.com/images/api/ic_moon_s@2x.png'} width={18} height={18} />
                  123
                </Icon>
              </ItemBox>
            </ItemInfo>
          )
        })}
      </BoxArea>
      <ButtonArea>
        <SendDirect onClick={() => props._sendType(1)}>
          <MyPoint>
            <img src={'https://devimage.dalbitcast.com/images/api/ic_moon_m@2x.png'} width={24} height={24} />
            123123
          </MyPoint>
          <Plus />
        </SendDirect>
        <Send>보내기</Send>
        <SecretSend onClick={() => context.action.updatePopupVisible(true)}>
          몰래
          <br />
          보내기
        </SecretSend>
      </ButtonArea>
    </>
  )
}

const TargetInfo = props => {
  const [state, setState] = useState(0)
  return (
    <>
      {props.targetData.map((data, idx) => {
        return (
          <Dj key={idx} onClick={() => setState(idx)} active={idx === state ? 'active' : ''}>
            <Profile>
              {/* <Photo>
                </Photo> */}
              <img src="https://devimage.dalbitcast.com/images/api/guest@2x.png" width={36} height={36} />

              <Tag target={data.type}>{data.type === 0 ? 'DJ' : '게스트'}</Tag>
            </Profile>
            <DjInfo>
              <div>{data.nickname}</div>
            </DjInfo>
          </Dj>
        )
      })}
    </>
  )
}

//-------------------------------------------------- styled start
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
  border-color: ${props => (props.active == 'active' ? '#8556f6' : '')};
  justify-content: center;
  align-items: center;
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
  font-weight: 800;
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
  font-weight: 400;
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
  font-weight: 400;

  & span {
    display: flex;
    align-items: center;
    color: #bdbdbd;
    font-size: 14px;
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
  justify-content: center;
  align-items: center;
`

const ItemInfo = styled.button`
  display: flex;
  width: 24%;
  height: 120px;
  margin-right: 3px;
  justify-content: center;
  align-items: center;
`

const ItemImg = styled.div`
  display: flex;
  width: 100%;
  height: 70px;
  /* border-style: solid;
  border-color: #e0e0e0;
  border-width: 1px; */
  align-items: center;
  justify-content: center;
`
const Icon = styled.div`
  display: flex;
  width: 100%;
  margin-top: 6px;
  justify-content: center;
  align-items: center;
  z-index: 110;

  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.35px;

  color: ${props => (props.active == 'active' ? '#fff' : '#757575')};
`
const ButtonArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
`

const SendDirect = styled.button`
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
  height: 48px;
  align-items: center;

  font-size: 18px;
  font-weight: 800;
  line-height: 0.78;
  letter-spacing: normal;
  color: #8556f6;
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
  font-weight: 400;
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
  font-weight: 400;
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
  display: flex;
  height: 14px;
  background-color: ${props => (props.target === 0 ? '#8555f6' : '#ec455f')};
  width: 36px;
  border-radius: 10px;
  color: #ffffff;
  font-size: 9px;
  font-weight: 400;
  line-height: 2.22;
  letter-spacing: -0.23px;
  text-align: center;
  position: absolute;
  bottom: 5px;
  justify-content: center;
  align-items: center;
`
const DjInfo = styled.div`
  display: flex;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.14;
  letter-spacing: -0.35px;
  text-align: left;
  align-items: center;
  justify-content: left;
  width: 80%;
  height: 35px;
  /* background-color: red; */
`
const Profile = styled.div`
  display: flex;
  flex-direction: column;
  width: 50px;
  height: 50px;
  align-items: center;
`
const Photo = styled.div`
  position: absolute;
  width: 36px;
  height: 36px;
`
const Picked = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.6);
  /* background: ${props => (props.active === 'active' ? 'rgba(0, 0, 0, 0.6)' : '')}; */
  z-index: 100;
  justify-content: center;
  align-items: center;

  font-size: 24px;
  font-weight: 600;
  line-height: 0.58;
  letter-spacing: -0.6px;
  text-align: left;
  color: #fff;

`
const ItemBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 94px;
  align-items: center;
  justify-content: center;
`
