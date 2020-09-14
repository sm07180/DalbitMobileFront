import React, {useContext} from 'react'
import {RankContext} from 'context/rank_ctx'

import {convertMonday, convertMonth} from '../lib/common_fn'

const btnArray = [
  {val: 1, text: '오늘'},
  {val: 2, text: '주간'},
  {val: 3, text: '월간'},
  {val: 4, text: '연간'}
]

function DateBtnWrap({fetching}) {
  const {rankState, rankAction} = useContext(RankContext)

  const {formState} = rankState
  const formDispatch = rankAction.formDispatch

  return (
    <div className="todayList">
      {btnArray.map((v, idx) => {
        return (
          <button
            key={idx}
            className={
              formState.dateType === v.val
                ? 'todayList__btn todayList__btn--active'
                : fetching === true
                ? 'todayList__btn todayList__btn--blur'
                : 'todayList__btn'
            }
            onClick={() => {
              if (fetching === false) {
                if (formState.dateType !== v.val) {
                  window.scrollTo(0, 0)
                  const someDate = v.val === 2 ? convertMonday() : v.val === 3 ? convertMonth() : new Date()

                  formDispatch({
                    type: 'DATE_TYPE',
                    val: {
                      dateType: v.val,
                      date: someDate
                    }
                  })
                }
              }
            }}>
            {v.text}
          </button>
        )
      })}
    </div>
  )
}

export default React.memo(DateBtnWrap)
