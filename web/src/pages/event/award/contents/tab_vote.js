import React, {useEffect, useState, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import API from 'context/api'
import {Context} from 'context'

import VoteThxPop from './pop_vote_thx'

export default function awardEventVote() {
  const history = useHistory()
  const globalCtx = useContext(Context)
  const {token} = globalCtx

  const [voteThxePop, setVoteThxPop] = useState(false)
  const [awardList, setAwardList] = useState([])
  const [voteState, setVoteState] = useState(-1)

  async function fetchAwardList() {
    const {result, data} = await API.getAwardList({
      year: '2020'
    })
    if (result === 'success') {
      setVoteState(data.voteState)

      setAwardList(
        data.list.map((v) => {
          v.checked = false
          return v
        })
      )
    }
  }

  async function fetchAwardVote(items) {
    const [items1, items2, items3] = items

    const {result, message} = await API.postAwardVote({
      year: '2020',
      djIdx_1: items1.djIdx,
      djIdx_2: items2.djIdx,
      djIdx_3: items3.djIdx,
      djMemNo_1: items1.djMemNo,
      djMemNo_2: items2.djMemNo,
      djMemNo_3: items3.djMemNo
    })
    if (result === 'success') {
      setVoteThxPop(true)
      setVoteState(1)
    } else {
      globalCtx.action.alert({
        msg: message
      })
    }
  }

  const validation = () => {
    if (!token.isLogin) {
      globalCtx.action.alert({
        msg: '로그인 후 참여해주세요.',

        callback: () => {
          history.push({
            pathname: '/login',
            state: {
              state: 'event/award/vote'
            }
          })
        }
      })
    } else {
      if (globalCtx.selfAuth === false) {
        history.push('/selfauth?event=/event/award/vote')
      } else {
        const items = awardList?.filter((v) => {
          return v.checked
        })

        if (items) {
          const [items1, items2, items3] = items
          if (items1 && items2 && items3) {
            globalCtx.action.alert({
              title: '투표하기',
              type: 'confirm',
              msg: `선택하신 DJ에게 투표하시겠습니까?
            투표 완료 후 취소 및 변경할 수 없습니다.
            `,
              callback: () => {
                fetchAwardVote(items)
              }
            })
          } else {
            globalCtx.action.alert({
              msg: `3명의 DJ를 선택해주세요.`
            })
          }
        }
      }
    }
  }

  const checkResult = useCallback(
    (item) => {
      if (awardList !== null) {
        if (
          awardList.filter((v) => {
            return v.checked
          }).length > 2
        ) {
          if (item.checked === true) {
            setAwardList(
              awardList.map((v) => {
                if (v.djIdx === item.djIdx) {
                  v.checked = !v.checked
                }
                return v
              })
            )
          } else {
            globalCtx.action.alert({
              msg: `투표는 총 3명까지 가능합니다.`
            })
          }
        } else {
          setAwardList(
            awardList.map((v) => {
              if (v.djIdx === item.djIdx) {
                v.checked = !v.checked
              }
              return v
            })
          )
        }
      }
    },
    [awardList]
  )

  useEffect(() => {
    fetchAwardList()
  }, [])

  return (
    <div className="tabVoteWrap">
      <ul className="voteListBox">
        {awardList !== null &&
          awardList.map((item, idx) => {
            const {djIdx, djProfImg, djNickNm, djMemNo, checked} = item
            return (
              <li className="voteListItem" key={idx}>
                <div
                  className="thumb"
                  onClick={() => {
                    history.push(`/mypage/${djMemNo}`)
                  }}>
                  <img src={djProfImg.thumb336x336} alt={djNickNm} />
                  <p className="nickName">{djNickNm}</p>
                </div>

                <div className="checkBoxWrap">
                  {checked ? (
                    <button
                      id={`check-${idx}`}
                      onClick={() => {
                        checkResult(item)
                      }}
                      className={`checkedBtn`}>
                      <img src="https://image.dalbitlive.com/event/award/201214/ico-check-r.svg" /> 선택되었습니다
                    </button>
                  ) : (
                    <button
                      id={`check-${idx}`}
                      onClick={() => {
                        checkResult(item)
                      }}
                      className={`checkBtn`}>
                      선택하기
                    </button>
                  )}
                </div>
              </li>
            )
          })}
      </ul>

      <div className="btnBox">
        <button className="voteBtn" onClick={validation} disabled={voteState === 1 || voteState === 2 ? true : false}>
          {voteState === 1 ? '이미 투표하셨습니다' : voteState === 2 ? '투표 기간이 종료되었습니다' : '투표하기'}
        </button>
      </div>

      {voteThxePop && <VoteThxPop setVoteThxPop={setVoteThxPop} />}
    </div>
  )
}
