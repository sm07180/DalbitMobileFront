import React, { useEffect } from 'react'

import { DATE_TYPE } from '../constant'
import {useDispatch, useSelector} from "react-redux";
import {setFormDateType} from "redux/actions/clipRank";

export default function ClipRankDateBtn() {
  const clipRankState = useSelector(({clipRank}) => clipRank);
  const { formState } = clipRankState
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [formState.dateType])

  return (
    <div className="todayList">
      <div className="todayList">
        <button
          className={`todayList__btn ${formState.dateType === DATE_TYPE.DAY ? 'todayList__btn--active' : ''}`}
          onClick={() => {dispatch(setFormDateType(DATE_TYPE.DAY));}}>
          일간
        </button>

        <button
          className={`todayList__btn ${formState.dateType === DATE_TYPE.WEEK ? 'todayList__btn--active' : ''}`}
          onClick={() => {dispatch(setFormDateType(DATE_TYPE.WEEK));}}>
          주간
        </button>
      </div>
    </div>
  )

}
