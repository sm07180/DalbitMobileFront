import React from 'react'

import './cntTitle.scss'

const CntTitle = (props) => {
  const {title,more,children} = props

  const onMoreClick = () => {
    history.push(`/${more}`)
  }

  return (
    <div className="cntTitle">
      <h2>{title}</h2>
      {children}
      {more &&
        <button onClick={onMoreClick}>더보기</button>
      }
    </div>
  )
}

export default CntTitle
