import React from "react";

export default function MakeRadioWrap({ radioCheck, handleEv }) {
  return (
    // <div className="radioLabelWrap">
    //   <label className="radioLabelWrap__label" htmlFor="r1" onClick={() => handleEv(0)}>
    //     <span className={`${radioCheck === 0 ? "on" : ""}`}></span>
    //     <span>신규 정보</span>
    //   </label>
    //   <input type="radio" id="r1" name="rr" />
    //   <label className="radioLabelWrap__label" htmlFor="r2" onClick={() => handleEv(1)}>
    //     <span className={`${radioCheck === 1 ? "on" : ""}`}></span>
    //     <span>최근 계좌</span>
    //   </label>
    //   <input type="radio" id="r3" name="rr" />
    //   <label className="radioLabelWrap__label" htmlFor="r3" onClick={() => handleEv(1)}>
    //     <span className={`${radioCheck === 2 ? "on" : ""}`}></span>
    //     <span>내 계좌</span>
    //   </label>
    //   <input type="radio" id="r3" name="rr" />
    // </div>
    <div className="radioLabelWrap">
      <label
        className={`radioLabelWrap__label radioLabelWrap__label--left ${radioCheck === 0 ? "on" : ""}`}
        htmlFor="r1"
        onClick={() => handleEv(0)}
      >
        신규 정보
      </label>
      <input type="radio" id="r1" name="rr" />
      <label
        className={`radioLabelWrap__label radioLabelWrap__label ${radioCheck === 1 ? "on" : ""}`}
        htmlFor="r2"
        onClick={() => handleEv(1)}
      >
        최근 계좌
      </label>
      <label
        className={`radioLabelWrap__label radioLabelWrap__label--right ${radioCheck === 2 ? "on" : ""}`}
        htmlFor="r3"
        onClick={() => handleEv(2)}
      >
        내 계좌
      </label>
      <input type="radio" id="r2" name="rr" />
    </div>
  );
}
