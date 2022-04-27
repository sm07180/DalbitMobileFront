import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import utility from 'components/lib/utility'

import imgPrize from './static/img_prize.svg'
import NoResult from 'components/ui/new_noResult'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default function EventWinner() {
  const history = useHistory()
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const [resultPrize, setResultPrize] = useState([])

  const [resultBoolean, setResultBoolean] = useState(false)
  const [winnerRankList, setWinnerRankList] = useState([])

  const eventIdx = history.location.pathname.split('/')[3]
  const memNo = globalState.token.memNo
  const eventTitle = history.location.state.title
  const announcementDate = history.location.state.announcementDate

  function dateFormat(num) {
    if (!num) return ''
    var formatNum = ''
    num = num.replace(/\-/gi, '')
    num = num.substr(0, 8)
    try {
      if (num.length == 8) {
        formatNum = num.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')
      }
    } catch (e) {
      formatNum = num
    }
    return formatNum
  }

  const dalReceive = (receiveDal, prizeIdx, state) => {
    dispatch(setGlobalCtxMessage({type: "confirm",
      callback: () => {
        receiveWayClick(prizeIdx, 2, state)
        fnReceiveDal()
      },
      msg:
        '바로 받으실 경우 추가 입력절차 없이  <br/>' +
        utility.addComma(receiveDal) +
        '달이 즉시 지급됩니다. <br/>' +
        '<p style="margin-top: 16px; font-size:22px; font-weight: bold; color: #FF3C7B;">바로 받으시겠습니까?</p>'
    }))
  }

  function fnReceiveDal() {
    dispatch(setGlobalCtxMessage({type: "alert",
      msg: '지급이 완료되었습니다. <br/>마이페이지 > 내 지갑에서 확인하실 수 있습니다.',
      callback: async () => {
        window.location.href='/'
      }
    }))
  }

  const checkSelfAuth = (prizeIdx, minorYn, state) => {
    async function fetchSelfAuth() {
      const res = await Api.self_auth_check({})
      if (res.result === 'success') {
        receiveWayClick(prizeIdx, 1, minorYn, state)
      } else {
        history.push(`/selfauth?event=/customer/event/${eventIdx}`)
      }
    }
    fetchSelfAuth()
  }

  const receiveWayClick = (prizeIdx, receiveWay_param, minorYn, state) => {
    async function prizeReceiveWay() {
      const {result, message} = await Api.prizeReceiveWay({
        data: {
          memNo: memNo,
          eventIdx: eventIdx,
          prizeIdx: prizeIdx,
          receiveWay: receiveWay_param
        }
      })
      if (result === 'success') {
        if (receiveWay_param === 1) {
          history.push({
            pathname: `/customer/event/winnerInfo`,
            state: {
              eventIdx: eventIdx,
              prizeIdx: prizeIdx,
              minorYn: minorYn,
              state_: state
            }
          })
        }
      } else {
        dispatch(setGlobalCtxMessage({type: "alert",
          msg: message,
          callback: async () => {
            window.location.href='/'
          }
        }))
      }
    }
    prizeReceiveWay()
  }

  async function getResultBoolean() {
    const res = await Api.getEventResult({
      data: {
        memNo: memNo,
        eventIdx: eventIdx
      }
    })
    const {result, data} = res
    if (result === 'success' && data) {
      setResultBoolean(true)
      getResult()
    } else {
      setResultBoolean(false)
    }
  }

  async function getResult() {
    const {result, data, message} = await Api.getEventResult({
      data: {
        memNo: memNo,
        eventIdx: eventIdx
      }
    })
    if (result === 'success') {
      setResultPrize(data)
    } else {
      dispatch(setGlobalCtxMessage({type: "alert",
        msg: message,
        callback: () => {
          window.location.href='/'
        }
      }))
    }
  }

  async function getWinner() {
    const {result, data, message} = await Api.getEventWinner({
      data: {
        memNo: memNo,
        eventIdx: eventIdx
      }
    })
    if (result === 'success') {
      setWinnerRankList(data.rankList)
    } else {
      dispatch(setGlobalCtxMessage({type: "alert",
        msg: message,
        callback: async () => {
          window.location.href='/'
        }
      }))
    }
  }

  useEffect(() => {
    getWinner()
    getResultBoolean()
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!globalState.token.isLogin) history.push('/')
  }, [globalState.token])

  return (
    <div id="winnerList">
      <div className="resultWrap">
        <div className="resultBox">
          <h3 className="title">나의 당첨 결과</h3>
          {resultBoolean === true ? (
            resultPrize.map((item, idx) => {
              if (!item) return null
              const {certificationYn, minorYn, prizeIdx, prizeName, prizeSlct, prizeRank, receiveWay, state, receiveDal} = item
              return (
                <div className="resultState" key={`resultPrize-${idx}`}>
                  <div className="winResult">
                    <>
                      <img src={imgPrize} />
                      <div className="resultPrizeName">{prizeName}</div>

                      {/* 최초 당첨 - 현물 */}
                      {prizeSlct === 1 && state === 0 && (
                        <div className="buttonArea">
                          <button
                            className="btn info"
                            onClick={() => {
                              checkSelfAuth(prizeIdx, minorYn, state)
                            }}>
                            배송 정보 입력
                          </button>
                          <button className="btn dal" onClick={() => dalReceive(receiveDal, prizeIdx, state)}>
                            달로 바로 받기
                          </button>
                        </div>
                      )}

                      {/* 최초 당첨 - 달/별 */}
                      {(prizeSlct === 2 || prizeSlct === 3) && state !== 3 && (
                        <>
                          <div className="textArea bold">
                            달/별은 추후 일괄 지급 예정입니다.
                            <br />
                          </div>
                          <div className="textArea">조금만 기다려주세요.</div>
                        </>
                      )}

                      {/* (현물) 입금 대기 중, 추가 정보 입력 */}
                      {prizeSlct === 1 && state === 1 && (
                        <div className="buttonArea">
                          <button
                            className="btn info"
                            onClick={() => {
                              receiveWayClick(prizeIdx, 1, minorYn, state)
                            }}>
                            배송 정보 변경
                          </button>
                          <button className="btn dal" onClick={() => dalReceive(receiveDal, prizeIdx, state)}>
                            달로 바로 받기
                          </button>
                        </div>
                      )}

                      {/* (현물) 입금 확인 후, 발송 완료 전 */}
                      {prizeSlct === 1 && state === 2 && (
                        <>
                          <div className="textArea bold">경품 발송 준비 중입니다.</div>
                          <div className="textArea">궁금하신 사항은 고객센터로 문의 바랍니다.</div>
                        </>
                      )}

                      {/* 발송 완료 - 현물, 달/별 */}
                      {state === 3 && <div className="textArea bold">경품 지급 완료.</div>}
                    </>
                  </div>
                </div>
              )
            })
          ) : (
                <div className="resultState">
                  <div className="noResult">
                    당첨된 경품이 없습니다.
                    <br />
                    다음엔 꼭 당첨되길 빌어요!
                  </div>
                </div>
          )}
        </div>
      </div>

      <div className="winnerWrap">
        <div className="eventTitleBox">{eventTitle} 당첨자 명단</div>
        <div className="eventDateBox">{dateFormat(announcementDate)}</div>
        {winnerRankList && winnerRankList.length > 0 ? (
            <ul className="winner-list">
              {winnerRankList.map((rank, rankIdx) => {
                return (
                    <li key={`winner-${rankIdx}`}>
                      <div className="winnerTextArea">{rank.rankName}</div>
                      <ul className="winnerUser-list">
                        {rank.winnerList.map((item, idx) => {
                          return (
                              <li className="winnerUser-item" key={`user-${idx}`}>
                                {item.nickName}
                              </li>
                          )
                        })}
                      </ul>
                    </li>
                )
              })}
            </ul>
        ) : (
            <NoResult text="해당 이벤트 당첨자가 없습니다."/>
        )}
      </div>
    </div>
  )
}
