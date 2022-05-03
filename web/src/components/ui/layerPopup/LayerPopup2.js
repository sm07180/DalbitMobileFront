import React, {useEffect} from 'react';
// scss
import './layerPopup.scss';
import {useDispatch, useSelector} from "react-redux";
import {setCommonPopupClose} from "redux/actions/common";

/* 팝업 닫기 */
export const closeLayerPopup = (dispatch) => {
  dispatch(setCommonPopupClose());
  console.log('1',dispatch(setCommonPopupClose()));
};

const LayerPopup2 = (props) => {
  const {setPopup, title, children, cookie, close} = props;
  const popupState = useSelector(state => state.popup);
  const dispatch = useDispatch();
  
  console.log(popupState.commonPopup);

  const closePopupDim = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target;
    if (target.id === 'layerPop') {
      closeLayerPopup(dispatch);
      console.log('out');
    }
  }

  const dontShowAgain = (cookieName) => {
    setPopupCookie(cookieName, 'y')
    setPopup(false)
  }

  /* 팝업 닫기 */
  const popupClose = () => {
    dispatch(setCommonPopupClose({...popupState, commonPopup: false}));
    console.log('1');
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
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div id="layerPop" className={close ? '' : 'defaultAlert'} onClick={closePopupDim}>
      <div className="popLayer">
        <div className="popContainer">
          {title && <h2>{title}</h2>}
          {children}
        </div>
        {close && 
        <div className='closeWrap'>
          {cookie && 
            <label className='dontShowLabel' onClick={dontShowAgain(cookie)}>
              <input type='checkbox' className='dontShow'/>
              <span className='dontShowBtn'>다시보지않기</span>
            </label>
          }
          <button className='close'onClick={popupClose}>닫기</button>
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