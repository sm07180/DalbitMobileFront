import React from 'react'

import '../style.scss'

const ListColumn = (props) => {
  const {list, children} = props

  return (
    <React.Fragment>
      <div className="listColumn">
        <div className="photo">
          {list.nickNm !== 'banner' ? 
            <img src={list.profImg.thumb190x190} alt={list.nickNm} />
            :
            <img src={list.bannerUrl} alt={list.nickNm} />
          }
        </div>
        <p className='userNick'>{list.nickNm}</p>
        {children}
      </div>
    </React.Fragment>
  )
}

ListColumn.defaultProps = {
  list: [],
}

export default ListColumn
