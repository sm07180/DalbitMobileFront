import React, {useEffect} from 'react'
import {IMG_SERVER} from 'context/config'

export default (props) => {
  const {onItemPopClose, item} = props
  const {giftCode, giftName} = item

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const closePopup = () => {
    onItemPopClose()
  }
  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'popupWrap') {
      onItemPopClose()
    }
  }

  return (
    <div id="popupWrap" onClick={wrapClick}>
      <div className="contentWrap items">
        <div className="topImg">
          <img src={`${IMG_SERVER}/event/welcome/popupHalo.png`} className="halo" />
          <img src={`${IMG_SERVER}/event/welcome/popupCharac.png`} className="charactor" />
        </div>
        <h1 className="title">축하드립니다!</h1>
        <div className="welcomeGift">
          <img src={`${IMG_SERVER}/event/welcome/item/${giftCode}.png`} alt={giftName} />
        </div>
        <p>
          선물로 <span>{giftName}</span>을 획득하였습니다.
        </p>
        <button className="closeBtn" onClick={closePopup}>
          확인
        </button>
      </div>
    </div>
  )
}
