import React, {useContext, useEffect, useState} from 'react'

import {IMG_SERVER} from 'context/config'

export default ({infoData, conditionData, bestData, setSendPop}) => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [activeState, setActiveState] = useState(false)

  function eventEnd() {
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

  const conditionCheck = () => {
    const {conditionList} = conditionData
    let active = false
    active = conditionList.every((v) => {
      return v.condition === 1
    })

    if (active) {
      setActiveState(true)
    }
  }

  useEffect(() => {
    if (conditionData.hasOwnProperty('conditionList')) conditionCheck()
  }, [conditionData])

  //---------------------
  useEffect(() => {
    if (infoData !== '') {
      const endDayNum = String(infoData.req_end_date)
      const endY = endDayNum.slice(0, 4)
      const endM = endDayNum.slice(4, 6)
      const endD = endDayNum.slice(6, 8)
      const endYNumber = endY + '-' + endM + '-' + endD
      setEndDate(endYNumber)

      const startDay = String(infoData.req_start_date)

      const startY = startDay.slice(0, 4)
      const startM = startDay.slice(4, 6)
      const startD = startDay.slice(6, 8)

      setStartDate(startM + '월 ' + startD + '일')
    }
  }, [infoData])

  return (
    <div className="dj_pick_wrap">
      {/* {bestData && bestData.is_best === 1 ? (
        <p className="best_dj_box">
          <span>{bestData.mem_nick}</span>님은
          <br />
          현재 베스트 스페셜 DJ입니다.
          <br />
          일반 회원분들과 달리 아래 유지조건만 충족하면
          <br />
          다음 달 베스트 스페셜 DJ 자격이 자동 유지됩니다.
        </p>
      ) : (
        <></>
      )} */}

      <div className="inner_round">
        {/* {bestData && bestData.is_best === 1 ? (
          <div className="dj_pick_item">
            <img
              src={`${IMG_SERVER}/event/specialdj/common/title01_best.png`}
              width={253}
              className="title"
              alt="베스트 스페셜DJ 선발 방식"
            />
            <br />
            <img src={`${IMG_SERVER}/event/specialdj/common/img_step_best.png`} width={148} alt="step" />
          </div>
        ) : ( */}
        <div className="dj_pick_item">
          <img src={`${IMG_SERVER}/event/specialdj/common/title01.png`} width={192} className="title" alt="스페셜DJ 선발 방식" />
          <br />
          <img src={`${IMG_SERVER}/event/specialdj/common/img_step.png`} alt="step" className="method" />
        </div>
        {/* )} */}

        <div className="dj_pick_item">
          {/* {bestData && bestData.is_best === 1 ? (
            <img src={`${IMG_SERVER}/event/specialdj/common/title02_best.png`} width={120} className="title" alt="심사 기한" />
          ) : ( */}
          <img src={`${IMG_SERVER}/event/specialdj/common/title02.png`} width={120} className="title" alt="접수 기한" />
          {/* )} */}

          <div className="end_date_box">
            {infoData !== '' && endDate !== null && `${startDate} ~ ${endDate.split('-')[1]}월 ${endDate.split('-')[2]}일`}
            <br />
            <p>({infoData.condition_end_date && eventEnd()})</p>
          </div>
        </div>

        <img src={`${IMG_SERVER}/event/specialdj/common/title03.png`} className="title" width={120} alt="유지 조건" />
        <ul className="condition_list">
          {conditionData.conditionList &&
            conditionData.conditionList.map((item, index) => {
              const {condition, title, subtitle, value} = item
              return (
                <li key={index} className="condition_item">
                  <div className="title">
                    {title}
                    {subtitle != undefined ? <br /> : ''}
                    {subtitle}
                    <br />({value})
                  </div>
                  {/* <div className={`check ${bestData.is_best === 1 ? 'best' : ''} ${condition === 1 ? 'active' : ''}`}></div> */}
                  <div className={`check ${condition === 1 ? 'active' : ''}`}></div>
                </li>
              )
            })}
        </ul>

        <img
          src={`${IMG_SERVER}/event/specialdj/common/img_cont06.png`}
          className="extraPoint"
          alt="잠깐! 스페셜DJ 가산점을 아시나요? 스페셜DJ 가산점은 스페셜DJ 선정에 큰 영향을 주며 실시간 랭킹 1~3위 달성 시 획득하게 됩니다."
        />

        <div className="btnWrap">
          {/* {bestData.is_best === 0 && (
            <> */}
          {conditionData.already === 0 ? (
            <>
              {activeState ? (
                <button onClick={() => setSendPop(true)}>
                  <img src={`${IMG_SERVER}/event/specialdj/common/btn_apply.png`} alt="스페셜DJ 지원하기" />
                </button>
              ) : (
                <button disabled>
                  <img src={`${IMG_SERVER}/event/specialdj/common/btn_apply_next.png`} alt="다음에 지원해주세요" />
                </button>
              )}
            </>
          ) : (
            <button disabled>
              <img src={`${IMG_SERVER}/event/specialdj/common/btn_apply_already.png`} alt="이미 지원하셨습니다" />
            </button>
          )}
          {/* </>
          )} */}
        </div>
      </div>
    </div>
  )
}
