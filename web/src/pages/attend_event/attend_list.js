//context
import {Context} from 'context'
import React, {useContext} from 'react'

export default (props) => {
  const context = useContext(Context)
  const {dateList} = props

  const createCheckIn = () => {
    const {check_ok} = dateList

    let checkOkName

    if (check_ok === '0') {
      checkOkName = `stamp-box-item fail`
    } else if (check_ok === '1') {
      checkOkName = `stamp-box-item success`
    } else if (result === null) {
      checkOkName = `stamp-box-item`
    }

    return checkOkName
  }

  const creatList = () => {
    const data = dateList

    const baseCount = 7
    let result = [...data].concat(Array(baseCount - data.length).fill(null))
    const date_pair = {
      0: '월요일',
      1: '화요일',
      2: '수요일',
      3: '목요일',
      4: '금요일',
      5: '토요일',
      6: '일요일'
    }

    const text = ['EXP10+1달', 'EXP10+2달', 'EXP10+1달', 'EXP10+2달', 'EXP15+3달', 'EXP15+3달', 'EXP15+3달']

    return (
      <>
        <ul className="stamp-box-list">
          {result.map((item, index) => {
            let class_name = ''

            if (item !== null) {
              const {check_ok} = item
              class_name = `stamp-box-item ${check_ok === 1 ? 'success' : check_ok === 0 ? 'fail' : ''}`
            } else if (item === null) {
              class_name = 'stamp-box-item'
            }

            return (
              <li className={class_name} key={`event-date-${index}`}>
                <div className="stamp-area">
                  <span>{date_pair[index]}</span>
                </div>

                <p>{text[index]}</p>
              </li>
            )
          })}
        </ul>
      </>
    )
  }

  return creatList()
}
