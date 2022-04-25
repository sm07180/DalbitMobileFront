// React
import React from 'react'

const BadgeList = (props) => {
  const {list} = props
  return (
    <>
      {list.map((v, idx) => {
        const {icon, startColor, endColor, text} = v
        return (
          <React.Fragment key={idx + `badge`}>
            <em
              className={`icon_wrap icon_badge ${icon !== '' ? 'img' : 'text'}`}
              key={`badge-${idx}`}
              style={{
                background: `linear-gradient(to right, ${startColor}, ${endColor}`
              }}>
              {icon !== '' && <img src={icon} alt="배지아이콘" className="img" />}
              <span>{text}</span>
            </em>
          </React.Fragment>
        )
      })}
    </>
  )
}

export default React.memo(BadgeList)
