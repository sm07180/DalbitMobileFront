import React from 'react'

import './listRow.scss'

const ListRow = (props) => {
  const {list, children} = props

  return (
    <div className="listRow">
      <div className="photo">
        <img src={list && list.bjProfImg && list.bjProfImg.thumb190x190} alt={list.nickNm} />
      </div>
      {children}
    </div>
  )
}

ListRow.defaultProps = {
  list: [],
}

export default ListRow
