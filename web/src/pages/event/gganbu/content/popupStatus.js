import React, {useState, useEffect, useCallback} from 'react'
import Api from 'context/api'
import NoResult from 'components/ui/new_noResult'

import './search.scss'

export default (props) => {
  const {setPopupStatus} = props

  const [tabBtn, setTabBtn] = useState('r')
  const [gganbuSubList, setGganbuSubList] = useState([])
  const [popAgreement, setPopAgreement] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const closePopup = () => {
    setPopupStatus()
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
      insSlct: application,
      gganbuNo: 1,
      pageNo: 1,
      pagePerCnt: 50
    }
    const {result, data, message} = await Api.getGganbu(param)
    if (result === 'success') {
      setGganbuSubList(data.list)
    } else {
      console.log(message)
    }
  }

  useEffect(() => {
    fetchGganbuSubList()
  }, [application])

  // 수락 => 동의서, 수락
  const accept = () => {
    return (
      <div className="alert">
        <div className="contentWrap">
          <h1 className="title">깐부찾기</h1>
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
            <div className="listWrap" style={{display: 'none'}}>
              <div className="list">
                <div className="photo">
                  <img src="" alt="유저이미지" />
                </div>
                <div className="listBox">
                  <div className="nick">finish</div>
                  <div className="listItem">
                    <span>Lv. 38</span>
                    <span className="average">
                      <em>평균</em>
                      <span>Lv 20</span>
                    </span>
                  </div>
                </div>
                <button className="accept">수락</button>
              </div>
            </div>
            <div className="listNone">
              <NoResult type="default" text="신청한 회원이 없습니다." />
            </div>
          </>
        ) : (
          <div className="listWrap" style={{height: '334px'}}>
            <div className="list">
              <div className="photo">
                <img src="" alt="유저이미지" />
              </div>
              <div className="listBox">
                <div className="nick">finish</div>
                <div className="listItem">
                  <span>Lv. 38</span>
                  <span className="average">
                    <em>평균</em>
                    <span>Lv 20</span>
                  </span>
                </div>
              </div>
              <button className="cancel">취소</button>
            </div>
          </div>
        )}
        <button className="close" onClick={closePopup}>
          <img src="https://image.dalbitlive.com/event/raffle/popClose.png" alt="닫기" />
        </button>
      </div>
    </div>
  )
}
