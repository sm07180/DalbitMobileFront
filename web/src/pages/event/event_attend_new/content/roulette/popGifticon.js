import React, {useContext, useEffect, useState, useRef, useCallback} from 'react'

import API from 'context/api'
import Utility from 'components/lib/utility'
import {IMG_SERVER} from 'context/config'
import DalbitCheckbox from 'components/ui/dalbit_checkbox'

//ctx
import {Context} from 'context'
import {AttendContext} from '../../attend_ctx'

let intervalId = null

export default () => {
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const {eventAttendState, eventAttendAction} = useContext(AttendContext)
  const {itemNo, imageUrl, itemWinMsg} = eventAttendState
  const [checks, setChecks] = useState([false, false])

  const [phone, setPhone] = useState(eventAttendState.winPhone)
  const [timeText, setTimeText] = useState('')

  const phoneInput = useRef()

  const clickSaveButton = () => {
    const rgEx = /(01[0123456789])(\d{3}|\d{4})\d{4}$/g
    if (!phone) {
      return globalCtx.action.alert({
        msg: `휴대폰 번호는 필수입력 값입니다.`
      })
    }

    if (!rgEx.test(phone) || phone.length < 11) {
      return globalCtx.action.alert({
        msg: `올바른 휴대폰 번호가 아닙니다.`
      })
    }

    async function fetchEventAttendPhone() {
      const {result, message} = await API.postEventRoulettePhone({
        phone: phone,
        winIdx: eventAttendState.winIdx
      })
      if (result === 'success') {
        eventAttendAction.setPopGifticon(false)
        eventAttendAction.setPopRoulette(false)

        globalCtx.action.alert({
          msg: `다시 한 번 축하드립니다.\n기프티콘은 입력된 연락처로\n평일 기준 7일 이내 전송해드립니다.`
        })
      } else {
        globalCtx.action.alert({
          msg: message
        })
      }
    }
    fetchEventAttendPhone()
  }

  const intervalFormatter = (date) => {
    if (!date) return null

    //let time = +new Date(date)
    let time = +new Date(date.replace(/-/g, '/'))
    let now = +new Date()
    let test = (time - now) / 1000

    intervalId = setInterval(() => {
      const text = `${Utility.leadingZeros(Math.floor(test / 60), 2)}:${Utility.leadingZeros(Math.floor(test % 60), 2)}`
      test--

      setTimeText(text)
      if (test < 0) {
        clearInterval(intervalId)
        setTimeText('00:00')
      }
    }, 1000)
  }

  const makePhoneInputBox = () => {
    const boxHtml = (
      <div className="gifticonPhoneWrap">
        <div className="gifticonPhoneBox">
          <p className="gifticonPhoneBox__title">기프티콘 당첨자 연락처 입력</p>

          <span className="gifticonPhoneBox__time">{timeText}</span>
          <input
            type="tel"
            placeholder="휴대폰 번호를 입력해주세요"
            id="phone"
            name="phone"
            value={phone}
            onChange={inputHandle}
            ref={phoneInput}
          />
        </div>

        <div className="sns_detail">
          <img src="https://image.dalbitlive.com/event/attend/210205/sns_img.jpg" />
        </div>

        <div className="check_box">
          <label>
            <DalbitCheckbox
              status={checks[1]}
              callback={() => {
                setChecks(
                  checks.map((v, i) => {
                    if (i === 1) {
                      v = !v
                    }
                    return v
                  })
                )
              }}
            />
            기프티콘은 입력된 연락처로 평일 기준 7일 이내 문자로 전송해드립니다.
          </label>

          <label>
            <DalbitCheckbox
              status={checks[0]}
              callback={() => {
                setChecks(
                  checks.map((v, i) => {
                    if (i === 0) {
                      v = !v
                    }
                    return v
                  })
                )
              }}
            />
            7일 이내 문자 수신이 안 된 경우 스팸 문자함, <br />
            수신 거부 번호 등을 확인해주세요.
          </label>
        </div>
        <button
          className="winInfo__button"
          disabled={checks[0] === false || checks[1] === false || phone.length < 11 ? true : false}
          onClick={clickSaveButton}>
          저장 및 확인
        </button>
      </div>
    )

    if (token.isLogin) {
      return boxHtml
      // if (statusList.phone_input === '0' || statusList.phone_input === undefined) {
      //   return null
      // } else {
      //   return boxHtml
      // }
    }
  }

  const inputHandle = (e) => {
    const {name, value} = e.target
    const nmValue = value.replace(/[^0-9]/g, '')
    switch (name) {
      case 'phone':
        if (value.toString().length < 12) setPhone(nmValue)
        break
    }

    // setInputs({
    //   ...inputs,
    //   [name]: value
    // })
  }

  useEffect(() => {
    intervalFormatter(eventAttendState.start.inputEndDate)

    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="popupWrap">
      <div className="popupContent gifticon">
        <h1>축하합니다!</h1>

        {itemNo === 2 ||
        itemNo === 3 ||
        itemNo === 9 ||
        itemNo === 19 ||
        itemNo === 29 ||
        itemNo === 39 ||
        itemNo === 49 ||
        itemNo === 59 ||
        itemNo === 10001 ||
        itemNo === 10002 ||
        itemNo === 10003 ||
        itemNo === 10004 ? (
          <>
            <div className="winInfo">
              <div className="winInfo__image">
                {itemNo === 2 ? (
                  <img src="https://image.dalbitlive.com/event/attend/201019/img_moon1@2x.png" alt="1달" />
                ) : itemNo === 3 ? (
                  <img src="https://image.dalbitlive.com/event/attend/201019/img_moon3@2x.png" alt="3달" />
                ) : (
                  <img src={imageUrl} alt="룰렛 결과 이미지" />
                )}
              </div>
              <p className="winInfo__title">{itemNo === 2 ? '1달 당첨!' : itemNo === 3 ? '3달 당첨!' : <>{itemWinMsg}</>}</p>

              <p className="winInfo__content">
                {itemNo === 10001 || itemNo === 10002 || itemNo === 10003 || itemNo === 10004
                  ? '다음에는 기프티콘도 당첨되기를!'
                  : '[내 지갑]을 확인하세요!'}
              </p>
            </div>

            <button
              type="submit"
              className="btnConfirm"
              onClick={() => {
                eventAttendAction.setPopGifticon(false)
                eventAttendAction.setPopRoulette(false)
              }}>
              확인
            </button>
          </>
        ) : (
          <>
            <div className="winInfo">
              <p className=" winInfo__image">
                <img src={imageUrl} alt="룰렛 결과 이미지" />
              </p>
              <div className="winInfo__title">{itemWinMsg}</div>
            </div>

            {makePhoneInputBox()}
          </>
        )}
      </div>
    </div>
  )
}
