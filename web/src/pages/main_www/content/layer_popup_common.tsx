import React, { useEffect, useState } from "react";
import DalbitCheckbox from "common/ui/dalbit_checkbox";

export default function LayerPopupCommon(props: any) {
  const { setPopupMoon } = props;
  const [check, setCheck] = useState(false);
  const [idx, setIdx] = useState(-1);
  const handleDimClick = () => {
    setPopupMoon(false);
  };

  useEffect(() => {
    /* popup떳을시 scroll 막는 코드 */
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div id="layerPopupCommon" onClick={handleDimClick}>
      <div className="popup">
        <button className="btn-close">
          <span className="blind">닫기</span>
        </button>
        <div
          className="in"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {props.children}

          <div className="btnWrap">
            <button
              className="btn-ok"
              onClick={() => {
                handleDimClick();
              }}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
