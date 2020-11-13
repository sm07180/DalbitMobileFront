import React, {useContext, useEffect, useState, useRef, useCallback} from 'react'

import API from 'context/api'
import Utility from 'components/lib/utility'
import {IMG_SERVER} from 'context/config'

//ctx
import {Context} from 'context'
import {AttendContext} from '../../attend_ctx'

let intervalId = null

export default () => {
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const {eventAttendState, eventAttendAction} = useContext(AttendContext)
  const {itemNo} = eventAttendState
  // const {itemNo, setItemNo} = useState(4)

  const [phone, setPhone] = useState(eventAttendState.winPhone)
  const [timeText, setTimeText] = useState('')

  const phoneInput = useRef()

  const clickSaveButton = () => {
    const rgEx = /(01[0123456789])(\d{3}|\d{4})\d{4}$/g
    if (!phone) {
      return globalCtx.action.alert({
        msg: `핸드폰 번호는 필수입력 값입니다.`
      })
    }

    if (!rgEx.test(phone) || phone.length < 11) {
      return globalCtx.action.alert({
        msg: `올바른 핸드폰 번호가 아닙니다.`
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

        <p className="note">
          기프티콘은 입력된 연락처로 전송해드립니다.
          <br />
          (영업장 평일 기준 7일 이내)
        </p>

        <button disabled={phone.length < 11 ? true : false} onClick={clickSaveButton}>
          저장
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
      default:
        break
    }

    // setInputs({
    //   ...inputs,
    //   [name]: value
    // })
  }

  const gift_text = () => {
    let giftItem

    if (itemNo === 1) {
      giftItem = '꽝'
    } else if (itemNo === 2) {
      giftItem = '1달 당첨!'
    } else if (itemNo === 3) {
      giftItem = '3달 당첨!'
    } else {
      giftItem = eventAttendState.start.itemWinMsg
    }

    return giftItem
  }

  const gift_image = () => {
    let giftImage

    if (itemNo === 1) {
      giftImage = `${IMG_SERVER}/event/attend/201019/img_lose@2x.png`
      return <img src={giftImage} width="160px" alt="꽝" />
    } else if (itemNo === 2) {
      giftImage = `${IMG_SERVER}/event/attend/201019/img_moon1@2x.png`
      return <img src={giftImage} width="80px" alt="1달" />
    } else if (itemNo === 3) {
      giftImage = `${IMG_SERVER}/event/attend/201019/img_moon3@2x.png`
      return <img src={giftImage} width="88px" alt="3달" />
    } else {
      giftImage = <img src={eventAttendState.start.imageUrl} width="160px" alt={eventAttendState.start.itemName} />
    }

    return giftImage
  }

  //----------------------------

  useEffect(() => {
    intervalFormatter(eventAttendState.start.inputEndDate)
  }, [])

  return (
    <div className="popupWrap">
      <div className="popupContent gifticon">
        <h1>{itemNo === 1 ? '꽝! 다음 기회에~' : '축하합니다!'}</h1>

        {itemNo <= 3 ? (
          <>
            <div className="winInfo">
              <div className="winInfo__image">{gift_image()}</div>
              {itemNo === 1 ? '' : <p className="winInfo__title">{gift_text()}</p>}
              {itemNo === 1 ? (
                <p className="winInfo__content">
                  너무 미워하지 마세요.. <br /> 다음에는 꼭 당첨되기를!
                </p>
              ) : (
                <p className="winInfo__content">[내 지갑]을 확인하세요!</p>
              )}
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
              <p className="winInfo__title">{gift_text()}</p>
              <div className="winInfo__image">{gift_image()}</div>
            </div>

            <div>{makePhoneInputBox()}</div>
          </>
        )}
      </div>
    </div>
  )
}
