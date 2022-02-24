import React, {useState, useEffect} from 'react'

// global components
import ListRow from 'components/ui/listRow/ListRow'
import GenderItems from 'components/ui/genderItems/GenderItems'
// components
// contents
// css
import './radioList.scss'

const RadioList = (props) => {
  const {data,children} = props

  return (
    <ListRow photo={data.profImg.thumb292x292}>
      <div className="listInfo">
        <div className="listItem">
          <GenderItems/>
          <span className="nickNm">{data.nickNm}</span>
        </div>
        <div className="listItem">
          <span className="memId">{data.memId}</span>
        </div>
      </div>
      {children}
    </ListRow>
  )
}

export default RadioList
