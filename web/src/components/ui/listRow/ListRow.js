import React from 'react'

import './listRow.scss'

const ListRow = (props) => {
  const {photo, children, onClick} = props

  return (
    <div className="listRow">
      <div className="photo" onClick={onClick}>
        <img src={photo} alt="" />
      </div>
      {children}
    </div>
  )
}

export default ListRow

ListRow.defaultProps = {
  onClick: () => {}
};