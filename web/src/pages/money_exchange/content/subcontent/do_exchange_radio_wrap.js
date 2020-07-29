import React from 'react'

export default function MakeRadioWrap({radioCheck, handleEv}) {
  return (
    <div className="radioLabelWrap">
      <label
        className={`radioLabelWrap__label radioLabelWrap__label--left ${radioCheck === 0 ? 'on' : ''}`}
        htmlFor="r1"
        onClick={() => handleEv(0)}>
        새로운정보 입력
      </label>
      <input type="radio" id="r1" name="rr" />
      <label
        className={`radioLabelWrap__label radioLabelWrap__label--right ${radioCheck === 1 ? 'on' : ''}`}
        htmlFor="r2"
        onClick={() => handleEv(1)}>
        기존정보 신청
      </label>
      <input type="radio" id="r2" name="rr" />
    </div>
  )
}
