import React, {useContext, useEffect, useState} from 'react'

import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import qs from 'query-string'

import speacialOn from './static/ic_success.svg'
import speacialOff from './static/ic_unsuccess.svg'
import './specialdj.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";

export default () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory()

  const parameter = qs.parse(location.search)
  const [conditionData, setconditionData] = useState('')
  const [imageData, setImageData] = useState('')
  const [infoData, setInfoData] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const goBack = () => {
    history.goBack()
  }

  const eventCheck = () => {
    let today = new Date()
    let eventYear = today.getFullYear()
    // let eventMonth = today.getMonth() + 1
    let eventMonth = today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;

    if (parameter.select_year + parameter.select_month !== eventYear.toString() + eventMonth.toString()) {
      dispatch(setGlobalCtxMessage({type:"alert_no_close",
        msg: `이벤트 기간이 아닙니다.`,
        callback: () => {
          goBack()
        }
      }))
    }
  }
  async function specialdjCheck() {
    const res = await Api.event_specialdj({
      data: {
        select_year: parameter.select_year,
        select_month: parameter.select_month
      }
    })

    const {result, data, message} = res
    if (result === 'success') {
      if (res.data.specialDjCondition !== undefined) {
        setconditionData(data.specialDjCondition) // 로그인해야 보이는부분
      }
      setInfoData(data.eventInfo)
      setImageData(data.eventInfo.contentList)
    } else {
      dispatch(setGlobalCtxMessage({type:"alert_no_close",
        msg: `이벤트 기간이 아닙니다.`,
        callback: () => {
          goBack()
        }
      }))
    }
  }

  function eventEnd() {
    // let a = new Date("2020-08-29").getTime();
    if (endDate !== null) {
      let startTime = new Date().getTime()
      let endTime = new Date(endDate).getTime()
      let minusTime = endTime - startTime
      let reckoning = Math.ceil(minusTime / 3600 / 24 / 1000)

      if (reckoning < 1) {
        return '금일 23:59:59 종료'
      } else {
        return `종료 ${reckoning} 일 전`
      }
    }

    return ''
  }

  function imgItem() {
    return (
      imageData &&
      imageData.map((item, index) => {
        if (imageData[index].content_type === 'image') {
          return <img src={imageData[index].image_mobile_url} key={index} alt={`이미지 컨텐츠 ${index}`} />
        } else if (imageData[index].content_type === 'button') {
          //           return (
          //             <button
          //               key={index}
          //               style={{color: `${imageData[index].button_name_color}`, background: `${imageData[index].button_color}`}}
          //               className="buttonLink"
          // >
          //               {imageData[index].button_name}
          //             </button>
          //           )
        }
      })
    )
  }

  useEffect(() => {
    if (infoData !== '') {
      const endDayNum = String(infoData.req_end_date)
      const endY = endDayNum.slice(0, 4)
      const endM = endDayNum.slice(4, 6)
      const endD = endDayNum.slice(6, 8)
      const endYNumber = endY + '-' + endM + '-' + endD
      setEndDate(endYNumber)

      const startDay = infoData.req_start_date
      const startY = startDay.slice(0, 4)
      const startM = startDay.slice(4, 6)
      const startD = startDay.slice(6, 8)

      setStartDate(startY + '년 ' + startM + '월 ' + startD + '일')
    }
  }, [infoData])

  useEffect(() => {
    eventCheck()
    specialdjCheck()
  }, [globalState.token.isLogin])

  useEffect(() => {
    console.log('rendering')
  }, [])

  return (
    <>
      <div className="specialdj">
        <div className="title">
          <h2>{infoData.title}</h2>
          <button onClick={goBack}>닫기 버튼</button>
        </div>
        <div className="contentImg">
          <button
            className="startingPopup"
            onClick={() => {
              dispatch(setGlobalCtxUpdatePopup({popup:['SPECIAL_DJ_STARTING']}));
            }}>
            <img src="https://image.dalbitlive.com/event/specialdj/20201223/selection_button.png" alt="선발 방식" />
          </button>

          <button
            className="goodsPopup"
            onClick={() => {
              dispatch(setGlobalCtxUpdatePopup({popup:['SPECIAL_DJ_GOODS_DETAIL']}));
            }}>
            <img src="https://image.dalbitlive.com/event/specialdj/20201223/goobs_button.png" alt="굿즈 더보기" />
          </button>
          {imgItem()}
        </div>

        {globalState.token.isLogin === true ? (
          <>
            <img src="https://image.dalbitlive.com/event/specialdj/20201223/top_img.jpg" alt="선발 방식" className="imgResize" />
            <div className="dayTitle">
              {infoData !== '' && endDate !== null && `${startDate} ~ ${endDate.split('-')[1]}월 ${endDate.split('-')[2]}일`}
              {/* {`${eventStartY}년 ${eventStartM}월 ${eventStartD}일 ~ ${endM}월 ${endD}일`}  */}
              <br />(<p>{infoData.condition_end_date && eventEnd()}</p>)
            </div>
            <img src="https://image.dalbitlive.com/event/specialdj/20201223/title.jpg" alt="지원 요건" className="imgResize" />

            <div className="checkList">
              <div className="checkList__table">
                <div className="checkList__list">
                  <div className="checkList__talbeLeft">
                    {conditionData.conditionTitle2}
                    <br />({conditionData.conditionValue2})
                  </div>
                  {conditionData.condition2 !== 1 ? (
                    <div className="checkList__talbeRight checkList__talbeRight--red">
                      <p>
                        최소 신청 조건이
                        <br />
                        충족하지 않습니다
                      </p>
                      <img src={speacialOff} alt="실패" />
                    </div>
                  ) : (
                    <div className="checkList__talbeRight checkList__talbeRight--purple">
                      <p>
                        스페셜 DJ에
                        <br />
                        도전해보세요!
                      </p>
                      <img src={speacialOn} alt="도전" />
                    </div>
                  )}
                </div>
                <div className="checkList__list">
                  <div className="checkList__talbeLeft">
                    {conditionData.conditionTitle1}
                    <br />({conditionData.conditionValue1})
                    <br />
                    ※부스터 좋아요 포함
                  </div>
                  {conditionData.condition1 !== 1 ? (
                    <div className="checkList__talbeRight checkList__talbeRight--red">
                      <p>
                        최소 신청 조건이
                        <br />
                        충족하지 않습니다
                      </p>
                      <img src={speacialOff} alt="실패" />
                    </div>
                  ) : (
                    <div className="checkList__talbeRight checkList__talbeRight--purple">
                      <p>
                        스페셜 DJ에
                        <br />
                        도전해보세요!
                      </p>
                      <img src={speacialOn} alt="도전" />
                    </div>
                  )}
                </div>
                <div className="checkList__list">
                  <div className="checkList__talbeLeft">
                    {conditionData.conditionTitle3}
                    <br />({conditionData.conditionValue3})
                  </div>
                  {conditionData.condition3 !== 1 ? (
                    <div className="checkList__talbeRight checkList__talbeRight--red">
                      <p>
                        최소 신청 조건이
                        <br />
                        충족하지 않습니다
                      </p>
                      <img src={speacialOff} alt="실패" />
                    </div>
                  ) : (
                    <div className="checkList__talbeRight checkList__talbeRight--purple">
                      <p>
                        스페셜 DJ에
                        <br />
                        도전해보세요!
                      </p>
                      <img src={speacialOn} alt="도전" />
                    </div>
                  )}
                </div>
              </div>
              {conditionData.already === 0 ? (
                <>
                  {conditionData.condition1 === 1 && conditionData.condition2 === 1 && conditionData.condition3 === 1 ? (
                    <button
                      className="buttonOn buttonOn--purple"
                      onClick={() => {
                        history.push(
                          '/event/specialdj/write?select_year=' +
                            parameter.select_year +
                            '&select_month=' +
                            parameter.select_month
                        )
                      }}>
                      <img
                        src="https://image.dalbitlive.com/event/specialdj/20201223/write_button.png"
                        className="imgResize"
                        alt="스페셜 Dj 신청서 작성"
                      />
                      {/* 스페셜DJ 신청서 작성 */}
                    </button>
                  ) : (
                    <div className="buttonOff">
                      <img
                        src="https://image.dalbitlive.com/event/specialdj/20201223/next_button.png"
                        className="imgResize "
                        alt="다음에 지원해주세요"
                      />
                      {/* 다음에 지원해주세요 */}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="buttonOn">
                    <img
                      src="https://image.dalbitlive.com/event/specialdj/20201223/clear_button.png"
                      className="imgResize"
                      alt="이미 지원하셨습니다."
                    />
                    {/* 이미 지원하셨습니다. */}
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="loginBox">
              <button
                className="buttonOn"
                onClick={() => {
                  history.push({
                    pathname: '/login',
                    state: {
                      state: 'event/specialdj?select_year=' + parameter.select_year + '&select_month=' + parameter.select_month
                    }
                  })
                }}>
                <img
                  src="https://image.dalbitlive.com/event/specialdj/20201223/login_button.png"
                  className="imgResize"
                  alt="로그인 버튼"
                />
                {/* 로그인 */}
              </button>
            </div>
          </>
        )}
        {globalState.token.isLogin === true ? (
          <img
            src="https://image.dalbitlive.com/event/specialdj/20201223/new_bottom_img.jpg"
            className="imgResize"
            alt="하단 배경 이미지"
          />
        ) : (
          <></>
        )}
      </div>
    </>
  )
}
