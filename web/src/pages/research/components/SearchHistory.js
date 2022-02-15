import React, { useState } from 'react'

// global components
import CntTitle from 'components/ui/cntTItle/CntTitle';

const SearchHistory = (props) => {
  const { onInputClick } = props;
  const [historyData, setHistoryData] = useState(localStorage.getItem('searchList') ? localStorage.getItem('searchList').split('|') : []);

  const delHistory = (e) => {
    localStorage.setItem('searchList', '');
    setHistoryData([]);
  }

  const handleClick = (e) => {
    const { value } = e.currentTarget.dataset;

    onInputClick(value);
  }

  return (
    <div className='searchHistory'>
      <CntTitle title="최근 검색어">
        <button className='removeAll' onClick={delHistory}>모두삭제</button>
      </CntTitle>
      <div className='historyWrap'>
        {historyData.map((list,index) => {
          return (
            <div className='historylist' key={index} data-value={list} onClick={handleClick}>{list}</div>
          )
        })}
      </div>
    </div>
  )
}
export default SearchHistory;