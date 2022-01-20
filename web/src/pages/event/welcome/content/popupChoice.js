import React, {useState, useEffect, useContext} from 'react'
import {Context} from 'context'
import {IMG_SERVER} from 'context/config'

import Api from 'context/api'

import './popup.scss'

const PopupChoice = (props) => {
  const context = useContext(Context)
  const {onClose, stepNo, list, phoneNo, onSuccess} = props
  const [giftCheck, setGiftCheck] = useState(-1)

  // 0. 선물 받기
  const welcomeGiftRcv = async () => {
    if (giftCheck === -1) {
      context.action.toast({msg: '선물을 선택해 주세요.'})
      return;
    }

    const {giftCode, giftOrd, giftName, giftCont, giftDalCnt, giftStepNo, theMonth, giftSlct} = list[giftCheck]
    const param = {
      giftCode: giftCode,
      giftName: giftName,
      giftCont: giftCont,
      giftOrdNo: giftOrd,
      giftDalCnt: giftDalCnt,
      giftStepNo: giftStepNo,
      giftTheMonth: theMonth,
      memPhone: phoneNo
    }

    const res = await Api.postWelcomeGiftRcv(giftSlct, param)

    if (res.code === '00000') {
      onSuccess({ giftCode, giftName, giftStepNo });
    } else if (res.code !== '99999') {
      context.action.toast({msg: res.message})
    } else {
      console.log(res.code);
    }
  }

  const giftChoice = (e) => {
    const {targetNum} = e.currentTarget.dataset
    setGiftCheck(targetNum)
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <>
      <div id="popupWrap">
        <div className="contentWrap choice">
          <h1 className="title">선물을 선택해주세요!</h1>
          <ul className={`giftUl step${stepNo}`}>
            {list.length > 0 &&
              list.map((data, index) => {
                const {giftCode, giftName} = data
                return (
                  <li className={`giftList ${giftCheck == index ? 'on' : ''}`} data-target-num={index} onClick={giftChoice} key={index}>
                    <div className="giftItem">
                      <img src={`${IMG_SERVER}/event/welcome/item/${giftCode}.png`} alt={giftName} />
                    </div>
                    <p>{giftName}</p>
                  </li>
                )
              })}
          </ul>
          <button className="closeBtn" onClick={welcomeGiftRcv}>확인</button>
          <button className="closeImg" onClick={onClose}><img src={`${IMG_SERVER}/event/welcome/popCloseImg.png`} /></button>
        </div>
      </div>
    </>
  )
}

export default PopupChoice
