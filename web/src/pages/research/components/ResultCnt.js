import React from 'react'

// global components
import BadgeItems from 'components/ui/badgeItems/BadgeItems'
import GenderItems from 'components/ui/genderItems/GenderItems'
import DataCnt from 'components/ui/dataCnt/DataCnt'
// components
// css
import './resultCnt.scss'

const ResultCnt = (props) => {
  const {data, type} = props

  return (
    <div className='searchResultWrap'>
      {data && data.length > 0 ?
        <>
          {data.map((list,index) => {
            return (
              <div className="listRow" key={index}>
                <div className="photo">
                  <img src={list.bgImg.thumb150x150} />
                  {list.roomType === '03' && <div className="badgeVideo"></div>}
                </div>
                <div className='listContent'>
                  {type === 'dj' &&
                    <>
                    <div className="listItem">
                      <GenderItems data={list.gender} />
                      <span className="nickNm">{list.bjNickNm}</span>
                    </div>
                    <div className="listItem">
                      <span className="userId">{list.bjNickNm}</span>
                    </div>
                    <div className="listItem dataCtn">
                      <DataCnt type={"totalCnt"} value={list.totalCnt}/>
                    </div>
                    </>
                  }
                  {type === 'live' &&
                    <>
                    <div className="listItem">
                      <BadgeItems data={list.commonBadgeList} />
                    </div>
                    <div className="listItem">
                      <span className='title'>{list.title}</span>
                    </div>                            
                    <div className="listItem">
                      <GenderItems data={list.gender} />
                      <span className="nickNm">{list.bjNickNm}</span>
                    </div>
                    <div className="listItem dataCtn">
                      <DataCnt type={"totalCnt"} value={list.totalCnt}/>
                      <DataCnt type={"newFanCnt"} value={list.newFanCnt}/>
                      <DataCnt type={"likeCnt"} value={list.likeCnt}/>
                    </div>
                    </>
                  }
                  {type === 'clip' &&
                    <>
                    <div className="listItem">
                      <span className='subject'>{list.subjectType}</span>
                      <span className='title'>{list.title}</span>
                    </div>                            
                    <div className="listItem">
                      <GenderItems data={list.gender} />
                      <span className="nickNm">{list.nickName}</span>
                    </div>
                    <div className="listItem dataCtn">
                      <DataCnt type={"newFanCnt"} value={list.newFanCnt}/>
                      <DataCnt type={"likeCnt"} value={list.likeCnt}/>
                    </div>
                    </>
                  }
                </div>
              </div>
            )
          })}
        </>
      : 
        <div className='searchNoResult'>
          {type === 'dj' &&
            <p>검색된 DJ가 없습니다.</p>
          }
          {type === 'live' &&
            <p>검색된 라이브가 없습니다.</p>
          }
          {type === 'clip' &&
            <p>검색된 클립이 없습니다.</p>
          }
        </div>
      }
    </div>
  )
}

export default ResultCnt
