import React, {useEffect} from 'react'

import CheckList from './CheckList'

import './confirm.scss'

const Confirm = (props) => {
  const {setPopLayer,setActionAni,setStoneValue1,setStoneValue2} = props
  // 
  const cookieChecked = () => {
    console.log('cookie');
  }
  // 
  const btnCancel = () => {
    setPopLayer(false)
  }
  // 
  const btnConfirm = () => {
    setPopLayer(false)
    setActionAni(true)
    setStoneValue1({on: false, value: ''})
    setStoneValue2({on: false, value: ''})
    setTimeout(() => {
      setActionAni(false)
    }, 6000);
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <>
      <div id="layerPopup">
        <div className="popupLayer">
          <div className="msg">
            소진된 스톤은 복원되지 않습니다.<br/>
            스톤을 뽑으시겠습니까?
          </div>
          <CheckList text="다시 묻지 않기" onClick={cookieChecked} />
          <div className="buttonGroup">
            <button className="cancel" onClick={btnCancel}>취소</button>
            <button className="confirm" onClick={btnConfirm}>확인</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Confirm
