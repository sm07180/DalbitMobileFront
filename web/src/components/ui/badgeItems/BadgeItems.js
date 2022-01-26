import React from 'react'

import './badgeItems.scss'

const BadgeItems = (props) => {
  const {data} = props
  return (
    <>
      {data && data.map((list, index) => {
        const {icon, startColor, endColor, text} = list
        return (
          <React.Fragment key={index}>
            <em
              className={`badgeItem ${icon !== '' ? 'img' : 'text'}`}
              key={index}
              style={{
                background: `linear-gradient(to right, ${startColor}, ${endColor}`
              }}>
              {icon !== '' && <img src={icon} alt="뱃지아이콘" className="img" />}
              <span>{text}</span>
            </em>
          </React.Fragment>
        )
      })}
    </>
  )
}

export default React.memo(BadgeItems)
