import React from 'react'

export default function ExchangeRadio() {
  return (
    <div className="radioLabelBox">
      <label
        className='left on'
        htmlFor="r1">
        신규 정보
      </label>
      <input type="radio" id="r1" name="rr" />
      <label
        className=''
        htmlFor="r2">
        최근 계좌
      </label>
      <label
        className='right'
        htmlFor="r3">
        내 계좌
      </label>
      <input type="radio" id="r2" name="rr" />
    </div>
  )
}
