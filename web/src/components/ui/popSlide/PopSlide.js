import React, {useContext, useEffect} from 'react'

// css
import './popslide.scss'
import {useDispatch, useSelector} from "react-redux";
import {setCommonPopupClose, setSlidePopupClose} from "redux/actions/common";
import {Context} from "context";
import {isAndroid} from "context/hybrid";

let slidePopTimeout;

/* 팝업 닫기 */
export const closePopup = (dispatch) => {
  dispatch(setSlidePopupClose());
  slidePopTimeout = setTimeout(() => {
    dispatch(setCommonPopupClose());
  }, 400)
}

const PopSlide = (props) => {
  const {title, setPopSlide, children, popHidden, closeCallback} = props
  const context = useContext(Context);
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
    document.body.style.overflow = 'hidden'
    if(isAndroid()) {
      context.action.updateSetBack(true)
      context.action.updateBackFunction({name: 'popClose'})
    }
    return () => {
      document.body.style.overflow = ''
      dispatch(setCommonPopupClose());
      clearTimeout(slidePopTimeout);
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