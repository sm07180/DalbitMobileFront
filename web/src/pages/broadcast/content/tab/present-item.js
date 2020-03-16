import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'
import {Context} from 'context'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import {Scrollbars} from 'react-custom-scrollbars'
import Utility from 'components/lib/utility'

export default props => {
  //-------------------------------------------------- declare start
  const context = useContext(Context)
  const [bWidth, setWidth] = useState()
  const [tData, setTData] = useState([])
  const [item, setItem] = useState(-1)
  const [count, setCount] = useState(0)
  const [sendType, setSendType] = useState(1)
  const [percent, setPercent] = useState(0)
  const [itemNo, setItemNo] = useState(-1)
  const scrollbars = useRef(null)

  //-------------------------------------------------- func start

  const widthCalc = () => {
    // expNext 필요 경험치 150 exp
    // exp 현재 경험치 50
    // 퍼센트 계산함수
    if (props.profile != undefined) {
      const barWidth = (236 * props.profile.expRate) / 100
      setWidth(barWidth)
    }
  }

  const pickItem = (idx, itemNo) => {
    if (item != idx) {
      setItem(idx)
      setCount(1)
      setItemNo(itemNo)
    } else if (item === idx) {
      setCount(count + 1)
      setItemNo(itemNo)
    }
  }

  useEffect(() => {
    context.action.updatePopup('CHARGE')
    context.action.updatePopupVisible(false)
  }, [])

  useEffect(() => {
    widthCalc()
  }, [props.profile])

  useEffect(() => {
    setItem(-1)
  }, [props.flag])
  console.log('## props.profile :', props.profile)
  //-------------------------------------------------- components start
  return (
    <Container>
      <MainContents>
        <LevelInfo>
          <DashBoard>
            {props.testData.guestYn === 'Y' && (
              <Target>
                <TargetInfo bjNickNm={props.bjNickNm} />
              </Target>
            )}
            <Level>
              <UserLevel>LEVEL {props.profile != undefined && props.profile.level}</UserLevel>
              <BarWrap>
                <Bar>
                  <Exp exp={bWidth}>{props.profile != undefined && props.profile.expRate}%</Exp>
                </Bar>
              </BarWrap>
            </Level>
            <MyItem>
              <div className="myTitle">내가 보유한 달</div>
              <div className="myItem">
                {Utility.addComma(props.profile != undefined && props.profile.dalCnt)}&nbsp;&nbsp;<button>+</button>
              </div>
            </MyItem>
          </DashBoard>
        </LevelInfo>
        <Scrollbars ref={scrollbars} style={{height: '60%'}} autoHide>
          <BoxArea>
            {props.common !== undefined &&
              props.common.items.map((data, idx) => {
                return (
                  <ItemInfo key={idx} onClick={() => pickItem(idx, data.itemNo)}>
                    {item == idx && (
                      <Picked>
                        <img src={'https://devimage.dalbitcast.com/images/api/ic_multiplication@2x.png'} width={18} height={18} /> {count}
                      </Picked>
                    )}
                    <ItemBox>
                      <ItemImg>
                        <img src={data.thumbs} width={70} height={70} />
                      </ItemImg>
                      <Icon active={idx === item ? 'active' : ''}>
                        <img src={'https://devimage.dalbitcast.com/images/api/ic_moon_s@2x.png'} width={18} height={18} />
                        {data.cost}
                      </Icon>
                    </ItemBox>
                  </ItemInfo>
                )
              })}
          </BoxArea>
        </Scrollbars>
      </MainContents>
      <ButtonArea>
        <SecretSend onClick={() => props.send(count, itemNo, true)}>몰래&nbsp;보내기</SecretSend>
        <Send onClick={() => props.send(count, itemNo, false)}>보내기</Send>
      </ButtonArea>
    </Container>
  )
}

