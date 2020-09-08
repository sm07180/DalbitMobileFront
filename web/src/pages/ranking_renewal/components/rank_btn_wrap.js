import React, {useContext} from 'react'
import {RankContext} from 'context/rank_ctx'

const btnArray = [
  {val: 1, text: 'DJ'},
  {val: 2, text: '팬'},
  {val: 3, text: '레벨'},
  {val: 4, text: '좋아요'}
]
function RankBtnWrap() {
  const {rankState, rankAction} = useContext(RankContext)

  const {formState} = rankState

  const formDispatch = rankAction.formDispatch

  return (
    <div className="rankTab">
      {btnArray.map((v, idx) => {
        return (
          <button
            key={idx}
            className={formState.rankType === v.val ? 'rankTab__btn rankTab__btn--active' : 'rankTab__btn'}
            onClick={() => {
              if (formState.rankType !== v.val) {
                scrollTo(0, 0)
                formDispatch({
                  type: 'RANK_TYPE',
                  val: v.val
                })
              }
            }}>
            {v.text}
          </button>
        )
      })}
    </div>
  )
}

export default React.memo(RankBtnWrap)
