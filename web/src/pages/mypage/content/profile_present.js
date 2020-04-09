import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'
import {Context} from 'context'
import Api from 'context/api'

import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

const testData = [20, 50, 100, 500, 1000]
// 선택 한 유저에게 선물하기 청취자or게스트 화면과 연동 필요함
export default props => {
  //-------------------------------------------------------- declare start
  const [point, setPoint] = useState()
  const [text, setText] = useState('')
  const [active, setActive] = useState(false)
  const [send, setSend] = useState(false)
  const [directDalCnt, setDirectDalCnt] = useState(0)
  const context = useContext(Context)
  const customHeader = JSON.parse(Api.customHeader)
  const [allFalse, setAllFalse] = useState(false)
  //scroll
  const scrollbars = useRef(null)
  const area = useRef()
  let myDalCnt = context.profile.dalCnt
  myDalCnt = myDalCnt.toLocaleString()
  //-------------------------------------------------------- func start
  const handleChangeInput = event => {
    const {value, maxLength} = event.target
    setDirectDalCnt(value)
    if (value.length > maxLength) {
      return false
    }
    setText(value)
  }

  const _active = param => {
    // 달 수를 직접 입력 ( param : input ) , 20,50,100,500,1000 (param : 0,1,2,3,4)
    if (param === 'input') {
      setPoint(-1)
      setActive(true)
      setDirectDalCnt(0)
    } else {
      setPoint(param)
      setActive(false)
      setDirectDalCnt(testData[param])
      setText('')
    }
    setSend(true)
  }

  // 선물하기
  async function giftSend() {
    let dalcount
    if (directDalCnt != 0) {
      dalcount = directDalCnt
    } else {
      dalcount = parseInt(text)
    }

    if (dalcount <= 0) {
      context.action.alert({
        callback: () => {
          return
        },
        msg: '보낼 달 수량을 입력해 주세요'
      })
    }
    const res = await Api.member_gift_dal({
      data: {
        memNo: props.profile.memNo,
        dal: dalcount
      }
    })
    if (res.result === 'success') {
      context.action.alert({
        callback: () => {
          setText(dalcount)
          context.action.updateClosePresent(false)
          async function updateMyPofile() {
            const profileInfo = await Api.profile({params: {memNo: context.profile.memNo}})
            if (profileInfo.result === 'success') {
              context.action.updateProfile(profileInfo.data)
            }
          }
          updateMyPofile()
        },
        msg: res.message
      })
    } else if (res.result === 'fail' && res.code === '-4') {
      context.action.confirm({
        msg: res.message,
        buttonText: {
          right: '충전하기'
        },
        callback: () => {
          props.history.push('/store')
        }
      })
    } else {
      context.action.alert({
        msg: res.message
      })
    }
  }

  const broadCastCharge = () => {
    let unitDalprice = 100 // 달 개당 100원(추후 수정) -> 나중에 글로벌로 뺴야 한다.
    let osType = customHeader.os // os : 1(Aos) , 2(ios)
    let rate = osType === 2 ? 0.3 : 1 // ios 경우 가격 책정이 달라 비율 조정을 차후 수정 (임의 30% 설정)
    let totalPrice = unitDalprice * (directDalCnt > 0 ? directDalCnt : text)
    let calc = totalPrice * rate
    let iosPrice = totalPrice + calc

    context.action.updatePopup('CHARGE', {
      name: directDalCnt > 0 ? `달 ${directDalCnt}` : `달 ${text}`,
      price: osType === 2 ? iosPrice : totalPrice
    })
  }
  useEffect(() => {
    context.action.updatePopup('CHARGE')
    context.action.updatePopupVisible(false)
  }, [])
  //-------------------------------------------------------- components start
  return (
    <>
      <HoleWrap>
        <FixedBg className={allFalse === true ? 'on' : ''} ref={area}>
          <div className="wrapper">
            <button className="close" onClick={() => context.action.updateClosePresent(false)}></button>
            <div className="scrollWrap">
              <Container>
                <Contents>
                  <div>
                    <h2>선물하기</h2>
                    <p>
                      <span>{props.profile.nickNm} </span> 님에게
                      <br />
                      달을 선물하시겠습니까?
                    </p>
                  </div>
                </Contents>
                <MyPoint>
                  <em>내가 보유한 달</em>
                  <span>
                    {myDalCnt}
                    <button
                      onClick={() => {
                        props.history.push('/store')
                      }}>
                      충전
                    </button>
                  </span>
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
                  <PointInput
                    placeholder="직접 입력"
                    type="number"
                    maxLength="5"
                    value={text}
                    onChange={handleChangeInput}
                    onClick={() => _active('input')}
                    active={active ? 'active' : ''}
                  />
                  <p>*선물하신 달은 별로 전환되지 않습니다.</p>
                </TextArea>
                <ButtonArea>
                  <button onClick={() => context.action.updateClosePresent(false)}>취소</button>
                  <button onClick={() => giftSend()} disabled={directDalCnt == 0 ? true : false}>
                    선물
                  </button>
                </ButtonArea>
              </Container>
            </div>
          </div>
        </FixedBg>
      </HoleWrap>
      <Dim onClick={() => context.action.updateClosePresent(false)}></Dim>
    </>
  )
}
//-------------------------------------------------------- styled start
const FixedBg = styled.div`
  z-index: 24;
  .wrapper {
    position: relative;
    &:after {
      content: '';
      clear: both;
      display: block;
    }
    .close {
      display: block;
      position: absolute;
      top: -36px;
      right: 8.335%;
      width: 36px;
      height: 36px;
      background: url(${IMG_SERVER}/images/common/ic_close_m@2x.png) no-repeat center center / cover;
    }

    & .scrollCustom {
      & > div:nth-child(3) {
        position: relative;
        width: 10px !important;
        height: auto;
      }
    }
  }
  .scrollWrap {
    width: 100vw;
    max-height: 420px;
    flex: none;
  }
  &.on {
    display: none;
  }
  .btnWrap {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
`
const Container = styled.div`
  padding: 12px;
  width: 83.33%;
  margin: 0 auto;
  min-height: 344px;
  display: flex;
  background-color: #fff;
  /* align-items: center; */
  flex-direction: column;

  border-radius: 10px;
  & h2 {
    margin-top: 14px;
    margin-bottom: 20px;
    color: #424242;
    font-size: 20px;
    font-weight: 800;
    text-align: center;
    letter-spacing: -0.4px;
    transform: skew(-0.03deg);
    & > span {
      color: ${COLOR_MAIN};
    }
  }
  & p {
    color: #616161;
    font-size: 14px;
    letter-spacing: -0.35px;
    text-align: center;
    transform: skew(-0.03deg);
  }
`

