import React, {useContext, useEffect, useState} from 'react'

// css
import './popslide.scss'
import {useDispatch, useSelector} from "react-redux";
import {setCommonPopupClose, setSlidePopupClose} from "redux/actions/common";
import {isAndroid} from "context/hybrid";
import {setGlobalCtxBackFunction, setGlobalCtxBackState} from "redux/actions/globalCtx";

let slidePopTimeout;

/* 팝업 닫기 */
export const closePopup = (dispatch) => {
  dispatch(setSlidePopupClose());
  slidePopTimeout = setTimeout(() => {
    dispatch(setCommonPopupClose());
  }, 400)
}

const PopSlide = (props) => {
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {title, setPopSlide, children, popHidden, closeCallback} = props
  const popupState = useSelector(state => state.popup);
  const dispatch = useDispatch();  

  const closePopupDim = (e) => {
    const target = e.target
    if (target.id === 'popSlide') {
      e.preventDefault();
      e.stopPropagation();
      if(setPopSlide) {
        setPopSlide(false);
      }
      if(closeCallback) {
        closeCallback();
      }
      closePopup(dispatch);
    }
  }

  useEffect(() => {
    document.body.classList.add('overflowHidden')
    if(isAndroid()) {
      dispatch(setGlobalCtxBackState(true));
      dispatch(setGlobalCtxBackFunction({name: 'popClose'}));
    }
    return () => {
      document.body.classList.remove('overflowHidden')
      dispatch(setSlidePopupClose());
      clearTimeout(slidePopTimeout);
      if(isAndroid()) {
        if(globalState.backFunction.name.length === 1) {
          dispatch(setGlobalCtxBackState(null));
        }
        dispatch(setGlobalCtxBackFunction({name:''}))
      }
    }
  }, [])

  return (
    <div id="popSlide" onClick={closePopupDim} style={{display: `${popHidden ? 'none': ''}`}}>
      <div className={`slideLayer ${popupState.slidePopup ? "slideUp" : "slideDown"}`}>
        {title && <h3>{title}</h3>}
        {children}
      </div>
    </div>
  )
}

export default PopSlide
