import React, {useEffect, useState, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import API from 'context/api'

import VoteThxPop from './pop_vote_thx'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default function awardEventVote() {
  const history = useHistory()
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const {token} = globalState

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
          v.checked = Object.values(data).includes(v.djMemNo)
          return v
        })
      )
    }
  }

  async function fetchAwardVote(items) {
    const [items1, items2, items3] = items

    const {result, message} = await API.postAwardVote({
      isRevote: voteState,
      year: '2020',
      djIdx_1: items1.djIdx,
      djIdx_2: items2.djIdx,
      djIdx_3: items3.djIdx,
      djMemNo_1: items1.djMemNo,
      djMemNo_2: items2.djMemNo,
      djMemNo_3: items3.djMemNo
    })
    if (result === 'success') {
      if (voteState === 0) {
        setVoteThxPop(true)
        setVoteState(1)
      } else if (voteState === 1) {
        setVoteState(3)
      } else {
        dispatch(setGlobalCtxMessage({type:"alert",
          msg: message
        }))
      }
    } else {
      dispatch(setGlobalCtxMessage({type:"alert",
        msg: message
      }))
    }
  }

  const validation = () => {
    if (!token.isLogin) {
      dispatch(setGlobalCtxMessage({type:"alert",
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',

        callback: () => {
          history.push({
            pathname: '/login',
            state: {
              state: 'event/award/vote'
            }
          })
        }
      }))
    } else {
      if (globalState.selfAuth === false) {
        history.push('/selfauth?event=/event/award/vote')
      } else {
        const items = awardList.filter((v) => {
          return v.checked
        })

        if (items) {
          const [items1, items2, items3] = items

          if (items1 && items2 && items3) {
            if (voteState === 0) {
              dispatch(setGlobalCtxMessage({type:"confirm",
                title: '투표하기',
                msg: `선택하신 DJ에게 투표하시겠습니까?<br />인증된 번호는 다시 사용할 수 없습니다.
              `,
                callback: () => {
                  fetchAwardVote(items)
                }
              }))
            } else if (voteState === 1) {
              dispatch(setGlobalCtxMessage({type:"confirm",
                title: '투표하기',
                msg: `이전 투표를 취소하고 다시 투표하겠습니까?<br/>투표는 1회에 한해서만 수정되며<br/>수정된 내용은 다시 변경 할 수 없습니다.
              `,
                callback: () => {
                  fetchAwardVote(items)

                  dispatch(setGlobalCtxMessage({type:"alert",
                    title: '투표하기',
                    msg: `투표가 수정되었습니다.<br />투표에 참여해주셔서 감사합니다.
              `,
                    callback: () => {
                      setVoteState(3)
                    }
                  }))
                }
              }))
            }
          } else {
            dispatch(setGlobalCtxMessage({type:"alert",
              msg: `3명의 DJ를 선택해주세요.`
            }))
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
            dispatch(setGlobalCtxMessage({type:"alert",
              msg: `투표는 총 3명까지 가능합니다.`
            }))
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
                    history.push(`/profile/${djMemNo}`)
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
        <button className="voteBtn" onClick={validation} disabled={voteState === 2 || voteState === 3 ? true : false}>
          {voteState === 1
            ? '투표수정하기'
            : voteState === 2
            ? '투표 기간이 종료되었습니다'
            : voteState === 3
            ? '이미 참여하였습니다'
            : '투표하기'}
        </button>
      </div>

      {voteThxePop && <VoteThxPop setVoteThxPop={setVoteThxPop} />}
    </div>
  )
}
