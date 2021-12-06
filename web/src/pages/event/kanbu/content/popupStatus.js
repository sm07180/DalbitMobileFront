import React, {useState, useEffect, useCallback} from 'react'
import Api from 'context/api'
import NoResult from 'components/ui/new_noResult'

import './search.scss'

export default (props) => {
  const {setPopupStatus, gganbuNo} = props

  const [tabBtn, setTabBtn] = useState('r')
  const [gganbuSubList, setGganbuSubList] = useState([])
  const [memberNo, setMemberNo] = useState()
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
    // setAlertFail(false)
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
      gganbuNo: gganbuNo,
      pageNo: 1,
      pagePerCnt: 50
    }
    const {data, message} = await Api.postGganbuList(param)
    if (message === 'SUCCESS') {
      setGganbuSubList(data.list)
    } else {
      console.log(message)
    }
  }

  const postGganbuIns = async (memNo) => {
    const param = {
      gganbuNo: gganbuNo,
      memNo: memNo
    }
    const {data, message} = await Api.postGganbuIns(param)
    if (data === 1) {
      console.log(message)
    } else {
      console.log(message)
    }
  }

  useEffect(() => {
    fetchGganbuSubList()
  }, [application])

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
            <button onClick={() => postGganbuIns(memberNo)}>신청</button>
          </div>
        </div>
      </div>
    )
  }
  const success = () => {
    return (
      <div className="alert">
        <div className="contentWrap">
          님과
          <br />
          깐부를 맺었습니다.
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
            <div className="listWrap">
              {gganbuSubList.length > 0 &&
                gganbuSubList.map((data, index) => {
                  const {average_level, gganbu_no, image_profile, mem_level, mem_nick, mem_no} = data
                  return (
                    <div className="list" key={`myGganbu-${index}`}>
                      <div className="photo">
                        <img src={image_profile} alt="유저이미지" />
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
                      <button className="accept" onClick={() => acceptBtn(mem_no)}>
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
          <div className="listWrap" style={{height: '335px'}}>
            {gganbuSubList.length > 0 &&
              gganbuSubList.map((data, index) => {
                const {average_level, gganbu_no, image_profile, mem_level, mem_nick} = data
                return (
                  <div className="list" key={index}>
                    <div className="photo">
                      <img src={image_profile} alt="유저이미지" />
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
                    <button className="cancel">취소</button>
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
      {/* {alertFail === true && <Fail />} */}
    </div>
  )
}
