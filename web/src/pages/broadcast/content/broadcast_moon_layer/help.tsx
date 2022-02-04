import React from "react";

import "./index.scss";

type PropsType = {
  moonInfo: {
    [key: string]: any;
  };
  roomNo: string;
  helpToggle(bool: boolean): void;
};

function HelpLayer(props: PropsType) {
  const { helpToggle, moonInfo } = props;

  return (
    <div
      id="layerPopup"
      onClick={() => {
        helpToggle(false);
      }}
    >
      <div className="layerContainer" id="broadcast_help_modal">
        <h3>보름달을 함께 띄운다면?</h3>
        {moonInfo !== null && (
          <div className="layerContent">
            <div className="contents">
              <p className="contents__top">{moonInfo.helpText1}</p>
              <div className="contents__how">
                <p className="contents__how--header">공헌하는 방법</p>
                <div className="contents__how--text">
                  <p>{moonInfo.helpText2}</p>
                  <p className="contents__how--caption">{moonInfo.helpText3}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <button
          className="btnClose"
          onClick={() => {
            helpToggle(false);
          }}
        >
          닫기
        </button>
      </div>
    </div>

    // <div
    //   id="modal"
    //   onClick={() => {
    //     helpToggle(false);
    //   }}
    // >
    //   <div id="broadcast_help_modal">
    //     <div
    //       onClick={(e) => {
    //         e.stopPropagation();
    //       }}
    //     >
    //       <div className="header">보름달을 함께 띄운다면?</div>
    //       <div className="contents">
    //         <p className="contents__top">{helpText1}</p>
    //         <div className="contents__how">
    //           <p className="contents__how--header">공헌하는 방법</p>
    //           <div className="contents__how--text">
    //             <p>{helpText2}</p>
    //             <p className="contents__how--caption">{helpText3}</p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default HelpLayer;
