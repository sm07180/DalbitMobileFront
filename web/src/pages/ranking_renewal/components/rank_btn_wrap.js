import React, {useContext} from 'react'
import {RankContext} from 'context/rank_ctx'

import Swiper from 'react-id-swiper'
import {RANK_TYPE} from '../constant'

const btnArray = [
  {val: 1, text: 'DJ'},
  {val: 2, text: '팬'},
  {val: 4, text: '좋아요'},
  {val: 3, text: '레벨'},
  {val: 5, text: '스페셜DJ', isSpecial: true}
]
export default function RankBtnWrap({fetching}) {
  const {rankState, rankAction} = useContext(RankContext)

  const {formState} = rankState

  const formDispatch = rankAction.formDispatch

  const swiperParams = {
    // loop: true,
    // spaceBetween: 20,
    slidesPerView: 'auto',
    rebuildOnUpdate: true
  }

  const syncScroll = () => {
    window.scrollTo(0, 0)
  }

  return (
    <div className="rankTab">
      {/* {btnArray.map((v, idx) => {
        return (
          <button
            key={idx}
            className={formState.rankType === v.val ? 'rankTab__btn rankTab__btn--active' : 'rankTab__btn'}
            onClick={async () => {
              if (!fetching) {
                if (formState.rankType !== v.val) {
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
      })} */}
      {btnArray.length > 0 && (
        <Swiper {...swiperParams}>
          {btnArray.map((v, idx) => {
            return (
              <div key={idx}>
                {v.isSpecial === true ? (
                  <button
                    className={
                      formState.rankType === v.val ? 'rankTab__specialBtn rankTab__specialBtn--active' : 'rankTab__specialBtn'
                    }
                    onClick={async () => {
                      if (!fetching) {
                        if (formState.rankType !== v.val) {
                          await syncScroll()
                          formDispatch({
                            type: 'RANK_TYPE',
                            val: 5
                          })
                        }
                      }
                    }}>
                    스페셜DJ
                  </button>
                ) : (
                  <button
                    key={idx}
                    className={formState.rankType === v.val ? 'rankTab__btn rankTab__btn--active' : 'rankTab__btn'}
                    onClick={async () => {
                      if (!fetching) {
                        if (formState.rankType !== v.val) {
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
                )}
              </div>
            )
          })}
        </Swiper>
      )}
    </div>
  )
}
