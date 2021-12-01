import React, {useState, useEffect} from 'react'

import './search.scss'

export default (props) => {
  const {setPopupStatus} = props

  const [tabBtn, setTabBtn] = useState(0)
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
          <button className={tabBtn === 0 ? 'active' : ''} onClick={() => setTabBtn(0)}>
            받은 신청
          </button>
          <button className={tabBtn === 1 ? 'active' : ''} onClick={() => setTabBtn(1)}>
            나의 신청
          </button>
        </div>
        {tabBtn === 0 ? (
          <>
            <div className="searchTitle">
              나의 팬<span>낮은 레벨 순</span>
            </div>
            <div className="listWrap">
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
                <button className="submit">신청</button>
              </div>
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
                <button className="disable" disabled>
                  신청불가
                </button>
              </div>
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
                <button className="disable" disabled>
                  신청불가
                </button>
              </div>
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
                <button className="disable" disabled>
                  신청불가
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="listWrap" style={{height: '339px'}}>
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
              <button className="submit">신청</button>
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
