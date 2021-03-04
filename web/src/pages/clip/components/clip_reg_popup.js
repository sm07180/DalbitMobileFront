import React, {useContext, useEffect, useState} from "react";
import {useHistory} from 'react-router-dom'
import Api from "context/api";
import DalbitCheckbox from 'components/ui/dalbit_checkbox'
import {Context} from 'context'
import {OS_TYPE} from 'context/config.js'
import {Hybrid} from "context/hybrid";

import "../clip.scss";

export default function ClipRegPop(props) {
  const { setRegPopupState } = props;
  const context = useContext(Context)
  const history = useHistory()
  // reference
  const customHeader = JSON.parse(Api.customHeader)
  const [check, setCheck] = useState(false);

  const closePopup = () => {
    if (check) {
      setPopupCookie("reg_popup", "y");
    }
    setRegPopupState(false);
  };

  const closePopupDim = (e) => {
    const target = e.target;
    if (target.id === "mainLayerPopup") {
      closePopup();
    }
  };

  const handleCookie = () => {
    setCheck(!check);
  };

  const setPopupCookie = (c_name, value) => {
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + 1);
    exdate.setHours(0);
    exdate.setMinutes(0);
    exdate.setSeconds(0);

    const encodedValue = encodeURIComponent(value);
    const c_value = encodedValue + "; expires=" + exdate.toUTCString();
    document.cookie = c_name + "=" + c_value + "; path=/; secure; domain=.dalbitlive.com";
  };

  const goClipReg = (type) => {
    if(customHeader['os'] === OS_TYPE['Desktop']) {
      context.action.updatePopup('APPDOWN', 'appDownAlrt', 4)
    } else {
      if (context.token.isLogin === false) {
        return context.action.alert({
          msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
          callback: () => {
            history.push('/login')
          }
        })
      } else {
        if (type === 'record') {
          Hybrid('EnterClipRecord')
        } else if (type === 'upload') {
          Hybrid('ClipUploadJoin')
        }
      }
    }
  };


  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div id="mainLayerPopup" onClick={closePopupDim}>
      <div id="clipRegPopup">
        <button className="btn-close" onClick={closePopup}>
          닫기
        </button>
        <div className="layerContent">

          <div className="content_wrap">
            <img src="https://image.dalbitlive.com/banner/2102/img_gift.jpg" alt="클립 유도 팝업 이미지"/>
            <ul className="desc_wrap">
              <li>청취는 1분 이상만 인정합니다.</li>
              <li>
                등록한 클립을 비공개로 전환하거나 저작권에 <br/>
                위배되는 음원은 지급되지 않습니다.
              </li>
            </ul>
            <div className="btn_wrap">
              <button className="btn rec" onClick={() => goClipReg('record')}>
                클립 녹음
              </button>
              <button className="btn reg" onClick={() => goClipReg('upload')}>
                클립 등록
              </button>
            </div>
          </div>
          <div className="checkbox_wrap">
            <label className="checkbox_label">
              <DalbitCheckbox
                size={20}
                status={check}
                callback={() => {
                  handleCookie();
                }}
              />
              <span>오늘하루 열지 않음</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
