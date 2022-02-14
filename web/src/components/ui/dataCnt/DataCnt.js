import React from 'react'

import Utility from 'components/lib/utility'

import './dataCnt.scss'

const DataCnt = (props) => {
  const {type, value, clickEvent} = props
  {/* type에는 전송받은 데이터의 key명을 string으로 입력,
      value에는 해당배열.key 형태로 입력
      clickEvent에는 해당 요소의 클릭이벤트를 함수로 입력  */}

  return (
    <>
      {
        type === "cupid" ?
          <i className={`cupid`} onClick={clickEvent}>{value ? Utility.printNumber(value) : 0}</i>
        :
          <i className={`dataCnt ${type}`} onClick={clickEvent}>{value ? Utility.printNumber(value) : 0}</i>
      }
    </>
  )
}

export default DataCnt
