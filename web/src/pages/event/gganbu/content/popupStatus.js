import React, {useState, useEffect, useContext, useCallback} from 'react'
import {Context} from 'context/index.js'
import Api from 'context/api'
import NoResult from 'components/ui/new_noResult'
import Accept from './accept'

import './search.scss'

export default (props) => {
  const {setPopupStatus, gganbuNumber} = props
  const context = useContext(Context)

  const [tabBtn, setTabBtn] = useState('r')
  const [memberNumber, setMemberNumber] = useState()
  const [memberNick, setMemberNick] = useState()
  const [ptrNick, setPtrNick] = useState()
  const [gganbuSubList, setGganbuSubList] = useState([])
  const [alertAccept, setAlertAccept] = useState(false)
  const [acceptType, setAcceptType] = useState('') //acceptance, application

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

  const fetchGganbuSubList = async () => {
    const param = {
      insSlct: tabBtn,
      gganbuNo: gganbuNumber
    }
    const {data, message} = await Api.postGganbuList(param)
    if (message === 'SUCCESS') {
      setGganbuSubList(data.list)
    } else {
      console.log(message)
    }
  }

  // 취소 버튼
  const cancelBtn = (ptr_mem_no) => {
    context.action.confirm({
      msg: '정말 신청 취소하시겠습니까?',
      callback: () => {
        const ptrMemNo = ptr_mem_no
        const goCancelBtn = async () => {
          const param = {
            gganbuNo: gganbuNumber,
            ptrMemNo: ptrMemNo
          }
          const {message} = await Api.postGganbuCancel(param)
          if (message === 'SUCCESS') {
            closeAlert()
            fetchGganbuSubList()
          } else {
            closeAlert()
          }
        }
        goCancelBtn()
      }
    })
  }

  useEffect(() => {
    fetchGganbuSubList()
  }, [tabBtn])

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
              {gganbuSubList.length > 0 ? (
                <>
                  {gganbuSubList.map((data, index) => {
                    const {average_level, mem_profile, mem_level, mem_nick, mem_no} = data
                    return (
                      <div className="list" key={`rGganbu-${index}`}>
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
                        <button
                          className="accept"
                          onClick={(e) => acceptBtn(mem_no, 'acceptance', context.profile.nickNm, mem_nick)}>
                          수락
                        </button>
                      </div>
                    )
                  })}
                </>
              ) : (
                <NoResult type="default" text="신청한 회원이 없습니다." />
              )}
            </div>
          </>
        ) : (
          <div className="listWrap" style={{height: '364px'}}>
            {gganbuSubList.length > 0 &&
              gganbuSubList.map((data, index) => {
                const {average_level, mem_no, ptr_mem_profile, ptr_mem_level, ptr_mem_nick, ptr_mem_no} = data
                return (
                  <div className="list" key={`mGganbu-${index}`}>
                    <div className="photo">
                      <img src={ptr_mem_profile.thumb292x292} alt="유저이미지" />
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
                    <button className="cancel" onClick={(e) => cancelBtn(ptr_mem_no)}>
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
      {alertAccept === true && (
        <Accept
          gganbuNumber={gganbuNumber}
          memberNumber={memberNumber}
          memberNick={memberNick}
          ptrNick={ptrNick}
          acceptType={acceptType}
          closeAlert={closeAlert}
          closePopup={closePopup}
        />
      )}
    </div>
  )
}
