import React from 'react'

// global components
import BadgeItems from 'components/ui/badgeItems/BadgeItems'
import GenderItems from 'components/ui/genderItems/GenderItems'
import DataCnt from 'components/ui/dataCnt/DataCnt'
// components
// css
import '../scss/resultCnt.scss'

const SearchLiveList = (props) => {
  const {data, pagingInfo} = props

  return (
    <>
      <div className='searchResultWrap'>
        {data && data.length > 0 ?
          <>
            {data.map((list,index) => {
              return (
                <div className="listRow" key={index}>
                  <div className="photo">
                    <img src={list.bgImg.thumb150x150} />
                    {list.roomType === '03' && <div className="badgeVideo"/>}
                  </div>
                  <div className='listContent'>
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
                  </div>
                </div>
              )
            })}
          </>
          :
          <div className='searchNoResult'>
            <p>검색된 라이브가 없습니다.</p>
          </div>
        }
      </div>
    </>
  );
};

export default SearchLiveList;
