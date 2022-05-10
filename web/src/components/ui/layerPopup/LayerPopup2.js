import React, {useEffect} from 'react';
// scss
import './layerPopup.scss';
import {useDispatch, useSelector} from "react-redux";
import {setLayerPopupClose} from "redux/actions/common";
import {setGlobalCtxBackFunctionEnd} from "redux/actions/globalCtx";
import {isAndroid} from "context/hybrid";

/* 팝업 닫기 */
export const closeLayerPopup = (dispatch) => {
  dispatch(setLayerPopupClose({layerPopup: false}));
  if(isAndroid()) {
    dispatch(setGlobalCtxBackFunctionEnd(''));
  }
};

const LayerPopup2 = (props) => {
  const {title, children, cookie, close} = props;
  const dispatch = useDispatch();
  const popupState = useSelector(state => state.popup);

  const closePopupDim = (e) => {
    const target = e.target;
    if (target.id === 'layerPop') {
      e.preventDefault();
      e.stopPropagation();
      closeLayerPopup(dispatch);
    }
  }

  const dontShowAgain = (cookieName) => {
    setPopupCookie(cookieName, 'y')
    dispatch(setLayerPopupClose({...popupState, layerPopup: false}));
  }

  /* 팝업 닫기 */
  const popupClose = () => {
    dispatch(setLayerPopupClose({...popupState, layerPopup: false}));
    if(isAndroid()) {
      dispatch(setGlobalCtxBackFunctionEnd(''));
    }
  }

  const setPopupCookie = (c_name, value) => {
    const exdate = new Date()
    exdate.setDate(exdate.getDate() + 1)
    exdate.setHours(0)
    exdate.setMinutes(0)
    exdate.setSeconds(0)

    const encodedValue = encodeURIComponent(value)
    const c_value = encodedValue + '; expires=' + exdate.toUTCString()
    document.cookie = c_name + '=' + c_value + '; path=/; secure; domain=.dallalive.com'
  }

  useEffect(() => {
    document.body.style.overflow = "overflowHidden";
    return () => {
      document.body.style.overflow = "";
    }
  }, [])

  return (
    <div id="layerPop" onClick={closePopupDim}>
      <div className="popLayer">
        <div className="popContainer">
          {title && <h2>{title}</h2>}
          {children}
        </div>
        {close && 
        <div className="closeWrap">
          {cookie && 
            <label className="dontShowLabel" onClick={dontShowAgain(cookie)}>
              <input type="checkbox" className="dontShow"/>
              <span className="dontShowBtn">다시보지않기</span>
            </label>
          }
          <button className="close" onClick={(e) => popupClose(e)}>닫기</button>
        </div>
        }
      </div>
    </div>
  )
}

LayerPopup2.defaultProps = {
  close: true,
}

export default LayerPopup2;