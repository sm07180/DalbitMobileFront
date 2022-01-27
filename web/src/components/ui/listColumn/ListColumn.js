import React from 'react'

import './listColumn.scss'

const ListColumn = (props) => {
  const {photo, children, index} = props

  return (
    <div className="listColumn" data-swiper-index={index}>
      <div className="photo">
        <img src={photo} alt="" />
      </div>
      {children}
    </div>
  )
}

export default ListColumn
