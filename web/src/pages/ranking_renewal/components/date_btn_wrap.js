import React from 'react'

import {convertMonday, convertMonth} from 'pages/common/rank/rank_fn'

import {DATE_TYPE, RANK_TYPE} from '../constant'

import guideIcon from '../static/guide_s.png'
import {useDispatch, useSelector} from "react-redux";
import {setRankFormDateType} from "redux/actions/rank";
import {setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";

const btnArray = [
  {val: DATE_TYPE.TIME, text: '타임'},
  {val: DATE_TYPE.DAY, text: '일간'},
  {val: DATE_TYPE.WEEK, text: '주간'},
  {val: DATE_TYPE.MONTH, text: '월간'},
  {val: DATE_TYPE.YEAR, text: '연간'}
]

function DateBtnWrap({fetching}) {

  const dispatch = useDispatch();
  const rankState = useSelector(({rankCtx}) => rankCtx);

  const {formState} = rankState

  const createBtnArray = () => {
    let type
    if (formState[formState.pageType].rankType === RANK_TYPE.FAN) {
      type = btnArray.slice(1, 4)
    } else if (formState[formState.pageType].rankType === RANK_TYPE.LIKE) {
      type = btnArray.slice(1, 3)
    } else {
      type = btnArray
    }
    return type
  }

  return (
    <div className="todayList">
      {formState[formState.pageType].rankType === RANK_TYPE.LIKE ? (
        <div className="guideIconBox">
          <img
            src={guideIcon}
            onClick={() => {
              dispatch(setGlobalCtxUpdatePopup({popup: ['RANK_POP', 'like']}))
            }}
          />
        </div>
      ) : (
        ''
      )}

      {createBtnArray().map((v, idx) => {
        return (
          <button
            key={idx}
            className={
              formState[formState.pageType].dateType === v.val
                ? 'todayList__btn todayList__btn--active'
                : fetching === true
                ? 'todayList__btn todayList__btn--blur'
                : 'todayList__btn'
            }
            onClick={() => {
              if (fetching === false) {
                if (formState[formState.pageType].dateType !== v.val) {
                  window.scrollTo(0, 0)
                  const someDate = v.val === 2 ? convertMonday() : v.val === 3 ? convertMonth() : new Date()

                  dispatch(setRankFormDateType({
                    dateType: v.val,
                    date: someDate
                  }))
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
