import React, {useState, useEffect, useContext, useCallback} from 'react'
import {Context} from 'context/index.js'
import Api from 'context/api'
import NoResult from 'components/ui/new_noResult'

import './search.scss'

export default (props) => {
  const {setPopupStatus, gganbuNo} = props
  const context = useContext(Context)

  const [tabBtn, setTabBtn] = useState('r')
  const [memberNo, setMemberNo] = useState()
  const [gganbuSubList, setGganbuSubList] = useState([])
  const [alertAccept, setAlertAccept] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const closePopup = () => {
    setPopupStatus()
  }
  const closeAlert = () => {
    setAlertAccept(false)
  }
  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'popupWrap') {
      closePopup()
    }
  }

  const application = tabBtn
  const fetchGganbuSubList = async () => {
    const param = {
      insSlct: tabBtn,
      gganbuNo: gganbuNo
    }
    const {data, message} = await Api.postGganbuList(param)
    if (message === 'SUCCESS') {
      setGganbuSubList(data.list)
    } else {
      console.log(message)
    }
  }
  // 수락 버튼
  const postGganbuIns = async (memNo, memNick) => {
    const param = {
      gganbuNo: gganbuNo,
      memNo: memNo
    }
    const {data, message} = await Api.postGganbuIns(param)
    if (data === 1) {
      context.action.alert({
        msg: `${memNick}님과<br/>깐부를 맺었습니다.`,
        callback: () => {
          closeAlert()
        }
      })
    } else {
      console.log(message)
    }
  }
  // 취소 버튼
  const postGganbuCancel = async (ptr_mem_no) => {
    const param = {
      gganbuNo: gganbuNo,
      ptrMemNo: ptr_mem_no
    }
    const {data, message} = await Api.postGganbuCancel(param)
    if (message === 'SUCCESS') {
      console.log(message)
      context.action.alert({
        msg: '취소 완료',
        callback: () => {
          closeAlert()
          fetchGganbuSubList()
        }
      })
    } else {
      context.action.alert({
        msg: message
      })
    }
  }

  useEffect(() => {
    fetchGganbuSubList()
  }, [application])

  // 수락 => 동의서, 실패
  const Accept = (props) => {
    const {mem_nick} = props
    return (
      <div className="alert">
        <div className="contentWrap">
          <h1 className="title">동의서</h1>
          <div className="textWrap">
            <h2>제 1 항</h2>
            <p>
              이번 회차에서 맺은 깐부는
              <br />
              중도 해체할 수 없습니다.
            </p>
            <h2>제 2 항</h2>
            <p>
              평균 레벨이 낮을수록 구슬 주머니에서
              <br />
              좋은 점수를 얻을 수 있습니다.
            </p>
            <p>
              <strong>정말 깐부를 맺으시겠습니까?</strong>
            </p>
          </div>
          <div className="buttonWrap">
            <button onClick={closeAlert}>취소</button>
            <button onClick={() => postGganbuIns(memberNo, mem_nick)}>수락</button>
          </div>
        </div>
      </div>
    )
  }
  const acceptBtn = (memNo, mem_nick) => {
    setAlertAccept(true)
    setMemberNo(memNo)
    return <Accept mem_nick={mem_nick} />
  }

  return (
    <div id="popupWrap" onClick={wrapClick}>
      <div className="contentWrap">
        <h1 className="title">깐부 신청 현황</h1>
        <div className="tabBtnWrap">
          <button className={tabBtn === 'r' ? 'active' : ''} onClick={() => setTabBtn('r')}>
            받은 신청
          </button>
          <button className={tabBtn === 'm' ? 'active' : ''} onClick={() => setTabBtn('m')}>
            나의 신청
          </button>
        </div>
        {tabBtn === 'r' ? (
          <>
            <div className="searchTitle status">※ 이미 깐부를 맺은 회원은 리스트에서 삭제됩니다.</div>
            <div className="listWrap" style={{height: '329px'}}>
              {gganbuSubList.length > 0 &&
                gganbuSubList.map((data, index) => {
                  const {average_level, mem_profile, mem_level, mem_nick, mem_no} = data
                  return (
                    <div className="list" key={`myGganbu-${index}`}>
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
                      <button className="accept" onClick={() => acceptBtn(mem_no, mem_nick)}>
                        수락
                      </button>
                    </div>
                  )
                })}
              {gganbuSubList.length === 0 && (
                <div className="listNone">
                  <NoResult type="default" text="신청한 회원이 없습니다." />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="listWrap" style={{height: '364px'}}>
            {gganbuSubList.length > 0 &&
              gganbuSubList.map((data, index) => {
                const {average_level, mem_no, ptr_mem_profile, ptr_mem_level, ptr_mem_nick, ptr_mem_no} = data
                return (
                  <div className="list" key={index}>
                    <div className="photo">
                      <img src={ptr_mem_profile.thumb50x50} alt="유저이미지" />
                    </div>
                    <div className="listBox">
                      <div className="nick">{ptr_mem_nick}</div>
                      <div className="listItem">
                        <span>Lv. {ptr_mem_level}</span>
                        <span className="average">
                          <em>평균</em>
                          <span>Lv {average_level}</span>
                        </span>
                      </div>
                    </div>
                    <button className="cancel" onClick={(e) => postGganbuCancel(ptr_mem_no)}>
                      취소
                    </button>
                  </div>
                )
              })}
            {gganbuSubList.length === 0 && (
              <div className="listNone">
                <NoResult type="default" text="신청한 회원이 없습니다." />
              </div>
            )}
          </div>
        )}
        <button className="close" onClick={closePopup}>
          <img src="https://image.dalbitlive.com/event/raffle/popClose.png" alt="닫기" />
        </button>
      </div>
      {alertAccept === true && <Accept />}
    </div>
  )
}
