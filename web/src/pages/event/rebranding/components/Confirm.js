import React, {useEffect, useState} from 'react'

import {setCommonPopupClose} from "redux/actions/common";
import {useDispatch, useSelector} from "react-redux";

import CheckList from './CheckList'

import './confirm.scss'

const Confirm = (props) => {
  const {setActionAni,stoneValue1,setStoneValue1,stoneValue2,setStoneValue2,fetchStoneChange} = props;
  
  const dispatch = useDispatch();
  // 
  const cookieChecked = () => {
    if(!localStorage.getItem('rebranding')){
      localStorage.setItem('rebranding','true');
    } else {
      localStorage.removeItem('rebranding');
    }
  }
  // 
  const btnCancel = () => {
    dispatch(setCommonPopupClose());
  }
  // 
  const btnConfirm = () => {
    fetchStoneChange(stoneValue1.value,stoneValue2.value);
    dispatch(setCommonPopupClose());
    setActionAni(true);
    setStoneValue1({on: false, value: ''});
    setStoneValue2({on: false, value: ''});
    setTimeout(() => {
      setActionAni(false);
    }, 6000);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    };
  }, []);

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