// DJ, Guest 선택
const TargetInfo = props => {
  const [state, setState] = useState(0)
  return (
    <>
      {/* {props.targetData.map((data, idx) => {
        return (
          <Dj onClick={() => setState(idx)} active={idx === state ? 'active' : ''} key={idx}>
            {idx !== state && <Cover></Cover>}
            <Profile>
              <img src="https://devimage.dalbitcast.com/images/api/guest@2x.png" width={36} height={36} />

              <Tag target={data.type}>{data.type === 0 ? 'DJ' : '게스트'}</Tag>
            </Profile>
            <DjInfo>
              <div>{data.nickname}</div>
            </DjInfo>
          </Dj>
        )
      })} */}
      <Dj>
        {/* {idx !== state && <Cover></Cover>} */}
        <Profile>
          <img src="https://devimage.dalbitcast.com/images/api/guest@2x.png" width={36} height={36} />
          <Tag>DJ</Tag>
        </Profile>
        <DjInfo>
          <div>{props.bjNickNm}</div>
        </DjInfo>
      </Dj>
    </>
  )
}

//-------------------------------------------------- styled start

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`
const MainContents = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 90%;
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
  height: 190px;
  align-items: center;
  flex-direction: column;
`

const UserLevel = styled.div`
  display: flex;
  width: 100px;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.33;
  letter-spacing: -0.45px;
  color: #8556f6;
`

const BarWrap = styled.div`
  display: flex;
  flex-direction: row;
  /* justify-content: center; */
  width: 70%;
  font-weight: 400;
`

const Bar = styled.div`
  display: flex;
  width: 236px;
  background-color: #fff;
  border-radius: 10px;
  margin-left: 5px;
  margin-right: 5px;
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
  font-size: 10px;
  font-weight: 400;
  letter-spacing: -0.25px;
`
const BoxArea = styled.div`
  display: flex;
  flex-flow: wrap;
  width: 100%;

  /* height: 500px; */
  justify-content: left;
  align-items: center;
`

const ItemInfo = styled.button`
  display: flex;
  width: 24%;
  height: 98px;
  margin-right: 3px;
  justify-content: flex-start;
  align-items: center;
`

const ItemImg = styled.div`
  display: flex;
  width: 100%;
  height: 70px;
  /* border-style: solid;
  border-color: #e0e0e0;
  border-width: 1px; */
  justify-content: center;
`
const Icon = styled.div`
  display: flex;
  width: 100%;
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
  /* margin-top: 20px; */
  align-items: flex-start;
  width: 100%;
  height: 100px;
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
  width: 55%;
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
  width: 45%;
  height: 48px;
  background-color: #fff;
  border-radius: 10px;
  margin-left: 8px;
  align-items: center;
  justify-content: center;

  color: #8556f6;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.14;
  letter-spacing: -0.35px;
  border-style: solid;
  border-color: #8556f6;
  border-width: 1px;
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
  /* background-color: ${props => (props.target === 0 ? '#8555f6' : '#ec455f')}; */
  background:#8555f6;
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
  align-items: flex-start;
  padding-top: 30px;

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
  height: 98px;
  align-items: center;
  justify-content: center;
`
const DashBoard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 170px;
  background: #f6f6f6;
  align-items: center;
`
const Cover = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  height: 56px;
  border-radius: 10px;
  background: ${props => !props.active && 'rgba(255, 255, 255, 0.7)'};
  /* background: yellow; */
  z-index: 999;
`
const Level = styled.div`
  display: flex;
  width: 90%;
  height: 50px;
  align-items: center;
  justify-content: space-between;
`
const MyItem = styled.div`
  display: flex;
  width: 90%;
  height: 34px;
  align-items: center;
  justify-content: space-between;

  .myTitle {
    font-size: 14px;
    font-weight: 400;
    letter-spacing: -0.35px;
    color: #919191;
  }

  .myItem {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: -0.35px;
    color: #424242;

    & > button {
      display: flex;
      width: 15px;
      height: 15px;
      border-style: solid;
      border-width: 1px;
      border-color: #8555f6;
      border-radius: 75px;
      color: #8555f6;
      justify-content: center;
      align-items: center;
    }
  }
`