const HoleWrap = styled.div`
  display: flex;
  position: fixed;

  top: 50%;
  transform: translateY(-50%);
  left: 0;
  align-items: center;
  justify-content: center;
  z-index: 24;
`
const Dim = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 23;
  background-color: rgba(0, 0, 0, 0.5);
`

const Contents = styled.div`
  & > div {
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
  justify-content: space-between;
  margin: 30px 0 15px 0;
  & > * {
    display: inline-block;
    line-height: 20px;
    transform: skew(-0.03deg);
  }

  em {
    font-style: normal;
    font-size: 14px;
    color: #919191;
  }

  span {
    color: #424242;
    font-size: 16px;
    font-weight: 800;

    button {
      position: relative;
      vertical-align: top;
      padding: 0 15px 0 8px;
      margin-left: 6px;
      border-radius: 20px;
      background: ${COLOR_POINT_P};
      color: #fff;
      font-weight: 400;
      font-size: 12px;

      &:after {
        display: block;
        position: absolute;
        right: 7px;
        top: 7px;
        width: 4px;
        height: 4px;
        border-right: 1px solid #fff;
        border-bottom: 1px solid #fff;
        content: '';
        transform: rotate(-45deg);
      }
    }
  }
`
const Select = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: center;
  width: 100%;
  height: 32px;
`

const PointButton = styled.button`
  width: calc(20% - 4px);
  height: 32px;
  border-style: solid;
  border-color: ${props => (props.active == 'active' ? '#8556f6' : '#e0e0e0')};
  border-width: 1px;
  border-radius: 10px;
  color: ${props => (props.active == 'active' ? '#8556f6' : '#616161')};
  font-weight: 400;
  color: #616161;
  font-size: 12px;
`
const TextArea = styled.div`
  display: flex;
  width: 100%;
  height: 58px;
  flex-direction: column;
  margin-top: 8px;

  & > p {
    font-size: 12px;
    font-weight: 400;
    line-height: 1.14;
    letter-spacing: -0.35px;
    color: #bdbdbd;
    text-align: left;
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

  font-size: 12px;
  font-weight: 400;
  line-height: 1.14;
  letter-spacing: -0.35px;
  border-color: ${props => (props.active === 'active' ? '#8556f6' : '#e0e0e0')};

  &::placeholder {
    color: #bdbdbd;
  }
  p {
    font-size: 12px;
    text-align: left;
  }
`
const ButtonArea = styled.div`
  display: flex;
  width: 100%;
  margin-top: 20px;
  justify-content: space-between;
  align-items: center;

  button {
    width: calc(50% - 4px);
    font-size: 14px;
    line-height: 46px;
    border: 1px solid ${COLOR_MAIN};
    border-radius: 10px;
    background: ${COLOR_MAIN};
    color: #fff;
  }

  button:disabled {
    border: 1px solid #bdbdbd;
    background: #bdbdbd;
    color: #fff;
  }
  button:first-child {
    border: 1px solid ${COLOR_MAIN};
    background: #fff;
    color: ${COLOR_MAIN};
  }
`
