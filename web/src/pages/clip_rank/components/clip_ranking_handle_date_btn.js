import React, { useCallback, useEffect, useMemo, useContext } from 'react'
import { calcDateFormat, convertDateFormat } from "components/lib/dalbit_moment";
import { convertMonday } from "pages/common/rank/rank_fn";
import { DATE_TYPE } from '../constant'
import {setFormChangeDate} from "redux/actions/clipRank";
import {useDispatch, useSelector} from "react-redux";

export default function ClipRankHandleDateBtn() {
  const dispatch = useDispatch();
  const clipRankState = useSelector(({clipRankCtx}) => clipRankCtx);
  const { formState } = clipRankState

  const isEqualDateFormat = useMemo(() => {
    if(formState.dateType === DATE_TYPE.DAY) {
      return formState.rankingDate === convertDateFormat(new Date(), 'YYYY-MM-DD')
    } else {
      return formState.rankingDate === convertDateFormat(convertMonday(), 'YYYY-MM-DD')
    }
  }, [formState])

  const isEqualChangeDate = useMemo(() => {
    if(formState.dateType === DATE_TYPE.DAY) {
      return formState.rankingDate === calcDateFormat(new Date(),  -1);
    } else {
      return formState.rankingDate === calcDateFormat(convertMonday(), -7);
    }
  }, [formState])

  const isLastPrev = useMemo(() => {
    /* 클립랭킹 오픈날짜 하드코딩 - 2021-02-01 */
    const minDate = '2021-02-01'
    if(formState.rankingDate <= minDate) {
      return true
    } else {
      return false
    }
  }, [formState.rankingDate])

  const changeDate = useCallback((handle) => {
    const calcNumber = formState.dateType === DATE_TYPE.DAY ? 1 : 7;
    if(handle === 'prev') {
      dispatch(setFormChangeDate(calcDateFormat(formState.rankingDate, parseInt(`-${calcNumber}`))))
    } else {
      dispatch(setFormChangeDate(calcDateFormat(formState.rankingDate, calcNumber)))
    }
  }, [formState])

  const dateTitle = useMemo(()=> {
    if (formState.dateType === DATE_TYPE.DAY) {
      if (isEqualDateFormat) {
        return '오늘 실시간'
      } else if (isEqualChangeDate) {
        return '어제'
      } else {
        return (convertDateFormat(formState.rankingDate, 'YYYY.MM.DD'))
      }
    } else {
      if (isEqualDateFormat) {
        return '이번주 실시간'
      } else if (isEqualChangeDate) {
        return '저번주'
      } else {
        let year = formState.rankingDate.slice(0, 4)
        let month = formState.rankingDate.slice(5, 7)
        let day = formState.rankingDate.slice(8, 10)
        let date = `${year}.${month}.${Math.ceil(day / 7)}주`
        return date
      }
    }
  },[formState])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [formState])

  return (
    <div className="detailView">
      <button
        className={`prevButton ${isLastPrev ? `` : `active`}`}
        disabled={isLastPrev}
        onClick={() => {
          changeDate('prev');
        }}>
        이전
      </button>

      <div className="title">{dateTitle}</div>

      <button
        className={`nextButton ${isEqualDateFormat ? `` : `active`}`}
        disabled={isEqualDateFormat}
        onClick={() => {
          changeDate('next');
        }}>
        다음
      </button>
    </div>
  )
}
