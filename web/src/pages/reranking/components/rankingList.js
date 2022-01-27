import React from 'react'

// global components
import ListRow from 'components/ui/listRow/ListRow'
import GenderItems from 'components/ui/genderItems/GenderItems'
// components
// css

export default (props) => {
  const {data, children} = props

  return (
    <>
      {data.map((list, index) => {
        return (
          <ListRow photo={list.profImg.thumb88x88} key={index}>
            <div className="rank">{list.rank}</div>
            <div className="listContent">
              <div className="listItem">
                <GenderItems data={list.gender} />
                <span className="nick">{list.nickNm}</span>
              </div>
              {children}
            </div>
            <div className="listBack">
              {list.roomNo && <div className="badgeLive"></div>}                    
            </div>
          </ListRow>
        )
      })}
    </>
  )
}
