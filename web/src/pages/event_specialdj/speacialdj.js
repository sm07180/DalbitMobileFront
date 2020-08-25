import {Context} from 'context'
import Api from 'context/api'
import qs from 'query-string'

import Layout from 'pages/common/layout'

import React, {useContext, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import './speacialdj.scss'
import CloseBtn from './static/ic_close.svg'
import speacialOn from './static/ic_success.svg'
import speacialOff from './static/ic_unsuccess.svg'
import titleImg from './static/title_img.jpg'
import bottomImg from './static/bottom_img.jpg'

export default (props) => {
  const history = useHistory()
  const [check, setCheck] = useState('')
  const [toggleCheck, setToggleCheck] = useState('')
  const [conditionData, setconditionData] = useState('')
  const [imageData, setImageData] = useState('')

  const [infoData, setInfoData] = useState('')
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const parameter = qs.parse(location.search)
  async function specialdjCheck() {
    const res = await Api.event_specialdj({
      data: {
        select_year: parameter.select_year,
        select_month: parameter.select_month
      }
    })

    const {result, data} = res
    if (result === 'success') {
      setToggleCheck(res.data)

      if (res.data.specialDjCondition !== null) {
        setconditionData(res.data.specialDjCondition) // 로그인해야 보이는부분
      }
      setInfoData(res.data.eventInfo)
      setImageData(res.data.eventInfo.contentList)
    }
  }

  const goBack = () => {
    history.goBack()
  }

  function imgItem() {
    return (
      imageData &&
      imageData.map((item, index) => {
        if (imageData[index].content_type === 'image') {
          return (
            <div key={index}>
              <img src={imageData[index].image_mobile_url} />
            </div>
          )
        } else if (imageData[index].content_type === 'button') {
          return (
            <div className="buttonBg" key={index}>
              <button
                style={{color: `${imageData[index].button_name_color}`, background: `${imageData[index].button_color}`}}
                className="buttonLink"
                onClick={() => {
                  globalCtx.action.updatePopup('TERMS', 'specialdj-goods-detail')
                }}>
                {imageData[index].button_name}
              </button>
            </div>
          )
        }
      })
    )
  }

  let evetStart = String(infoData.req_start_date)
  const evetStartY = evetStart.slice(0, 4)
  const evetStartM = evetStart.slice(4, 6)
  const evetStartD = evetStart.slice(6, 8)

  let endDayNum = String(infoData.condition_end_date)
  const endY = endDayNum.slice(0, 4)
  const endM = endDayNum.slice(5, 7)
  const endD = endDayNum.slice(8, 10)
  const endYNumber = endY + '-' + endM + '-' + endD

  function eventEnd() {
    // let a = new Date("2020-08-29").getTime();
    let startTime = new Date().getTime()
    let endTime = new Date(endYNumber).getTime()
    let minusTime = endTime - startTime
    let reckoning = Math.ceil(minusTime / 3600 / 24 / 1000)

    if (reckoning <= 1) {
      return '금일 24:00 종료'
    } else {
      return `종료 ${reckoning} 일 전`
    }
  }

  useEffect(() => {
    specialdjCheck()
  }, [])

  return (
    <Layout {...props} status="no_gnb">
      <div className="speacialdj">
        <div className="djTitle">
          <div className="djTitleSub">{infoData.title}</div>
          <img src={CloseBtn} className="djRefresh" onClick={goBack} />
        </div>
        <div className="img100">{imgItem()}</div>

        {token.isLogin === true ? (
          <>
            <div className="checkList">
              <div className="img100">
                <img src="https://image.dalbitlive.com/event/specialdj/20200824/title.jpg" />
              </div>
              <b className="dayTitle">
                {`${evetStartY}년 ${evetStartM}월 ${evetStartD}일 ~ ${endM}월 ${endD}일`}
                <br />(<span className="dayTitle--orange">{infoData.condition_end_date && eventEnd()}</span>)
              </b>
            </div>
            <h3 className="img100">
              <img src={titleImg} title="지원 요건" />
            </h3>

            <div className="checkList">
              <div className="checkList__box">
                <div className="checkList__table">
                  <div className="checkList__list">
                    <div className="checkList__talbeLeft ">
                      {conditionData.conditionTitle1}
                      <br />({conditionData.conditionValue1})
                    </div>
                    {conditionData.condition1 !== 1 ? (
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
                      {conditionData.conditionTitle2}
                      <br />({conditionData.conditionValue2})
                    </div>
                    {conditionData.condition2 !== 1 ? (
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
                      {conditionData.conditionTitle3}
                      <br />({conditionData.conditionValue3})
                    </div>
                    {conditionData.condition3 !== 1 ? (
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

                {conditionData.already === 0 ? (
                  <>
                    {conditionData.condition1 === 1 && conditionData.condition2 === 1 && conditionData.condition3 === 1 ? (
                      <button
                        className="button button--on"
                        onClick={() => {
                          history.push(
                            '/event_specialdj/write?select_year=' +
                              parameter.select_year +
                              '&select_month=' +
                              parameter.select_month
                          )
                        }}>
                        스페셜DJ 신청서 작성
                      </button>
                    ) : (
                      <div className="button"> 다음에 지원해주세요 </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="button button--on">이미 지원하셨습니다.</div>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="buttonBox buttonBox--logout">
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
        {token.isLogin === true ? (
          <div className="img100">
            <img src={bottomImg} />
          </div>
        ) : (
          ''
        )}
      </div>
    </Layout>
  )
}
