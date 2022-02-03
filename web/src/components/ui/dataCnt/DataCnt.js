import React from 'react'

import './dataCnt.scss'

const DataCnt = (props) => {
  const {type, value} = props  
  {/* type에는 전송받은 데이터의 key명을 string으로 입력, value에는 해당배열.key 형태로 입력  */}

  return (
    <>
      {
        type === "cupid" ?
          <i className={`cupid`}>{value}</i>
        :
          <i className={`dataCnt ${type}`}>{value}</i>
      }
    </>
  )
}

export default DataCnt
