import React, {useState, useEffect, useContext} from 'react'
import {Context} from 'context'
import {IMG_SERVER} from 'context/config'

import Api from 'context/api'

import PopupItems from './PopupItems'

import './popup.scss'

const PopupChoice = (props) => {
  const context = useContext(Context)
  const {onClose, stepNo, list, phoneNo} = props
  const [giftCheck, setGiftCheck] = useState(-1)

  const [itemPopInfo, setItemPopInfo] = useState({open: false, item: []})

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // 0. 선물 받기
  const welcomeGiftRcv = async () => {
    console.log(list[giftCheck])
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
    console.log(param)
    const res = await Api.postWelcomeGiftRcv(giftSlct, param)
    console.log(res)
    if (res.result === 'success') {
      console.log('1')
    } else {
      console.log(res.message)
    }
  }

  const giftChoice = (e) => {
    const {targetNum} = e.currentTarget.dataset
    setGiftCheck(targetNum)
  }

  const itemPopOpen = () => {
    if (giftCheck !== -1) {
      setItemPopInfo({...itemPopInfo, open: true, item: list[giftCheck]})
      welcomeGiftRcv()
    } else {
      context.action.toast({msg: '선물을 선택해 주세요.'})
    }
  }

  const itemPopClose = () => {
    setItemPopInfo({...itemPopInfo, open: false})
    onClose(giftCheck)
    console.log(giftCheck);
  }

  return (
    <>
      {itemPopInfo.open === false ? (
        <div id="popupWrap">
          <div className="contentWrap choice">
            <h1 className="title">선물을 선택해주세요!</h1>
            <ul className={`giftUl step${stepNo}`}>
              {list.length > 0 &&
                list.map((data, index) => {
                  const {giftCode, giftName} = data
                  return (
                    <li
                      className={`giftList ${giftCheck === `${index}` ? 'on' : ''}`}
                      data-target-num={index}
                      onClick={giftChoice}
                      key={index}>
                      <div className="giftItem">
                        <img src={`${IMG_SERVER}/event/welcome/item/${giftCode}.png`} alt={giftName} />
                      </div>
                      <p>{giftName}</p>
                    </li>
                  )
                })}
            </ul>
            <button className="closeBtn" onClick={itemPopOpen}>
              확인
            </button>
            <button className="closeImg" onClick={onClose}>
              <img src={`${IMG_SERVER}/event/welcome/popCloseImg.png`} />
            </button>
          </div>
        </div>
      ) : (
        <>{itemPopInfo.open && <PopupItems onItemPopClose={itemPopClose} item={itemPopInfo.item} />}</>
      )}
    </>
  )
}

export default PopupChoice
