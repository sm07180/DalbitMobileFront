import React from 'react'

import './listColumn.scss'

const ListColumn = (props) => {
  const {photo, addContents, children} = props

  return (
    <React.Fragment>
      <div className="listColumn">
        <div className="photo">
          <img src={photo} />
        </div>
        {children}
      </div>
    </React.Fragment>
  )
}

export default ListColumn
