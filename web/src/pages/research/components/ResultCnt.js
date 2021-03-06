import React from 'react'

// global components
import BadgeItems from 'components/ui/badgeItems/BadgeItems'
import GenderItems from 'components/ui/genderItems/GenderItems'
import DataCnt from 'components/ui/dataCnt/DataCnt'
// components
// css
import '../scss/resultCnt.scss'

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
                  <img src={list.bgImg.thumb292x292} />
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
            <p>????????? DJ??? ????????????.</p>
          }
          {type === 'live' &&
            <p>????????? ???????????? ????????????.</p>
          }
          {type === 'clip' &&
            <p>????????? ????????? ????????????.</p>
          }
        </div>
      }
    </div>
  )
}

export default ResultCnt
