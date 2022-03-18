import React, {useEffect, useState} from 'react';

import {setCommonPopupClose, setCommonPopupOpenData} from "redux/actions/common";
import {useDispatch, useSelector} from "react-redux";

import CheckList from './CheckList'

import './confirm.scss'

const Confirm = (props) => {
  const {setActionAni,stoneValue1,stoneValue2,stoneValue3,fetchStoneChange} = props;
  
  const dispatch = useDispatch();
  const popup = useSelector(state => state.popup);
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
    fetchStoneChange(stoneValue1.value,stoneValue2.value,stoneValue3.value);
    dispatch(setCommonPopupClose());
    setActionAni(true);
    setTimeout(() => {
      setActionAni(false);
      dispatch(setCommonPopupOpenData({...popup, resultPopup: true, confirmPopup: false}));
    }, 4500);
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
