import React, {useEffect} from 'react';
// scss
import './popslide.scss';
import {useDispatch, useSelector} from "react-redux";
import {setSlidePopupClose, setSlideClose} from "redux/actions/common";
import {isAndroid} from "context/hybrid";
import {setGlobalCtxBackFunction, setGlobalCtxBackState} from "redux/actions/globalCtx";

let slidePopTimeout;

/* 팝업 닫기 */
export const closePopup = (dispatch) => {
  dispatch(setSlideClose());
  slidePopTimeout = setTimeout(() => {
    dispatch(setSlidePopupClose());
  }, 400);
};

const PopSlide = (props) => {
  const {title, setPopSlide, children, popHidden, closeCallback} = props;
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const popupState = useSelector(state => state.popup);
  const dispatch = useDispatch();

  const closePopupDim = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target;
    if (target.id === 'popSlide') {
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
      document.body.classList.remove('overflowHidden');
      dispatch(setSlidePopupClose());
      dispatch(setSlideClose());
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
      <div className={`slideLayer ${popupState.slideAction === false ? "slideDown" : "slideUp"}`}>
        {title && <h3>{title}</h3>}
        {children}
      </div>
    </div>
  )
}

export default PopSlide;
