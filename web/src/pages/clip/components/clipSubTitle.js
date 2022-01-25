import React from 'react'

import '../dallaClip.scss'

const ClipSubTitle = (props) => {
  const {title,more,children} = props

  const onMoreClick = () => {
    history.push(`/${more}`)
  }

  return (
    <div className="subTitle">
      <h3>{title}</h3>
      {children}
      {more &&
        <button onClick={onMoreClick}>더보기</button>
      }
    </div>
  )
}

export default ClipSubTitle
