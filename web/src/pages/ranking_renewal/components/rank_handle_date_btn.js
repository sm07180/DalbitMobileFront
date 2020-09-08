import React, {useContext, useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'

import {RankContext} from 'context/rank_ctx'

import {changeDate, convertDateToText, convertMonday, convertMonth} from '../lib/common_fn'

import benefitIcon from '../static/ico-benefit.png'

function RankHandleDateBtn({fetching}) {
  const history = useHistory()
  const {rankState, rankAction} = useContext(RankContext)

  const formDispatch = rankAction.formDispatch

  const {formState, myInfo} = rankState

  const [dateTitle, setDateTitle] = useState({
    header: '오늘',
    date: ''
  })

  const formatDate = () => {
    const textObj = convertDateToText(formState.dateType, formState.currentDate, 1)

    if (textObj instanceof Object) {
      if (textObj.date === 'time') {
        setDateTitle({
          header: textObj.header,
          date: myInfo.time
        })
      } else {
        setDateTitle({
          header: textObj.header,
          date: textObj.date
        })
      }
    }
  }

  const handleDate = (some) => {
    const handle = changeDate(some, formState.dateType, formState.currentDate)
    formDispatch({
      type: 'DATE',
      val: handle
    })
  }

  useEffect(() => {
    formatDate()
  }, [myInfo])

  const prevLast = () => {
    let cy = formState.currentDate.getFullYear()
    let cm = formState.currentDate.getMonth() + 1
    let cd = formState.currentDate.getDate()
    if (formState.dateType === 1) {
      const cDt = new Date('2020-07-01')

      let ye = cDt.getFullYear()
      let yM = cDt.getMonth() + 1
      let yd = cDt.getDate()

      if (cy === ye && cm === yM && cd === yd) {
        return false
      } else {
        return true
      }
    } else if (formState.dateType === 2) {
      const cDt = new Date('2020-07-06')
      let ye = cDt.getFullYear()
      let yM = cDt.getMonth() + 1
      let yd = cDt.getDate()

      if (cy === ye && cm === yM && cd === yd) {
        return false
      } else {
        return true
      }
    } else if (formState.dateType === 3) {
      const cDt = new Date('2020-07-01')
      let ye = cDt.getFullYear()
      let yM = cDt.getMonth() + 1
      let yd = cDt.getDate()

      if (cy === ye && cm === yM) {
        return false
      } else {
        return true
      }
    } else {
      return false
    }
  }

  const nextLast = () => {
    let cy = formState.currentDate.getFullYear()
    let cm = formState.currentDate.getMonth() + 1
    let cd = formState.currentDate.getDate()
    if (formState.dateType === 1) {
      const cDt = new Date()

      let ye = cDt.getFullYear()
      let yM = cDt.getMonth() + 1
      let yd = cDt.getDate()

      if (cy === ye && cm === yM && cd === yd) {
        return false
      } else {
        return true
      }
    } else if (formState.dateType === 2) {
      const cDt = convertMonday()
      let ye = cDt.getFullYear()
      let yM = cDt.getMonth() + 1
      let yd = cDt.getDate()

      if (cy === ye && cm === yM && cd === yd) {
        return false
      } else {
        return true
      }
    } else if (formState.dateType === 3) {
      const cDt = convertMonth()
      let ye = cDt.getFullYear()
      let yM = cDt.getMonth() + 1
      let yd = cDt.getDate()

      if (cy === ye && cm === yM) {
        return false
      } else {
        return true
      }
    } else {
      return false
    }
  }

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
        <div className="titleWrap">
          {dateTitle.header}
          <img
            src={benefitIcon}
            className="benefitSize"
            onClick={() => {
              history.push('/rank/benefit')
            }}
          />
        </div>
        <span>{dateTitle.date}</span>
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

export default React.memo(RankHandleDateBtn)
