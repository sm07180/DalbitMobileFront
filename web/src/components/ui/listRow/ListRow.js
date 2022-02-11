import React from 'react'
import {withRouter} from 'react-router-dom'

import './listRow.scss'

const ListRow = (props) => {
  const {photo, children, memNo} = props

  return (
    <div className="listRow">
      <div className="photo" onClick={() => props.history.push(`/profile/${memNo}`)}>
        <img src={photo} />
      </div>
      {children}
    </div>
  )
}

export default withRouter(ListRow);
