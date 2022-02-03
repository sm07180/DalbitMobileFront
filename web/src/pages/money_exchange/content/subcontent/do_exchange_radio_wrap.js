import React from 'react'

export default function MakeRadioWrap({radioCheck, handleEv}) {
  return (
    <div className="radioLabelWrap">
      <label
        className={`radioLabelWrap__label radioLabelWrap__label--left ${radioCheck === 0 ? 'on' : ''}`}
        htmlFor="r1"
        onClick={() => handleEv(0)}>
        신규 정보
      </label>
      <input type="radio" id="r1" name="rr" />
      <label
        className={`radioLabelWrap__label radioLabelWrap__label ${radioCheck === 1 ? 'on' : ''}`}
        htmlFor="r2"
        onClick={() => handleEv(1)}>
        최근 계좌
      </label>
      <label
        className={`radioLabelWrap__label radioLabelWrap__label--right ${radioCheck === 2 ? 'on' : ''}`}
        htmlFor="r3"
        onClick={() => handleEv(2)}>
        내 계좌
      </label>
      <input type="radio" id="r2" name="rr" />
    </div>
  )
}
