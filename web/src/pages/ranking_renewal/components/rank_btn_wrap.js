import React, {useContext} from 'react'
import {RankContext} from 'context/rank_ctx'

import {RANK_TYPE, PAGE_TYPE} from '../constant'

const btnArray = [
  {val: RANK_TYPE.DJ, text: 'DJ'},
  {val: RANK_TYPE.FAN, text: '팬'},
  {val: RANK_TYPE.LIKE, text: '좋아요'}
]

const fameArray = [
  {val: RANK_TYPE.SPECIAL, text: '스페셜DJ', isSpecial: true},
  // {val: RANK_TYPE.LEVEL, text: '레벨'},
  {val: RANK_TYPE.WEEKLYPICK, text: '위클리픽'},
  {val: RANK_TYPE.SECOND, text: '15초'}
]
export default function RankBtnWrap({fetching}) {
  const {rankState, rankAction} = useContext(RankContext)

  const {formState} = rankState

  const formDispatch = rankAction.formDispatch

  const syncScroll = () => {
    window.scrollTo(0, 0)
  }

  return (
    <div className="rankTab">
      {formState.pageType === PAGE_TYPE.RANKING ? (
        <>
          {btnArray.map((v, idx) => {
            return (
              <button
                key={idx}
                className={formState[PAGE_TYPE.RANKING].rankType === v.val ? 'rankTab__btn rankTab__btn--active' : 'rankTab__btn'}
                onClick={async () => {
                  if (!fetching) {
                    if (formState[PAGE_TYPE.RANKING].rankType !== v.val) {
                      await syncScroll()
                      formDispatch({
                        type: 'RANK_TYPE',
                        val: v.val
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
          {fameArray.map((v, idx) => {
            return (
              <button
                key={idx}
                className={formState[PAGE_TYPE.FAME].rankType === v.val ? 'rankTab__btn rankTab__btn--active' : 'rankTab__btn'}
                onClick={async () => {
                  if (!fetching) {
                    if (formState[PAGE_TYPE.FAME].rankType !== v.val) {
                      await syncScroll()
                      formDispatch({
                        type: 'RANK_TYPE',
                        val: v.val
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
