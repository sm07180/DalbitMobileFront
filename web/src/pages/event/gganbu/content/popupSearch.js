import React, {useState, useContext, useEffect} from 'react'
import {Context} from 'context/index.js'
import Api from 'context/api'

import './search.scss'
import NoResult from 'components/ui/new_noResult'

let btnAccess = false

export default (props) => {
  const {setPopupSearch, gganbuNo} = props
  const context = useContext(Context)
  const myProfileNo = context.profile.memNo

  const [result, setResult] = useState('')
  const [fanList, setFanList] = useState([])
  const [memberList, setMemberList] = useState([])
  const [memberNo, setMemberNo] = useState()
  const [alertAccept, setAlertAccept] = useState(false)
  const [alertFail, setAlertFailt] = useState(false)

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
    setAlertFail(false)
  }
  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'popupSearch') {
      closePopup()
    }
  }

  // 회원 검색
  const fetchSearchMember = async () => {
    const res = await Api.member_search({
      params: {
        search: result,
        page: 1,
        records: 20
      }
    })
    if (res.result === 'success') {
      setMemberList(res.data.list)
    } else {
      context.action.alert({
        msg: res.message
      })
    }
  }
  const holeSearch = () => {
    fetchSearchMember()
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
      holeSearch()
      // setTimeout(() => {
      //   btnAccess = false
      // }, 1000)
    }
  }

  // 팬 리스트
  const fetchFanList = async () => {
    const res = await Api.mypage_fan_list({
      params: {
        memNo: myProfileNo,
        sortType: 0
      }
    })
    if (res.result === 'success') {
      setFanList(res.data.list)
    } else {
      context.action.alert({
        callback: () => {},
        msg: res.message
      })
    }
    return
  }

  const postGganbuSub = async (memNo) => {
    const param = {
      gganbuNo: gganbuNo,
      ptrMemNo: memNo
    }
    const {data, message} = await Api.postGganbuSub(param)
    if (data === 1) {
      closeAlert()
    } else {
      context.action.alert({
        msg: message
      })
    }
  }

  useEffect(() => {
    fetchFanList()
  }, [])

  // 수락 => 동의서, 실패
  const Accept = () => {
    return (
      <div className="alert">
        <div className="contentWrap">
          <h1 className="title">동의서</h1>
          <div className="textWrap">
            <h2>제 1 항</h2>
            <p>
              깐부는 최대 두 명에게 신청
              <br />
              가능하며 신청 후에 취소할 수 있습니다.
            </p>
            <h2>제 2 항</h2>
            <p>
              상대가 수락 시 이번 회차에서 맺은 깐부는
              <br />
              중도 해체할 수 없습니다.
            </p>
            <h2>제 3 항</h2>
            <p>
              평균 레벨이 낮을수록 구슬 주머니에서
              <br />
              좋은 점수를 얻을 수 있습니다.
            </p>
            <p>
              <strong>정말 신청하시겠습니까?</strong>
            </p>
          </div>
          <div className="buttonWrap">
            <button onClick={closeAlert}>취소</button>
            <button onClick={() => postGganbuSub(memberNo)}>신청</button>
          </div>
        </div>
      </div>
    )
  }
  const Fail = () => {
    return (
      <div className="popWrap">
        <div className="contentWrap">
          깐부는 최대 2명에게 신청 가능합니다.
          <br />
          신청 취소 후 다시 접근해주세요.
          <button></button>
        </div>
      </div>
    )
  }
  const acceptBtn = (memNo) => {
    setAlertAccept(true)
    setMemberNo(memNo)
    return <Accept />
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
        {btnAccess === false ? (
          <>
            <div className="searchTitle">
              나의 팬<span>낮은 레벨 순</span>
            </div>
            <div className="listWrap">
              {fanList.length > 0 &&
                fanList.map((data, index) => {
                  const {nickNm, profImg, memNo} = data
                  return (
                    <div className="list" key={`fan-${index}`}>
                      <div className="photo">
                        <img src={profImg.thumb50x50} alt="유저이미지" />
                      </div>
                      <div className="listBox">
                        <div className="nick">{nickNm}</div>
                        <div className="listItem">
                          <span>Lv. 38</span>
                          <span className="average">
                            <em>평균</em>
                            <span>Lv 20</span>
                          </span>
                        </div>
                      </div>
                      <button className="submit" onClick={(e) => acceptBtn(memNo)}>
                        신청
                      </button>
                    </div>
                  )
                })}
              {fanList.length === 0 && <NoResult type="default" text="팬이 없습니다." />}
            </div>
          </>
        ) : (
          <div className="listWrap" style={{height: '339px'}}>
            {memberList.map((data, index) => {
              const {nickNm, profImg, memNo} = data
              return (
                <div className="list" key={`memder-${index}`}>
                  <div className="photo">
                    <img src={profImg.thumb50x50} alt="유저이미지" />
                  </div>
                  <div className="listBox">
                    <div className="nick">{nickNm}</div>
                    <div className="listItem">
                      <span>Lv. 38</span>
                      <span className="average">
                        <em>평균</em>
                        <span>Lv 20</span>
                      </span>
                    </div>
                  </div>
                  <button className="submit" onClick={(e) => acceptBtn(memNo)}>
                    신청
                  </button>
                  {/* <button className="cancel">취소</button>
                  <button className="accept">수락</button>
                  <button className="disable" disabled>
                    신청불가
                  </button> */}
                </div>
              )
            })}
          </div>
        )}
        <button className="close" onClick={closePopup}>
          <img src="https://image.dalbitlive.com/event/raffle/popClose.png" alt="닫기" />
        </button>
      </div>
      {alertAccept === true && <Accept />}
      {alertFail === true && <Fail />}
    </div>
  )
}
