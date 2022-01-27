import React from 'react'

export default () => {
  const historyData = ["사랑", "쏭디제이", "꽃 피면 달 생각하고", "그 해 우리는", "이지금"];

  return (
    <div className='searchHistory'>
      <div className='titleWrap'>
        <div className='title'>최근 검색어</div>
        <button className='removeAll'>모두삭제</button>
      </div>
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