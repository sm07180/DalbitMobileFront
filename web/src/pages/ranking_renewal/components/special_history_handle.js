import React, {useContext, useEffect, useState, useCallback} from 'react'

import {Context} from 'context'
import {RankContext} from 'context/rank_ctx'

import {changeDate} from '../lib/common_fn'

export default function SpecialHistoryHandle({fetching}) {
  const {rankState, rankAction} = useContext(RankContext)

  const {formState} = rankState

  const formDispatch = rankAction.formDispatch

  const [dateTitle, setDateTitle] = useState('이번달')

  const handleDate = (type) => {
    const handle = changeDate(type, 3, formState.currentDate)

    formDispatch({
      type: 'DATE',
      val: handle
    })
  }

  const formatDate = useCallback(() => {
    const yy = formState.currentDate.getFullYear()
    const mm = formState.currentDate.getMonth() + 1
    const dd = formState.currentDate.getDate()

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
    const yy = formState.currentDate.getFullYear()
    const mm = formState.currentDate.getMonth() + 1
    const dd = formState.currentDate.getDate()

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
    const yy = formState.currentDate.getFullYear()
    const mm = formState.currentDate.getMonth() + 1
    const dd = formState.currentDate.getDate()

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
    <div className="detailView">
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
