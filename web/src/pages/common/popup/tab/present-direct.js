import React, {useContext, useEffect, useState} from 'react'
import styled from 'styled-components'
import {BotButton} from './bot-button'
import Api from 'context/api'
import {BroadCastStore} from '../../store'
import Swiper from 'react-id-swiper'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxUpdatePopup, setGlobalCtxVisible} from "redux/actions/globalCtx";

// 선택 한 유저에게 선물하기 청취자or게스트 화면과 연동 필요함
export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  //-------------------------------------------------------- declare start
  const [splashData, setSplashData] = useState()
  const [point, setPoint] = useState()
  const [text, setText] = useState('')
  const [active, setActive] = useState(false)
  const [send, setSend] = useState(false)
  const [directDalCnt, setDirectDalCnt] = useState(0)
  const store = useContext(BroadCastStore)

  const {broadcastProfileInfo} = store
  const customHeader = JSON.parse(Api.customHeader)
  //-------------------------------------------------------- func start
  const handleChangeInput = (event) => {
    const {value, maxLength} = event.target
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
      setDirectDalCnt(splashData.giftDal[param])
      setText('')
    }
    setSend(true)
  }

  // 공통
  async function commonData() {
    const res = await Api.splash({})
    if (res.result === 'success') {
      setSplashData(res.data)
    }
  }

  // 선물하기
  async function giftSend() {
    let dalcount
    if (directDalCnt != 0) {
      dalcount = directDalCnt
    } else {
      dalcount = parseInt(text)
    }

    if (dalcount >= splashData.giftDalMin) {
      const res = await Api.member_gift_dal({
        data: {
          memNo: props.profile.memNo,
          dal: dalcount
        }
      })
      if (res.result === 'success') {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          callback: () => {
            setText(dalcount)
          },
          msg: res.message
        }))
      }
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        callback: () => {
          return
        },
        msg: `직접입력 선물은 최소 ${splashData.giftDalMin}달 부터 선물이 가능합니다.`
      }))
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

    dispatch(setGlobalCtxUpdatePopup({
      popup: ['CHARGE', {
        name: directDalCnt > 0 ? `달 ${directDalCnt}` : `달 ${text}`,
        price: osType === 2 ? iosPrice : totalPrice
      }]
    }))
  }

  useEffect(() => {
    commonData()
  }, [])
  useEffect(() => {
    dispatch(setGlobalCtxUpdatePopup({popup: ['CHARGE']}))
    dispatch(setGlobalCtxVisible(false));
  }, [])
  //-------------------------------------------------------- components start
  return (
    <Container>
      <Contents>
        <div>
          <p>
            <span>{broadcastProfileInfo.nickNm}</span> 님에게
          </p>
          <p>달를 선물하시겠습니까?</p>
        </div>
      </Contents>
      <MyPoint>
        <div>{`보유 달 ${broadcastProfileInfo.dalCnt}`} </div>
      </MyPoint>
      <Select>
        <Swiper {...swiperParams}>
          {splashData &&
            splashData.giftDal.map((data, idx) => {
              return (
                <PointButton key={idx} onClick={() => _active(idx)} active={point == idx ? 'active' : ''}>
                  {data}
                </PointButton>
              )
            })}
        </Swiper>
      </Select>
      <TextArea>
        <PointInput
          placeholder="직접 입력"
          type="number"
          maxLength="10"
          value={text}
          onChange={handleChangeInput}
          onClick={() => _active('input')}
          active={active ? 'active' : ''}
        />
        <p>* 달 선물하기는 100% 전달됩니다.</p>
      </TextArea>
      <ButtonArea>
        <BotButton title={'충전하기'} borderColor={'#FF3C7B'} color={'#FF3C7B'} clickEvent={() => broadCastCharge()} />
        <BotButton
          title={'선물하기'}
          borderColor={'#bdbdbd'}
          background={send ? '#FF3C7B' : '#bdbdbd'}
          color={'#fff'}
          clickEvent={() => giftSend()}
        />
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
  .swiper-slide {
    min-width: 50px;
    max-width: 60px;
    width: auto;
  }
`

const PointButton = styled.button`
  width: 64px;
  height: 32px;
  border-style: solid;
  border-color: ${(props) => (props.active == 'active' ? '#FF3C7B' : '#e0e0e0')};
  border-width: 1px;
  border-radius: 10px;
  color: ${(props) => (props.active == 'active' ? '#FF3C7B' : '#616161')};
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
  border-color: ${(props) => (props.active === 'active' ? '#FF3C7B' : '#e0e0e0')};
`
const ButtonArea = styled.div`
  display: flex;
  width: 100%;
  height: 8%;
  justify-content: space-between;
  align-items: center;
`
