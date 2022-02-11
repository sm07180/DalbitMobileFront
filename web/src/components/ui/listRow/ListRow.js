import React from 'react'

import './listRow.scss'

const ListRow = (props) => {
  const {photo, children, onClick, photoClick} = props

  return (
    <div className="listRow" onClick={onClick}>
      <div className="photo" onClick={photoClick}>
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