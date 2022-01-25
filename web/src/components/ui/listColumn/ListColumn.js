import React from 'react'

import './listColumn.scss'

const ListColumn = (props) => {
  const {photo, children} = props

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

ListColumn.defaultProps = {
  photo: [],
}

export default ListColumn
