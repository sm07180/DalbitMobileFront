import React, {useState, useCallback, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {DATE_TYPE} from '../constant'

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

    if (dateType === DATE_TYPE.DAY) {
      if (year === selectedYear && month === selectedMonth && day === selectedDay) {
        setDateTitle({
          header: '오늘',
          date: ''
        })
        // setBtnActive({prev: true, next: false})
      } else if (year === selectedYear && month === selectedMonth && day - 1 === selectedDay) {
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
      const WEEK_LENGTH = 7
      const currentWeek = Math.ceil(day / WEEK_LENGTH)
      const selectedWeek = Math.ceil(selectedDay / WEEK_LENGTH)

      if (year === selectedYear && month === selectedMonth && currentWeek === selectedWeek) {
        setDateTitle({
          header: '이번주',
          date: ''
        })
        // setBtnActive({prev: true, next: false})
      } else if (year === selectedYear && month === selectedMonth && currentWeek - 1 === selectedWeek) {
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
      } else if (year === selectedYear && month === selectedMonth && currentWeek === selectedWeek) {
        setBtnActive({next: false, prev: true})
      } else {
        setBtnActive({next: true, prev: true})
      }
    } else if (dateType === DATE_TYPE.MONTH) {
      if (year === selectedYear && month === selectedMonth) {
        setDateTitle({
          header: '이번달',
          date: ''
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
        date: selectedYear
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
            src="https://image.dalbitlive.com/images/api/20200806/benefit.png"
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
