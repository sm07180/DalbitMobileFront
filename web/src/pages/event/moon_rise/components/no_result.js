import React from 'react'

export default function (props) {
  const {type} = props
  return (
    <div className="moonNoresult_box">
      <img src={`https://image.dallalive.com/event/moonrise/img_fullmoon_${type}_none.png`} alt={`문${type} 결과 없음 이미지`} />
      {type === 'dj' ? (
        <span className="innerTxt">
          아직 <em className="purpleColor">문법사</em>들이 등장하지 않았네요.
        </span>
      ) : (
        <span className="innerTxt">
          아직 <em className="purpleColor">문집사</em>들이 등장하지 않았네요.
        </span>
      )}
    </div>
  )
}
