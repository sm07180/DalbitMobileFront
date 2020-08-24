import React, {useCallback} from 'react'

import {DATE_TYPE} from '../constant'

export default function RankgDateBtn(props) {
  const {dateType, setDateType, fetching} = props
  const createDateButton = useCallback(() => {
    const DATE_TYPE_LIST = Object.keys(DATE_TYPE).map((type) => DATE_TYPE[type])
    return ['오늘', '주간', '월간', '연간'].map((text, idx) => {
      return (
        <button
          key={`date-type-${idx}`}
          className={
            dateType === DATE_TYPE_LIST[idx]
              ? 'todayList__btn todayList__btn--active'
              : fetching === true
              ? 'todayList__btn todayList__btn--blur'
              : 'todayList__btn'
          }
          onClick={() => {
            if (fetching === false) setDateType(DATE_TYPE_LIST[idx])
          }}>
          {text}
        </button>
      )
    })
  }, [dateType, fetching])

  return <div className="todayList">{createDateButton()}</div>
}
