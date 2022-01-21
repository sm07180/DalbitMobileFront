// 메인 팝업 관리자 wrapper - test
// 김재오 수정 2020-07-24
import React, { useEffect, useState } from "react";
import DalbitCheckbox from "common/ui/dalbit_checkbox";

export default function LayerPopupWrap({ data, setData, setPopupState }) {
  const [check, setCheck] = useState(false);
  const [idx, setIdx] = useState(-1);

  const closePopupDim = (e) => {
    const target = e.target;

    if (target.id === "layerPopup") {
      closePopup();
    }
  };

  const closePopup = () => {
    if (check) {
      setPopupCookie("popup_notice_" + `${idx}`, "y");
    }

    setCheck(false);

    const res = data.filter((v, idx) => {
      if (idx === 0) {
        return false;
      } else {
        return v;
      }
    });
    setData(res);
    setPopupState(false);
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

  const handleCookie = (idx: number) => {
    setCheck(!check);
    setPopupCookie("popup_notice_" + `${idx}`, "y");
    // closePopup();
  };

  const handleRoute = (data) => {
    if (data.linkType === "popup") {
      closePopup();
      window.open(data.linkUrl, "_blank");
    } else {
      window.location.href = data.linkUrl;
    }
  };

  const makeTextInner = (popupData) => {
    return (
      <>
        <div className="popupTextInner">
          {popupData.title && popupData.is_title_view == "1" && <h3 className="layerTitle">{popupData.title}</h3>}
          <p className="contents">
            {popupData.contents &&
              popupData.contents.split("\n").map((line, index) => {
                if (popupData.contents.match("\n")) {
                  return (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  );
                } else {
                  return <React.Fragment key={index}>{popupData.contents}</React.Fragment>;
                }
              })}
          </p>
          <div className="btnWrap">
            <button
              className="btn btn-ok"
              onClick={() => {
                {
                  popupData.is_button_view == "0" ? closePopup() : handleRoute(popupData);
                }
              }}
            >
              {popupData.buttonNm}
            </button>
          </div>
        </div>
        {popupData.is_cookie == "1" && (
          <div className="checkbox-wrap">
            <label className="checkbox-label">
              <DalbitCheckbox
                size={20}
                status={check}
                callback={() => {
                  handleCookie(popupData.idx);
                }}
              />
              <span>오늘하루 열지 않음</span>
            </label>
          </div>
        )}
      </>
    );
  };

  const makeImgInner = (popupData) => {
    return (
      <>
        <div className="contents">
          <a href={popupData.linkUrl}>
            <img src={popupData.bannerUrl} alt="" />
          </a>
        </div>

        {popupData.is_cookie == "1" && (
          <div className="checkbox-wrap">
            <label className="checkbox-label">
              <DalbitCheckbox
                size={20}
                status={check}
                callback={() => {
                  handleCookie(popupData.idx);
                }}
              />
              <span>오늘하루 열지 않음</span>
            </label>
          </div>
        )}
        {/* {popupData.is_cookie == "1" && (
          <div className="chk-label">
            <label htmlFor={`chkimg${popupData.idx}`}>
              <input type="checkbox" id={`chkimg${popupData.idx}`} onClick={() => handleCookie(popupData.idx)} />
              오늘 하루 보지 않기
            </label>
          </div>
        )} */}
      </>
    );
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div id="layerPopup" onClick={closePopupDim}>
      {// data.length > 0 &&
      data.map((v, idx) => {
        const { popup_type } = v;
        return (
          <div
            key={idx}
            className={`layerContainer popupBox ${idx === 0 && "active"} ${popup_type === 0 ? "popup__img" : "popup__text"}`}
          >
            <button className="btnClose" onClick={closePopup}>
              닫기
            </button>
            <div className="layerContent">{popup_type === 0 ? makeImgInner(v) : makeTextInner(v)}</div>
          </div>
        );
      })}
    </div>
  );
}
