import React, {useState, useCallback, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {DATE_TYPE} from '../constant'

import BenefitIcon from '../static/ico-benefit.svg'

export default function RankHandleDateBtn(props) {
  const {handleDate, selectedDate, dateType, fetching} = props
  const history = useHistory()
  const [btnActive, setBtnActive] = useState({
    prev: false,
    next: false
  })

  const [dateTitle, setDateTitle] = useState({
    header: '오늘',
    date: ''
  })

  const formatDate = useCallback(() => {
    let selectedYear = selectedDate.getFullYear()
    let selectedMonth = selectedDate.getMonth() + 1
    let selectedDay = selectedDate.getDate()

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()

    const dayAgo = new Date(new Date().setDate(new Date().getDate() - 1))
    const agoyear = dayAgo.getFullYear()
    const agomonth = dayAgo.getMonth() + 1
    const agoday = dayAgo.getDate()

    if (dateType === DATE_TYPE.DAY) {
      if (year === selectedYear && month === selectedMonth && day === selectedDay) {
        setDateTitle({
          header: '오늘',
          date: '실시간 집계 중입니다.'
        })
        // setBtnActive({prev: true, next: false})
      } else if (selectedYear === agoyear && selectedMonth === agomonth && selectedDay === agoday) {
        setDateTitle({
          header: '어제',
          date: ''
        })
        // setBtnActive({prev: true, next: true})
      } else {
        setDateTitle({
          header: '일간 순위',
          date: `${selectedYear}.${selectedMonth}.${selectedDay}`
        })
        // setBtnActive({prev: true, next: true})
      }
      const cDt = new Date('2020-07-01')

      let ye = cDt.getFullYear()
      let yM = cDt.getMonth() + 1
      let yd = cDt.getDate()

      const tDt = new Date()

      let tye = tDt.getFullYear()
      let tyM = tDt.getMonth() + 1
      let tyd = tDt.getDate()

      if (selectedYear === ye && selectedMonth === yM && selectedDay === yd) {
        setBtnActive({next: true, prev: false})
      } else if (selectedYear === tye && selectedMonth === tyM && selectedDay === tyd) {
        setBtnActive({next: false, prev: true})
      } else {
        setBtnActive({next: true, prev: true})
      }
    } else if (dateType === DATE_TYPE.WEEK) {
      function convertMonday() {
        let today = new Date()
        const day = today.getDay()

        let calcNum = 0
        if (day === 0) {
          calcNum = 1
        } else if (day === 1) {
          calcNum = 0
        } else {
          calcNum = 1 - day
        }

        today.setDate(today.getDate() + calcNum)
        return today
      }

      const currentWeek = convertMonday()
      const currentYear = currentWeek.getFullYear()
      const currentMonth = currentWeek.getMonth() + 1
      const currentDate = currentWeek.getDate()

      const week = convertMonday()
      const weekAgo = new Date(week.setDate(week.getDate() - 7))
      let wYear = weekAgo.getFullYear()
      let wMonth = weekAgo.getMonth() + 1
      let wDate = weekAgo.getDate()
      // const WEEK_LENGTH = 7
      // const currentWeek = Math.ceil(day / WEEK_LENGTH)
      // const selectedWeek = Math.ceil(selectedDay / WEEK_LENGTH)

      if (selectedYear === currentYear && selectedMonth === currentMonth && selectedDay === currentDate) {
        setDateTitle({
          header: '이번주',
          date: '실시간 집계 중입니다.'
        })
        // setBtnActive({prev: true, next: false})
      } else if (selectedYear === wYear && selectedMonth === wMonth && selectedDay === wDate) {
        setDateTitle({
          header: '지난주',
          date: ''
        })
        // setBtnActive({prev: true, next: true})
      } else {
        setDateTitle({
          header: '주간 순위',
          date: `${selectedYear}.${selectedMonth}. ${Math.ceil(selectedDay / 7)}주`
        })
        // setBtnActive({prev: true, next: true})
      }

      const cDt = new Date('2020-07-06')
      let ye = cDt.getFullYear()
      let yM = cDt.getMonth() + 1
      let yd = cDt.getDate()

      if (selectedYear === ye && selectedMonth === yM && selectedDay === yd) {
        setBtnActive({next: true, prev: false})
      } else if (selectedYear === currentYear && selectedMonth === currentMonth && selectedDay === currentDate) {
        setBtnActive({next: false, prev: true})
      } else {
        setBtnActive({next: true, prev: true})
      }
    } else if (dateType === DATE_TYPE.MONTH) {
      if (year === selectedYear && month === selectedMonth) {
        setDateTitle({
          header: '이번달',
          date: '실시간 집계 중입니다.'
        })
        // setBtnActive({prev: true, next: false})
      } else if (year === selectedYear && month - 1 === selectedMonth) {
        setDateTitle({
          header: '지난달',
          date: ''
        })
        // setBtnActive({prev: true, next: true})
      } else {
        setDateTitle({
          header: '월간 순위',
          date: `${selectedYear}.${selectedMonth}`
        })
        // setBtnActive({prev: true, next: true})
      }
      const cDt = new Date('2020-07-01')
      let ye = cDt.getFullYear()
      let yM = cDt.getMonth() + 1

      if (selectedYear === ye && selectedMonth === yM) {
        setBtnActive({next: true, prev: false})
      } else if (year === selectedYear && month === selectedMonth) {
        setBtnActive({next: false, prev: true})
      } else {
        setBtnActive({next: true, prev: true})
      }
    } else if (dateType === DATE_TYPE.YEAR) {
      setDateTitle({
        header: `${selectedYear}년`,
        // date: selectedYear
        date: '실시간 집계 중입니다.'
      })
      setBtnActive({prev: false, next: false})
    }
  }, [dateType, selectedDate])

  useEffect(() => {
    formatDate()
  }, [selectedDate])
  return (
    <div className="detailView">
      <button
        className={`prevButton ${btnActive['prev'] === true && fetching === false ? 'active' : ''}`}
        onClick={() => {
          if (btnActive['prev'] === true && fetching === false) {
            handleDate('prev')
          }
        }}>
        이전
      </button>

      <div className="title">
        <div className="titleWrap">
          {dateTitle.header}
          <img
            src={BenefitIcon}
            alt="benefit"
            className="benefitSize"
            onClick={() => {
              history.push('/rank/benefit')
            }}
          />
        </div>
        <span>{dateTitle.date}</span>
      </div>

      <button
        className={`nextButton ${btnActive['next'] === true && fetching === false ? 'active' : ''}`}
        onClick={() => {
          if (btnActive['next'] === true && fetching === false) {
            handleDate('next')
          }
        }}>
        다음
      </button>
    </div>
  )
}
