import {Context} from 'context'
import Api from 'context/api'
import {IMG_SERVER} from 'context/config'
import Layout from 'pages/common/layout'
import React, {useContext, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import './speacialdj.scss'
import CloseBtn from './static/ic_close.svg'
import speacialOn from './static/ic_success.svg'
import speacialOff from './static/ic_unsuccess.svg'
import qs from 'query-string'

export default (props) => {
  const history = useHistory()
  const [check, setCheck] = useState('')
  const [toggleCheck, setToggleCheck] = useState({})

  const [already, setalready] = useState('')
  const globalCtx = useContext(Context)
  const {token} = globalCtx

  const parameter = qs.parse(location.search)

  async function specialdjCheck() {
    const res = await Api.event_specialdj({
      data: {
        select_year: parameter.select_year,
        select_month: parameter.select_month,
      }
    })
    const {result, data} = res
    setToggleCheck(res.data)
    if (result === 'success') {
      setalready(data.already)
    } else {
    }
  }

  const goBack = () => {
    history.goBack()
  }

  useEffect(() => {
    specialdjCheck()
  }, [])

  return (
    <Layout {...props} status="no_gnb">
      <div className="speacialdj">
        <div className="djTitle">
          {toggleCheck.eventInfo !== undefined ? (<div className="djTitleSub">{toggleCheck.eventInfo.title}</div>) : ''}
          <img src={CloseBtn} className="djRefresh" onClick={goBack} />
        </div>

        {toggleCheck.eventInfo !== undefined ? (<img src={toggleCheck.eventInfo.mobile_image_url} className="img100"/>) : ''}
        {/* <img src={`${IMG_SERVER}/resource/mobile/event/200618/envet_img02.png`} className="img100" />
        <img src={`${IMG_SERVER}/resource/mobile/event/200623/envet_img03.png`} className="img100" />*/}


        <div className="buttonBox--goods">
          <button
              className="button button--goods"
              onClick={() => {
                //globalCtx.action.updatePopup('TERMS', 'rising-event-gift-detail')
                globalCtx.action.updatePopup('TERMS', 'specialdj-goods-detail')
              }}>
            굿즈 상품 미리보기
          </button>
        </div>

        {token.isLogin === true ? (
          <>
            <div className="checkList">
              <div className="checkList__box">
                <div className="checkList__title">스페셜 DJ 지원 요건</div>
                <div className="checkList__table">
                  <div className="checkList__list">
                    {toggleCheck.specialDjCondition !== undefined ? <div className="checkList__talbeLeft ">
                      {toggleCheck.specialDjCondition.conditionTitle1}
                      <br />
                      ({toggleCheck.specialDjCondition.conditionValue1})
                    </div>
                      : ''
                    }
                    {toggleCheck.specialDjCondition !== undefined && toggleCheck.specialDjCondition.condition1 !== 1 ? (
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
                    {toggleCheck.specialDjCondition !== undefined ? <div className="checkList__talbeLeft">
                      {toggleCheck.specialDjCondition.conditionTitle2}
                      <br />
                      ({toggleCheck.specialDjCondition.conditionValue2})
                    </div>: ''
                    }
                    {toggleCheck.specialDjCondition !== undefined && toggleCheck.specialDjCondition.condition2 !== 1 ? (
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
                    {toggleCheck.specialDjCondition !== undefined ? <div className="checkList__talbeLeft">
                      {toggleCheck.specialDjCondition.conditionTitle3}
                      <br />
                      ({toggleCheck.specialDjCondition.conditionValue3})
                    </div> : ''
                    }
                    {toggleCheck.specialDjCondition !== undefined && toggleCheck.specialDjCondition.condition3 !== 1 ? (
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
                {toggleCheck.specialDjCondition === undefined ?
                    <button className="button"> 다음에 지원해주세요 </button>
                    : toggleCheck.specialDjCondition.already === 0 ? (
                  <>
                    {toggleCheck.specialDjCondition.condition1 === 1
                        && toggleCheck.specialDjCondition.condition2 === 1
                        && toggleCheck.specialDjCondition.condition3 === 1
                        && toggleCheck.specialDjCondition.timeState === 1 ? (
                      <button
                        className="button button--on"
                        onClick={() => {
                          history.push('/event_specialdj/write?select_year=' + parameter.select_year + '&select_month=' + parameter.select_month);
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
                  history.push({
                    pathname: '/login',
                    state: {
                      state: 'event_specialdj?select_year=' + parameter.select_year + '&select_month=' + parameter.select_month
                    }
                  })
                }}>
                로그인
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
