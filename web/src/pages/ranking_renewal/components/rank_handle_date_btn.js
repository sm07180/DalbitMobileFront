import React, {useContext, useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'

import {liveBoxchangeDate, convertDateToText, convertMonday, convertMonth, dateTimeConvert} from 'pages/common/rank/rank_fn'
import {DATE_TYPE, RANK_TYPE} from '../constant'
import {useDispatch, useSelector} from "react-redux";

import { setRankFormDate } from "redux/actions/rank";

function RankHandleDateBtn({fetching}) {
  const history = useHistory()
  const rankState = useSelector(({rankCtx}) => rankCtx);
  const dispatch = useDispatch();

  const {formState, myInfo, rankTimeData} = rankState

  const [dateTitle, setDateTitle] = useState({
    header: '오늘',
    date: ''
  })

  const formatDate = () => {
    const textObj = convertDateToText(formState[formState.pageType].dateType, formState[formState.pageType].currentDate, 1)

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
    if (formState[formState.pageType].dateType === DATE_TYPE.TIME) {
      if (some === 'back') {
        const dateCode = liveBoxchangeDate(
          some,
          formState[formState.pageType].dateType,
          formState[formState.pageType].currentDate
        )
        dispatch(setRankFormDate(dateCode));
      } else {
        const dateCode = liveBoxchangeDate(
          some,
          formState[formState.pageType].dateType,
          formState[formState.pageType].currentDate
        )

        dispatch(setRankFormDate(dateCode));

        // return handle
      }
    } else {
      const handle = liveBoxchangeDate(some, formState[formState.pageType].dateType, formState[formState.pageType].currentDate)
      dispatch(setRankFormDate(handle));
    }
  }

  useEffect(() => {
    formatDate()
  }, [formState])

  const prevLast = () => {
    let cy = formState[formState.pageType].currentDate.getFullYear()
    let cm = formState[formState.pageType].currentDate.getMonth() + 1
    let cd = formState[formState.pageType].currentDate.getDate()
    if (formState[formState.pageType].dateType === DATE_TYPE.DAY) {
      const cDt = (() => {
        if (formState[formState.pageType].rankType === RANK_TYPE.LIKE) {
          return new Date('2020-10-08')
        } else {
          return new Date('2020-07-01')
        }
      })()

      let ye = cDt.getFullYear()
      let yM = cDt.getMonth() + 1
      let yd = cDt.getDate()

      if (cy === ye && cm === yM && cd === yd) {
        return false
      } else {
        return true
      }
    } else if (formState[formState.pageType].dateType === DATE_TYPE.WEEK) {
      const cDt = (() => {
        if (formState[formState.pageType].rankType === RANK_TYPE.LIKE) {
          return new Date('2020-10-05')
        } else {
          return new Date('2020-07-06')
        }
      })()

      let ye = cDt.getFullYear()
      let yM = cDt.getMonth() + 1
      let yd = cDt.getDate()

      if (cy === ye && cm === yM && cd === yd) {
        return false
      } else {
        return true
      }
    } else if (formState[formState.pageType].dateType === DATE_TYPE.MONTH) {
      const cDt = new Date('2020-07-01')
      let ye = cDt.getFullYear()
      let yM = cDt.getMonth() + 1
      let yd = cDt.getDate()

      if (cy === ye && cm === yM) {
        return false
      } else {
        return true
      }
    } else if (formState[formState.pageType].dateType === DATE_TYPE.YEAR) {
      const cDt = new Date('2020-07-01')
      let ye = cDt.getFullYear()

      if (cy === ye) {
        return false
      } else {
        return true
      }
    } else {
      return false
    }
  }

  const nextLast = () => {
    let cy = formState[formState.pageType].currentDate.getFullYear()
    let cm = formState[formState.pageType].currentDate.getMonth() + 1
    let cd = formState[formState.pageType].currentDate.getDate()
    if (formState[formState.pageType].dateType === DATE_TYPE.DAY) {
      const cDt = new Date()

      let ye = cDt.getFullYear()
      let yM = cDt.getMonth() + 1
      let yd = cDt.getDate()

      if (cy === ye && cm === yM && cd === yd) {
        return false
      } else {
        return true
      }
    } else if (formState[formState.pageType].dateType === DATE_TYPE.WEEK) {
      const cDt = convertMonday()
      let ye = cDt.getFullYear()
      let yM = cDt.getMonth() + 1
      let yd = cDt.getDate()

      if (cy === ye && cm === yM && cd === yd) {
        return false
      } else {
        return true
      }
    } else if (formState[formState.pageType].dateType === DATE_TYPE.MONTH) {
      const cDt = convertMonth()
      let ye = cDt.getFullYear()
      let yM = cDt.getMonth() + 1
      let yd = cDt.getDate()

      if (cy === ye && cm === yM) {
        return false
      } else {
        return true
      }
    } else if (formState[formState.pageType].dateType === DATE_TYPE.YEAR) {
      const cDt = new Date('2020-07-01')
      let ye = cDt.getFullYear()

      if (cy === ye) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  const prevLastTime = () => {
    const typeTime = dateTimeConvert(new Date(formState[formState.pageType].currentDate))
    let cy = typeTime.getFullYear()
    let cm = typeTime.getMonth() + 1
    let cd = typeTime.getDate()
    let ch = typeTime.getHours()

    const cDt = (() => {
      // return new Date('2020-12-22T10:00:00')
      return new Date(2020, 11, 22, 10, 0, 0)
    })()

    let ye = cDt.getFullYear()
    let yM = cDt.getMonth() + 1
    let yd = cDt.getDate()
    let yh = cDt.getHours()

    if (cy === ye && cm === yM && cd === yd && ch === yh) {
      return false
    } else {
      return true
    }
  }

  const nextLastTime = () => {
    const typeTime = rankTimeData.nextDate

    if (typeTime) {
      return true
    } else {
      return false
    }
  }

  const timeRound = () => {
    if (rankTimeData.rankRound === 1) {
      return <>AM 00시 ~ AM 10시</>
    } else if (rankTimeData.rankRound === 2) {
      return <>AM 10시 ~ PM 19시</>
    } else {
      return <>PM 19시 ~ AM 00시</>
    }
  }

  return (
    <div className={`detailView `}>
      {formState[formState.pageType].dateType === DATE_TYPE.TIME ? (
        <>
          <button
            className={`prevButton ${prevLastTime() && fetching === false && 'active'}`}
            onClick={() => {
              if (prevLastTime() && fetching === false) {
                handleDate('back')
              }
            }}>
            이전
          </button>

          <div className="title">
            <div className="titleWrap">{rankTimeData.titleText}</div>
            <span>{timeRound()}</span>
          </div>

          <button
            className={`nextButton ${nextLastTime() && fetching === false && 'active'}`}
            onClick={() => {
              if (nextLastTime() && fetching === false) {
                handleDate('front')
              }
            }}>
            다음
          </button>
        </>
      ) : (
        <>
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
            <div className="titleWrap">{dateTitle.header}</div>
            <span>{dateTitle.date && dateTitle.date}</span>
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
        </>
      )}
    </div>
  )
}

export default React.memo(RankHandleDateBtn)
