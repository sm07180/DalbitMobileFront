import React, { useContext, useEffect } from 'react'
import { ClipRankContext } from 'context/clip_rank_ctx'

import { DATE_TYPE } from '../constant'

export default function ClipRankDateBtn() {
  const { clipRankState, clipRankAction } = useContext(ClipRankContext)
  const { formState } = clipRankState
  const formDispatch = clipRankAction.formDispatch

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [formState.dateType])

  return (
    <div className="todayList">
      <div className="todayList">
        <button
          className={`todayList__btn ${formState.dateType === DATE_TYPE.DAY ? 'todayList__btn--active' : ''}`}
          onClick={() => {formDispatch({type: 'DATE_TYPE', val: DATE_TYPE.DAY});}}>
          일간
        </button>

        <button
          className={`todayList__btn ${formState.dateType === DATE_TYPE.WEEK ? 'todayList__btn--active' : ''}`}
          onClick={() => {formDispatch({type: 'DATE_TYPE', val: DATE_TYPE.WEEK})}}>
          주간
        </button>
      </div>
    </div>
  )

}
