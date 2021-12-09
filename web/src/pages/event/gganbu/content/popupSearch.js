import React, {useState, useContext, useEffect, useLayoutEffect, useCallback} from 'react'
import {Context} from 'context/index.js'
import Api from 'context/api'
import Utility from 'components/lib/utility'

import './search.scss'
import NoResult from 'components/ui/new_noResult'

let btnAccess = false

export default (props) => {
  const {setPopupSearch, gganbuNo} = props
  const context = useContext(Context)
  const myProfileNo = context.profile.memNo
  const myProfileLevel = context.profile.level

  const [result, setResult] = useState('')
  const [fanList, setFanList] = useState([])
  const [memberList, setMemberList] = useState([])
  const [memberNo, setMemberNo] = useState()
  const [searchState, setSearchState] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [alertAccept, setAlertAccept] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  let totalPage = 1
  let records = 20

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
  // 깐부 검색
  const fetchGganbuSearch = async () => {
    const param = {
      searchText: result,
      myLevel: myProfileLevel,
      pageNo: totalPage,
      pagePerCnt: records
    }
    const {data, message} = await Api.getGganbuSearch(param)
    if (message === 'SUCCESS') {
      if (currentPage > 1) {
        setMemberList(memberList.concat(data.list))
      } else {
        setMemberList(data.list)
      }
    } else {
      context.action.alert({
        msg: message
      })
    }
  }
  const onChange = (e) => {
    setResult(e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    btnAccess = true
    if (result.length < 2) {
      context.action.alert({
        msg: `두 글자 이상 입력해 주세요.`,
        callback: () => {
          btnAccess = false
        }
      })
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
      context.action.alert({
        msg: message
      })
    }
    return
  }

  // 취소 버튼
  const postGganbuCancel = async (ptr_mem_no) => {
    const param = {
      gganbuNo: gganbuNo,
      ptrMemNo: ptr_mem_no
    }
    const {message} = await Api.postGganbuCancel(param)
    if (message === 'SUCCESS') {
      context.action.alert({
        msg: '취소 완료',
        callback: () => {
          closeAlert()
          searchStateCheck()
        }
      })
    } else {
      context.action.alert({
        msg: message
      })
    }
  }

  useEffect(() => {
    if (result === '') {
      fetchFanList()
      setSearchState(false)
    }
  }, [result])

  const acceptBtn = (mem_no) => {
    setMemberNo(mem_no)
    return <Accept memberNo={memberNo} />
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
                          <img src={fanMemProfile.thumb50x50} alt="유저이미지" />
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
                              <button className="submit" onClick={(e) => acceptBtn(mem_no)}>
                                신청
                              </button>
                            ) : (
                              <button className="cancel" onClick={(e) => postGganbuCancel(mem_no)}>
                                취소
                              </button>
                            )}
                          </>
                        ) : (
                          <button className="accept">수락</button>
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
            {memberList.map((data, index) => {
              const {average_level, mem_profile, mem_level, mem_nick, mem_no, rcvYn, sendYn} = data
              return (
                <div className="list" key={`memder-${index}`}>
                  <div className="photo">
                    <img src={mem_profile.thumb50x50} alt="유저이미지" />
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
                        <button className="submit" onClick={(e) => acceptBtn(mem_no)}>
                          신청
                        </button>
                      ) : (
                        <button className="cancel" onClick={(e) => postGganbuCancel(mem_no)}>
                          취소
                        </button>
                      )}
                    </>
                  ) : (
                    <button className="accept">수락</button>
                  )}
                </div>
              )
            })}
          </div>
        )}
        <button className="close" onClick={closePopup}>
          <img src="https://image.dalbitlive.com/event/raffle/popClose.png" alt="닫기" />
        </button>
      </div>
    </div>
  )
}
