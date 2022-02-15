import React from 'react'

// global components
import CntTitle from '../../../components/ui/cntTitle/CntTitle';

const SearchHistory = (props) => {

  const historyData = ["사랑", "쏭디제이", "꽃 피면 달 생각하고", "그 해 우리는", "이지금"];

  return (
    <div className='searchHistory'>
      <CntTitle title="최근 검색어">
        <button className='removeAll'>모두삭제</button>
      </CntTitle>
      <div className='historyWrap'>
        {historyData.map((list,index) => {
          return (
            <div className='historylist' key={index}>{list}</div>
          )
        })}
      </div>
    </div>
  )
}
export default SearchHistory;