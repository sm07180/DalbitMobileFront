import {Context} from 'context'
import Api from 'context/api'
import {IMG_SERVER} from 'context/config'
import React, {useContext, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import './speacialdj.scss'
import CloseBtn from './static/ic_close.svg'
import speacialOn from './static/ic_success.svg'
import speacialOff from './static/ic_unsuccess.svg'

export default (props) => {
  const history = useHistory()
  const [check, setCheck] = useState('')

  const [liveCast, setliveCast] = useState(0)
  const [likeCast, setlikeCast] = useState(0)
  const [timeCast, settimeCast] = useState(0)
  const [already, setalready] = useState('')
  const globalCtx = useContext(Context)
  const {token} = globalCtx

  async function specialdjCheck() {
    const res = await Api.event_specialdj({})
    const {result, data} = res
    if (result === 'success') {
      setalready(data.already)
    } else {
    }
  }

  useEffect(() => {
    specialdjCheck()
  }, [])

  return (
    <>
      <div className="speacialdj">
        <div className="djTitle">
          <div className="djTitleSub">스페셜 DJ</div>
          <img src={CloseBtn} className="djRefresh" onClick={() => closePopup()} />
        </div>

        <img src={`${IMG_SERVER}/resource/mobile/event/200618/envet_img01.png`} className="img100" />
        <img src={`${IMG_SERVER}/resource/mobile/event/200618/envet_img02.png`} className="img100" />
        <img src={`${IMG_SERVER}/resource/mobile/event/200618/envet_img03.png`} className="img100" />

        {token.isLogin === true ? (
          <>
            <div className="checkList">
              <div className="checkList__box">
                <div className="checkList__title">스페셜 DJ 지원 요건</div>
                <div className="checkList__table">
                  <div className="checkList__list">
                    <div className="checkList__talbeLeft ">
                      누적 방송시간
                      <br />
                      (최소 50시간 방송)
                    </div>
                    {liveCast === 0 ? (
                      <div className={`checkList__talbeRight checkList__talbeRight--red`}>
                        <p>
                          최소 신청 조건이
                          <br />
                          충족하지 않습니다
                        </p>
                        <img src={speacialOff} />
                      </div>
                    ) : (
                      <div className={`checkList__talbeRight checkList__talbeRight--purple`}>
                        <p>
                          스페셜 DJ에
                          <br />
                          도전해보세요!
                        </p>
                        <img src={speacialOn} />
                      </div>
                    )}
                  </div>
                  <div className="checkList__list">
                    <div className="checkList__talbeLeft">
                      받은 좋아요
                      <br />
                      (최소 500개 이상)
                    </div>
                    {likeCast === 0 ? (
                      <div className={`checkList__talbeRight checkList__talbeRight--red`}>
                        <p>
                          최소 신청 조건이
                          <br />
                          충족하지 않습니다
                        </p>
                        <img src={speacialOff} />
                      </div>
                    ) : (
                      <div className={`checkList__talbeRight checkList__talbeRight--purple`}>
                        <p>
                          스페셜 DJ에
                          <br />
                          도전해보세요!
                        </p>
                        <img src={speacialOn} />
                      </div>
                    )}
                  </div>
                  <div className="checkList__list">
                    <div className="checkList__talbeLeft">
                      1시간 이상 방송
                      <br />
                      (최소 20회 이상)
                    </div>
                    {timeCast === 0 ? (
                      <div className={`checkList__talbeRight checkList__talbeRight--red`}>
                        <p>
                          최소 신청 조건이
                          <br />
                          충족하지 않습니다
                        </p>
                        <img src={speacialOff} />
                      </div>
                    ) : (
                      <div className={`checkList__talbeRight checkList__talbeRight--purple`}>
                        <p>
                          스페셜 DJ에
                          <br />
                          도전해보세요!
                        </p>
                        <img src={speacialOn} />
                      </div>
                    )}
                  </div>
                </div>
                {already === 0 ? (
                  <>
                    {liveCast === 1 && likeCast === 1 && timeCast === 1 ? (
                      <button
                        className="button button--on"
                        onClick={() => {
                          history.push('/event_specialdj/write')
                        }}>
                        스페셜DJ 신청서 작성
                      </button>
                    ) : (
                      <button className="button"> 다음에 지원해주세요 </button>
                    )}
                  </>
                ) : (
                  <>
                    <button className="button button--on">이미 지원하셨습니다.</button>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="buttonBox">
              <button
                className="button button--on"
                onClick={() => {
                  history.push('/login')
                }}>
                로그인
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
