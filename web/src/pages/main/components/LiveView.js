import React from 'react'

// components
import BadgeItems from 'components/ui/badgeItems/BadgeItems'
import ListRow from 'components/ui/listRow/ListRow'

const LiveView = (props) => {
  const {data} = props

  return (
    <>
    <div className="liveListWrap">
      {data.map((list,index) => {
        return (
          <ListRow list={list} key={index}>
            <div className='listContent'>
              <div className="listItem">
                <BadgeItems content={list.liveBadgeList} />
              </div>
              <div className="listItem">
                <span className='title'>{list.title}</span>
              </div>
              <div className="listItem">
                <span className='gender'>{list.bjGender}</span>
                <span className="nickNm">{list.bjNickNm}</span>
              </div>
              <div className="listItem">
                <span className="state">
                  {list.totalCnt}
                  {list.entryCnt}
                  {list.likeCnt}
                </span>
              </div>
            </div>
          </ListRow>
        )
      })}
    </div>
    </>
  )
}

export default LiveView