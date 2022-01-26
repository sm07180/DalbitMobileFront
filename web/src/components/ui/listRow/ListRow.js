import React from 'react'

import './listRow.scss'

const ListRow = (props) => {
  const {photo, children} = props

  return (
    <div className="listRow">
      <div className="photo">
        <img src={photo} />
      </div>
      {children}
    </div>
  )
}

export default ListRow
