import React, {useContext, useEffect, useState, useCallback} from 'react'

import {liveBoxchangeDate} from 'pages/common/rank/rank_fn'
import {useDispatch, useSelector} from "react-redux";
import {setRankFormDate} from "redux/actions/rank";

export default function SpecialHistoryHandle({fetching}) {
  const dispatch = useDispatch();
  const rankState = useSelector(({rank}) => rank);

  const {formState} = rankState


  const [dateTitle, setDateTitle] = useState('이번달')

  const handleDate = (type) => {
    const handle = liveBoxchangeDate(type, 3, formState[formState.pageType].currentDate)
    dispatch(setRankFormDate(handle));
  }

  const formatDate = useCallback(() => {
    const yy = formState[formState.pageType].currentDate.getFullYear()
    const mm = formState[formState.pageType].currentDate.getMonth() + 1
    const dd = formState[formState.pageType].currentDate.getDate()

    const cdt = new Date()
    const cyy = cdt.getFullYear()
    const cmm = cdt.getMonth() + 1

    if (yy === cyy && mm === cmm) {
      setDateTitle('이번달')
    } else {
      setDateTitle(`${yy}년 ${mm}월`)
    }
  }, [formState])

  const prevLast = () => {
    const yy = formState[formState.pageType].currentDate.getFullYear()
    const mm = formState[formState.pageType].currentDate.getMonth() + 1
    const dd = formState[formState.pageType].currentDate.getDate()

    const cdt = new Date('2020-06-01')
    const cyy = cdt.getFullYear()
    const cmm = cdt.getMonth() + 1

    if (yy === cyy && cmm === mm) {
      return false
    } else {
      return true
    }
  }

  const nextLast = () => {
    const yy = formState[formState.pageType].currentDate.getFullYear()
    const mm = formState[formState.pageType].currentDate.getMonth() + 1
    const dd = formState[formState.pageType].currentDate.getDate()

    const cdt = new Date()
    const cyy = cdt.getFullYear()
    const cmm = cdt.getMonth() + 1

    if (yy === cyy && cmm === mm) {
      return false
    } else {
      return true
    }
  }

  useEffect(() => {
    formatDate()
  }, [formState])
  return (
    <div className="detailView isSpecial">
      <button
        className={`prevButton ${prevLast() && fetching === false && 'active'}`}
        onClick={() => {
          if (prevLast() && fetching === false) {
            handleDate('back')
          }
        }}>
        이전
      </button>

      <div className="title">
        <div className="titleWrap">{dateTitle}</div>
      </div>

      <button
        className={`nextButton ${nextLast() && fetching === false && 'active'}`}
        onClick={() => {
          if (nextLast() && fetching === false) {
            handleDate('front')
          }
        }}>
        다음
      </button>
    </div>
  )
}
