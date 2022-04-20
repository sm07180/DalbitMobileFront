import React, {useContext, useEffect, useState} from 'react'

// css
import './popslide.scss'
import {useDispatch, useSelector} from "react-redux";
import {setSlidePopupClose} from "redux/actions/common";
import {Context} from "context";
import {isAndroid} from "context/hybrid";

let slidePopTimeout;

/* 팝업 닫기 */
export const closePopup = (dispatch) => {
  dispatch(setSlidePopupClose());
}

const PopSlide = (props) => {
  const {title, setPopSlide, children, popHidden, closeCallback} = props
  const context = useContext(Context);
  const [slideAction, setSlideAction] = useState(true);
  const dispatch = useDispatch();

  const closePopup = (dispatch) => {
    setSlideAction(false);
    slidePopTimeout = setTimeout(() => {
      dispatch(setSlidePopupClose());
    }, 400)
  }

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
      context.action.updateSetBack(true)
      context.action.updateBackFunction({name: 'popClose'})
    }
    return () => {
      document.body.classList.remove('overflowHidden')
      dispatch(setSlidePopupClose());
      clearTimeout(slidePopTimeout);
      if(isAndroid()) {
        if(context.backFunction.name.length === 1) {
          context.action.updateSetBack(null)
        }
        context.action.updateBackFunction({name: ''})
      }
    }
  }, [])

  return (
    <div id="popSlide" onClick={closePopupDim} style={{display: `${popHidden ? 'none': ''}`}}>
      <div className={`slideLayer ${slideAction ? "slideUp" : "slideDown"}`}>
        {title && <h3>{title}</h3>}
        {children}
      </div>
    </div>
  )
}

export default PopSlide