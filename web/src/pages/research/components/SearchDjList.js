import React from 'react'

// global components
import BadgeItems from 'components/ui/badgeItems/BadgeItems'
import GenderItems from 'components/ui/genderItems/GenderItems'
import DataCnt from 'components/ui/dataCnt/DataCnt'
// components
// css
import '../scss/resultCnt.scss'
import CntTitle from "components/ui/cntTItle/CntTitle";

const SearchDjList = (props) => {
  const {data, type, pagingInfo} = props

  return (
    <>
      <div className='searchResultWrap'>
        {data && data.length > 0 ?
          <>
            {data.map((list,index) => {
              return (
                <div className="listRow" key={index}>
                  <div className="photo">
                    <img src={list.profImg.thumb150x150} />
                  </div>
                  <div className='listContent'>
                    <div className="listItem">
                      <GenderItems data={list.gender} />
                      <span className="nickNm">{list.nickNm}</span>
                    </div>
                    <div className="listItem dataCtn">
                      <DataCnt type={"totalCnt"} value={list.fanCnt}/>
                    </div>
                  </div>
                </div>
              )
            })}
          </>
          :
          <div className='searchNoResult'>
            <p>검색된 DJ가 없습니다.</p>
          </div>
        }
      </div>
    </>
  );
};

export default SearchDjList;
