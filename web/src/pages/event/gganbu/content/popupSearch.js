import React, {useEffect, useState} from 'react'
import Api from 'context/api'

import './search.scss'
import NoResult from 'components/ui/new_noResult'
import Accept from './accept'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

let btnAccess = false

export default (props) => {
  const {setPopupSearch, gganbuNumber} = props;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const myProfileNo = globalState.profile.memNo
  const myProfileLevel = globalState.profile.level

  const [result, setResult] = useState('')
  const [fanList, setFanList] = useState([])
  const [memberList, setMemberList] = useState([])
  const [memberNumber, setMemberNumber] = useState()
  const [memberNick, setMemberNick] = useState()
  const [ptrNick, setPtrNick] = useState()
  const [searchState, setSearchState] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [alertAccept, setAlertAccept] = useState(false)
  const [acceptType, setAcceptType] = useState('') //acceptance, application

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const closePopup = () => {
    setPopupSearch()
    btnAccess = false
  }

  const closeAlert = () => {
    setAlertAccept(false)
  }

  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'popupSearch') {
      closePopup()
    }
  }

  let totalPage = 1
  let pagePerCnt = 20
  // 깐부 검색
  const fetchGganbuSearch = async () => {
    const param = {
      searchText: result,
      myLevel: myProfileLevel,
      pageNo: totalPage,
      pagePerCnt: pagePerCnt
    }
    const {data, message} = await Api.getGganbuSearch(param)
    if (message === 'SUCCESS') {
      if (currentPage > 1) {
        setMemberList(memberList.concat(data.list))
      } else {
        setMemberList(data.list)
      }
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: message
      }))
    }
  }
  const onChange = (e) => {
    let {
      target: {value}
    } = e
    value = value.replaceAll("'", '').replaceAll('"', '')
    setResult(value)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    btnAccess = true
    if (result.length < 2) {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: `두 글자 이상 입력해 주세요.`,
        callback: () => {
          btnAccess = false
        }
      }))
    } else {
      setSearchState(true)
      fetchGganbuSearch()
      setTimeout(() => {
        btnAccess = false
      }, 1000)
    }
  }
  const searchStateCheck = () => {
    if (searchState) {
      fetchGganbuSearch()
    } else {
      fetchFanList()
    }
  }

  // 깐부 팬 리스트
  const fetchFanList = async () => {
    const param = {
      ptrMemNo: myProfileNo,
      memLevel: myProfileLevel,
      ordSlct: 0,
      pageNo: 1,
      pagePerCnt: 50
    }
    const {data, message} = await Api.getGganbuFanList(param)
    if (message === 'SUCCESS') {
      setFanList(data.list)
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: message
      }))
    }
    return
  }

  // 취소 버튼
  const cancelBtn = (mem_no) => {
    dispatch(setGlobalCtxMessage({
      type: "confirm",
      msg: '정말 신청 취소하시겠습니까?',
      cancelCallback: () => {
        closeAlert()
      },
      callback: () => {
        const ptrMemNo = mem_no
        const goCancelBtn = async () => {
          const param = {
            gganbuNo: gganbuNumber,
            ptrMemNo: ptrMemNo
          }
          const {message} = await Api.postGganbuCancel(param)
          if (message === 'SUCCESS') {
            closeAlert()
            searchStateCheck()
          } else {
            closeAlert()
          }
          return
        }
        goCancelBtn()
      }
    }))
  }

  useEffect(() => {
    fetchFanList()
  }, [])

  const acceptBtn = (memNo, type, memNick, nickName) => {
    setAlertAccept(true)
    setAcceptType(type)
    setMemberNumber(memNo)
    setMemberNick(memNick)
    setPtrNick(nickName)
  }

  return (
    <div id="popupWrap" onClick={wrapClick}>
      <div className="contentWrap">
        <h1 className="title">깐부찾기</h1>
        <div className="searchWrap">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="searchInput"
              value={result}
              onChange={onChange}
              placeholder="깐부를 맺고 싶은 회원을 검색해 보세요."
            />
            <button type="submit" disabled={btnAccess}>
              <img src="https://image.dalbitlive.com/event/gganbu/icoSearch.png" />
            </button>
          </form>
        </div>
        {!searchState ? (
          <>
            <div className="searchTitle">
              나의 팬<span>낮은 레벨 순</span>
            </div>
            <div className="listWrap">
              {fanList.length > 0 ? (
                <>
                  {fanList.map((data, index) => {
                    const {averageLevel, nickName, level, fanMemProfile, mem_no, rcvYn, sendYn} = data
                    return (
                      <div className="list" key={`fan-${index}`}>
                        <div className="photo">
                          <img src={fanMemProfile.thumb292x292} alt="유저이미지" />
                        </div>
                        <div className="listBox">
                          <div className="nick">{nickName}</div>
                          <div className="listItem">
                            <span>Lv. {level}</span>
                            <span className="average">
                              <em>평균</em>
                              <span>Lv {averageLevel}</span>
                            </span>
                          </div>
                        </div>
                        {rcvYn === 'n' ? (
                          <>
                            {sendYn === 'n' ? (
                              <button
                                className="submit"
                                onClick={(e) => acceptBtn(mem_no, 'application', globalState.profile.nickNm)}>
                                신청
                              </button>
                            ) : (
                              <button className="cancel" onClick={(e) => cancelBtn(mem_no)}>
                                취소
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            className="accept"
                            onClick={(e) => acceptBtn(mem_no, 'acceptance', globalState.profile.nickNm, nickName)}>
                            수락
                          </button>
                        )}
                      </div>
                    )
                  })}
                </>
              ) : (
                <NoResult type="default" text="팬이 없습니다." />
              )}
            </div>
          </>
        ) : (
          <div className="listWrap" style={{height: '344px'}}>
            <div className="searchTitle">
              검색결과<p>※ 탈퇴/정지/깐부를 맺은 회원은 검색되지 않습니다.</p>
            </div>
            {memberList.length > 0 ? (
              <>
                {memberList.map((data, index) => {
                  const {average_level, mem_profile, mem_level, mem_nick, mem_no, rcvYn, sendYn} = data
                  return (
                    <div className="list" key={`memder-${index}`}>
                      <div className="photo">
                        <img src={mem_profile.thumb292x292} alt="유저이미지" />
                      </div>
                      <div className="listBox">
                        <div className="nick">{mem_nick}</div>
                        <div className="listItem">
                          <span>Lv. {mem_level}</span>
                          <span className="average">
                            <em>평균</em>
                            <span>Lv {average_level}</span>
                          </span>
                        </div>
                      </div>
                      {rcvYn === 'n' ? (
                        <>
                          {sendYn === 'n' ? (
                            <button
                              className="submit"
                              onClick={(e) => acceptBtn(mem_no, 'application', globalState.profile.nickNm, mem_nick)}>
                              신청
                            </button>
                          ) : (
                            <button className="cancel" onClick={(e) => cancelBtn(mem_no)}>
                              취소
                            </button>
                          )}
                        </>
                      ) : (
                        <button className="accept"
                                onClick={(e) => acceptBtn(mem_no, 'acceptance', globalState.profile.nickNm)}>
                          수락
                        </button>
                      )}
                    </div>
                  )
                })}
              </>
            ) : (
              <>
                <NoResult type="default" text="검색 결과가 없습니다." />
              </>
            )}
          </div>
        )}
        <button className="close" onClick={closePopup}>
          <img src="https://image.dalbitlive.com/event/raffle/popClose.png" alt="닫기" />
        </button>
      </div>
      {alertAccept === true && (
        <Accept
          gganbuNumber={gganbuNumber}
          memberNumber={memberNumber}
          memberNick={memberNick}
          ptrNick={ptrNick}
          acceptType={acceptType}
          closeAlert={closeAlert}
          closePopup={closePopup}
          searchStateCheck={searchStateCheck}
        />
      )}
    </div>
  )
}
