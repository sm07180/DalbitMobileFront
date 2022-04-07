import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'
import {Context} from 'context'
import Api from 'context/api'
import {OS_TYPE} from 'context/config.js'
import {useHistory} from 'react-router-dom'

import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import Swiper from 'react-id-swiper'
import {common} from '@material-ui/core/colors'
import {storeButtonEvent} from "components/ui/header/TitleButton";
import {useSelector} from "react-redux";

// 선택 한 유저에게 선물하기 청취자or게스트 화면과 연동 필요함
export default (props) => {
  const history = useHistory()
  const globalCtx = useContext(Context);
  const memberRdx = useSelector((state)=> state.member);
  const payStoreRdx = useSelector(({payStore})=> payStore);

  //-------------------------------------------------------- declare start
  const [splashData, setSplashData] = useState()
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
  let myDalCnt = context.myInfo.dalCnt
  myDalCnt = myDalCnt.toLocaleString()
  //-------------------------------------------------------- func start
  const handleChangeInput = (event) => {
    const {value, maxLength} = event.target
    setDirectDalCnt(value)
    if (value.length > maxLength) {
      return false
    }
    setText(value)
  }

  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 5
  }

  const _active = (param) => {
    // 달 수를 직접 입력 ( param : input ) , 20,50,100,500,1000 (param : 0,1,2,3,4)
    if (param === 'input') {
      setPoint(-1)
      setActive(true)
      setDirectDalCnt(0)
    } else {
      setPoint(param)
      setActive(false)
      setDirectDalCnt(globalCtx.splash.giftDal[param])
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

    if (dalcount >= globalCtx.splash.giftDalMin) {
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
              const myInfoRes = await Api.mypage()
              if (myInfoRes.result === 'success') {
                context.action.updateMyInfo(myInfoRes.data)
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
            history.push('/store')
          }
        })
      } else {
        context.action.alert({
          msg: res.message
        })
      }
    } else {
      context.action.alert({
        callback: () => {
          return
        },
        msg: `직접입력 선물은 최소 ${globalCtx.splash.giftDalMin}달 부터 선물이 가능합니다.`
      })
      return
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
                <h2>선물하기</h2>
                <div className="contentPadding">
                  <MyPoint>
                    <div className="nameTitle">
                      <b>{props.profile.nickNm}</b>님에게
                      <br />
                      달을 선물하시겠습니까?
                    </div>

                    <div className="pointItem">
                      <em>내가 보유한 달</em>
                      <span>
                        {myDalCnt}
                        <button onClick={() => {
                            storeButtonEvent({history, memberRdx, payStoreRdx});
                            //history.push('/store')
                          }}>
                            충전
                          </button>
                      </span>
                    </div>
                  </MyPoint>

                  <div className="pointList">
                    {globalCtx.splash &&
                      globalCtx.splash.giftDal.map((data, idx) => {
                        return (
                          <PointButton key={idx} onClick={() => _active(idx)} active={point == idx ? 'active' : ''}>
                            {Number(data).toLocaleString()}
                          </PointButton>
                        )
                      })}
                  </div>

                  <TextArea>
                    {globalCtx.splash.giftDalDirect === true && (
                      <PointInput
                        placeholder={`달은 ${globalCtx.splash.giftDalMin}개부터 선물할 수 있습니다.`}
                        type="number"
                        maxLength="10"
                        value={text}
                        onChange={handleChangeInput}
                        onClick={() => _active('input')}
                        active={active ? 'active' : ''}
                      />
                    )}
                    <p>※ 달 선물하기는 100% 전달됩니다.</p>
                  </TextArea>
                  <ButtonArea>
                    <button onClick={() => context.action.updateClosePresent(false)}>취소</button>
                    <button onClick={() => giftSend()} disabled={directDalCnt == 0 ? true : false}>
                      선물
                    </button>
                  </ButtonArea>
                </div>
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
  width: 100%;
  max-width: 640px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  .wrapper {
    max-width: 360px;
    margin: auto;
    position: relative;

    &:after {
      content: '';
      clear: both;
      display: block;
    }
    .close {
      display: block;
      position: absolute;
      top: -40px;
      right: 16px;
      width: 32px;
      height: 32px;
      background: url(${IMG_SERVER}/images/api/close_w_l.svg) no-repeat center;
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
    width: 100%;
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
  margin: 0px 16px;
  min-height: 344px;
  display: flex;
  background-color: #fff;
  /* align-items: center; */
  flex-direction: column;
  border-radius: 10px;
  background: #eee;
  overflow: hidden;

  .contentPadding {
    /* min-height: 358px; */
    padding: 0px 16px 16px 16px;
  }

  & h2 {
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #000;
    font-size: 18px;
    font-weight: 700;
    height: 52px;

    text-align: center;
    letter-spacing: -0.4px;
    transform: skew(-0.03deg);
    border-bottom: 1px solid #e0e0e0;
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

  .pointList {
    min-width: 293px;
    min-height: 68px;
    display: flex;
    flex-wrap: wrap;
  }
`

const HoleWrap = styled.div`
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 24;
  display: flex;
  justify-content: center;
  align-items: center;
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
  margin: auto;

  .nameTitle {
    width: 100%;
    padding-top: 20px;
    padding-bottom: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.4px;
    border-bottom: 1px solid #e0e0e0;
    color: #000;
    b {
      display: inline-block;
      color: #FF3C7B;
      margin-right: 3px;
    }
  }

  .pointItem {
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
    padding-bottom: 12px;
  }

  & > * {
    display: inline-block;
    line-height: 20px;
    transform: skew(-0.03deg);
  }

  em {
    font-style: normal;
    font-size: 14px;
    color: #000;
    letter-spacing: -0.35px;
  }

  span {
    color: #424242;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: -0.4px;

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
  .swiper-slide {
    min-width: 50px;
    max-width: 60px;
    width: auto;
  }
`

const PointButton = styled.button`
  height: 32px;
  background: #fff;
  margin-right: 4px;
  margin-bottom: 4px;
  width: calc((100% - 12px) / 4);
  font-size: 14px;
  color: #000;
  font-weight: bold;
  border-style: solid;
  border-color: ${(props) => (props.active == 'active' ? '#FF3C7B' : '#e0e0e0')};
  border-width: 1px;
  color: ${(props) => (props.active == 'active' ? '#FF3C7B' : '#000')};
  box-sizing: border-box;
  border-radius: 12px;

  &:nth-child(4n) {
    margin-right: 0px;
  }

  &:nth-child(n + 4) {
    margin-bottom: 0px;
  }
`
const TextArea = styled.div`
  width: 100%;
  margin-top: 8px;

  & > p {
    font-size: 12px;
    font-weight: 400;
    line-height: 1.14;
    letter-spacing: -0.35px;
    color: #616161;
    text-align: left;
  }
`
const PointInput = styled.input`
  display: flex;
  width: 100%;
  height: 44px;
  border-style: solid;
  border-width: 1px;
  border-radius: 10px;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.14;
  letter-spacing: -0.35px;
  background: #fff;
  border-color: ${(props) => (props.active === 'active' ? '#000' : '#e0e0e0')};

  &::placeholder {
    color: #757575;
    font-size: 14px;
    font-weight: 400;
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
    font-size: 16px;
    line-height: 44px;
    border-radius: 12px;
    background: #757575;
    color: #fff;
    font-weight: 700;
  }

  button:disabled {
    border: 1px solid #bdbdbd;
    background: #bdbdbd;
    color: #fff;
  }
  button:last-child {
    background: #FF3C7B;
    color: #fff;
  }
`
