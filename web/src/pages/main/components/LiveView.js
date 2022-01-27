import React from 'react'

// global components
import BadgeItems from 'components/ui/badgeItems/BadgeItems'
import GenderItems from 'components/ui/genderItems/GenderItems'
import NoResult from 'components/ui/new_noResult'

const LiveView = (props) => {
  const {data} = props

  return (
    <>
    <div className="liveListWrap">
      {data && data.length > 0 ?
        <>
          {data.map((list,index) => {
            return (
              <div className="listRow" key={index}>
                <div className="photo">
                  <img src={list.bjProfImg.thumb100x100} alt="" />
                </div>
                <div className='listContent'>
                  <div className="listItem">
                    <BadgeItems data={list.liveBadgeList} />
                  </div>
                  <div className="listItem">
                    <span className='title'>{list.title}</span>
                  </div>
                  <div className="listItem">
                    <GenderItems data={list.bjGender} />
                    <span className="nickNm">{list.bjNickNm}</span>
                  </div>
                  <div className="listItem">
                    <span className="state">
                      <i className='totallistener'></i>
                      {list.totalCnt}
                      <i className='listener'></i>
                      {list.entryCnt}
                      <i className='like'></i>
                      {list.likeCnt}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </>
        :
        <NoResult text={'리스트가 없습니다.'} />
      }
    </div>
    </>
  )
}

export default LiveView
