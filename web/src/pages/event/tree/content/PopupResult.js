import React, {useEffect} from 'react';
import {IMG_SERVER} from 'context/config';
import './popup.scss';

const PopUpResult = (props) => {
  const {onClose} = props

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'popup') {
      onClose()
    }
  }

  return (
    <div id="popup" onClick={wrapClick}>
      <div className="wrapper">
        <div className="top">
          <img src={`${IMG_SERVER}/event/tree/popupImg.png`} />
        </div>
        <div className="body">
          <div className="text">
            <strong>달 10개를</strong>
            선물 받았습니다!
            <span>따뜻한 겨울 보내세요!</span>
          </div>
          <button className="closeBtn2" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

export default PopUpResult;