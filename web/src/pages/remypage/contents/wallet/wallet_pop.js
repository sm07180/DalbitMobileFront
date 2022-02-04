import React, {useEffect, useState, useCallback} from 'react'

import Api from 'context/api'

import DalbitCheckbox from 'components/ui/dalbit_checkbox'
import './wallet.scss'

function WalletPop({formState, formDispatch, setShowFilter}) {
  const [allChecked, setAllChecked] = useState(true)
  const [filter, setFilter] = useState([])
  const [totalCnt, setTotalCnt] = useState(0)

  const changeChecked = useCallback(
    (item) => {
      setFilter(
        filter.map((v) => {
          if (v.walletCode === item) {
            v.checked = !v.checked
            return v
          }
          return v
        })
      )
    },
    [filter, setFilter]
  )

  const allCheckEv = useCallback(() => {
    if (allChecked === true) {
      // setAllChecked(false)
      // setFilter(
      //   filter.map((v) => {
      //     v.checked = false
      //     return v
      //   })
      // )
    } else {
      setAllChecked(true)
      setFilter(
        filter.map((v) => {
          v.checked = false
          return v
        })
      )
    }
  }, [allChecked, filter, setFilter])

  useEffect(() => {
    if (
      filter.every((v) => {
        return v.checked
      }) &&
      allChecked === false
    ) {
      setAllChecked(true)
      setFilter(
        filter.map((v) => {
          v.checked = false
          return v
        })
      )
    } else if (
      filter.every((v) => {
        return !v.checked
      }) &&
      allChecked === true
    ) {
    } else if (
      !filter.every((v) => {
        return v.checked
      }) &&
      allChecked === true
    ) {
      setAllChecked(false)
    }
  }, [filter])

  useEffect(() => {
    const fetchData = async () => {
      const res = await Api.getMypageWalletPop({
        walletType: formState.coinType === 'dal' ? 1 : 0
      })

      if (res.result === 'success') {
        if (res.data.list && res.data.list.length > 0) {
          let cnt = 0
          res.data.list.forEach((v, idx) => {
            cnt += v.cnt
            v.checked = formState.filterList[idx].checked
          })
          setTotalCnt(cnt)

          setFilter(res.data.list)
        }
      }
    }

    fetchData()
  }, [])

  return (
    <div
      id="walletPop"
      onClick={(e) => {
        e.stopPropagation()
      }}>
      <div className="title">{formState.coinType === 'dal' ? '달' : '별'} 사용/획득</div>

      <div className="contents">
        <div className="contents__buttonWrap">
          <button
            onClick={() => {
              allCheckEv()
            }}>
            <DalbitCheckbox status={allChecked} />
            <span>전체내역 ({totalCnt}건)</span>
          </button>
        </div>

        <div className="contents__buttonWrap">
          {filter
            .filter((v) => {
              return v.type === 'use'
            })
            .map((v, idx, self) => {
              return (
                <button
                  key={idx}
                  onClick={() => {
                    changeChecked(v.walletCode)
                  }}>
                  <DalbitCheckbox status={v.checked} />
                  <span>
                    {v.text} ({v.cnt}건)
                  </span>
                </button>
              )
            })}
        </div>

        <div className="contents__buttonWrap">
          {filter
            .filter((v) => {
              return v.type === 'get'
            })
            .map((v, idx) => {
              return (
                <button
                  key={idx}
                  onClick={() => {
                    changeChecked(v.walletCode)
                  }}>
                  <DalbitCheckbox status={v.checked} />
                  <span>
                    {v.text} ({v.cnt}건)
                  </span>
                </button>
              )
            })}
        </div>
      </div>

      <div className="buttonWrap">
        <button
          onClick={() => {
            setShowFilter(false)
          }}>
          취소
        </button>
        <button
          onClick={() => {
            formDispatch({
              type: 'filter',
              val: filter
            })
            setShowFilter(false)
          }}>
          적용
        </button>
      </div>
    </div>
  )
}

export default React.memo(WalletPop)
