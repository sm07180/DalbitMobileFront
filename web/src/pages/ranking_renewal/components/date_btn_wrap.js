import React, {useContext} from 'react'
import {Context} from 'context'
import {RankContext} from 'context/rank_ctx'

import {convertMonday, convertMonth} from '../lib/common_fn'

import {DATE_TYPE, RANK_TYPE} from '../constant'

import guideIcon from '../static/guide_s.png'

const btnArray = [
  {val: DATE_TYPE.DAY, text: '일간'},
  {val: DATE_TYPE.WEEK, text: '주간'},
  {val: DATE_TYPE.MONTH, text: '월간'},
  {val: DATE_TYPE.YEAR, text: '연간'}
]

function DateBtnWrap({fetching}) {
  const context = useContext(Context)
  const {rankState, rankAction} = useContext(RankContext)

  const {formState} = rankState
  const formDispatch = rankAction.formDispatch

  return (
    <div className="todayList">
      {formState.rankType === RANK_TYPE.LIKE ? (
        <>
          <div className="guideIconBox">
            <img
              src={guideIcon}
              onClick={() => {
                context.action.updatePopup('RANK_POP', 'like')
              }}
            />
          </div>
          {btnArray.slice(0, 2).map((v, idx) => {
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
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}

export default React.memo(DateBtnWrap)
