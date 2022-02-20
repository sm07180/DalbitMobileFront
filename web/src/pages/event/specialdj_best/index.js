import React, {useContext, useEffect, useState} from 'react'

import qs from 'query-string'
import Api from 'context/api'
import {Context} from 'context'
import {useHistory} from 'react-router-dom'

import Header from 'components/ui/header/Header'
import Layout from 'pages/common/layout/new_layout'
import DjCheckBox from './component/dj_check_box'
import PopupCondition from './component/popup_condition'
import PopupGoods from './component/popup_goods'
import PopupMoon from './component/popup_moon'
import PopupSend from './component/popup_send'

import './index.scss'
import {IMG_SERVER} from 'context/config'

export default function SpecialDjBest() {
  const context = useContext(Context)
  const parameter = qs.parse(location.search)
  const history = useHistory()

  const [conditionData, setConditionData] = useState({})
  const [infoData, setInfoData] = useState({})
  const [bestData, setBestData] = useState({})
  const [tabState, setTabState] = useState('support') //support, best
  const [conditionPop, setConditionPop] = useState(false)
  const [goodsPop, setGoodsPop] = useState(false)
  const [moonPop, setMoonPop] = useState(false)
  const [sendPop, setSendPop] = useState(false)

  const specialDjDate = parameter.select_year + parameter.select_month

  const eventDateCheck = () => {
    let today = new Date()
    let eventYear = today.getFullYear()
    let eventMonth = today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1

    if (parameter.select_year + parameter.select_month !== eventYear.toString() + eventMonth.toString()) {
      context.action.alert_no_close({
        msg: `이벤트 기간이 아닙니다.`,
        callback: () => {
          history.goBack()
        }
      })
    }
  }

  async function getSpecialDj() {
    const res = await Api.event_specialdj({
      data: {
        select_year: parameter.select_year,
        select_month: parameter.select_month
      }
    })

    const {result, data, message} = res
    if (result === 'success') {
      if (data.specialDjCondition !== undefined) {
        setConditionData(data.specialDjCondition)
      }
      setInfoData(data.eventInfo)
      setBestData(data.userInfo)
    } else {
      context.action.alert({
        msg: message,
        callback: () => {
          history.goBack()
        }
      })
    }
  }

  //----------------------
  useEffect(() => {
    eventDateCheck()
    getSpecialDj()
  }, [context.token.isLogin])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [tabState])

  return (
    <div id="speacial_dj_page">
      <Header title={infoData && infoData.title} type="back" />
      <img
        src={`${IMG_SERVER}/event/specialdj/common/img_visual-1.png`}
        className="top_image"
        alt="우리모두 달빛하여 스페샬디제이 되세"
      />
      <div className="tab_box">
        <button onClick={() => setTabState('support')}>
          <img
            src={`${IMG_SERVER}/event/specialdj/common/tab_support${tabState === 'support' ? '_on' : ''}.png`}
            alt="지원하기"
          />
        </button>
        <button onClick={() => setTabState('best')}>
          <img src={`${IMG_SERVER}/event/specialdj/common/tab_best${tabState === 'best' ? '_on' : ''}.png`} alt="베스트 스디" />
        </button>
      </div>
      {tabState === 'support' && (
        <div className="tab_wrap support">
          <div className="support_box padding">
            <img src={`${IMG_SERVER}/event/specialdj/common/img_cont01-1.png`} alt="스페셜 DJ 설명" />
            {/* <button onClick={() => setConditionPop(true)} className="btn_pick_more">
              <img src={`${IMG_SERVER}/event/specialdj/common/btn_check.png`} alt="선발 요건 확인하기" />
            </button> */}
          </div>
          <div className="support_box">
            <h3 className="tit">
              <img src={`${IMG_SERVER}/event/specialdj/common/tit_cont02.png`} alt="스페셜 DJ 혜택" />
            </h3>
            {/* <img src={`${IMG_SERVER}/event/specialdj/common/img_cont02.png`} alt="스페셜 DJ 혜택" />
            <button onClick={() => setGoodsPop(true)} className="btn_goods_more">
              <img src={`${IMG_SERVER}/event/specialdj/common/btn_goods.png`} alt="굿즈상품 더보기" />
            </button> */}
          </div>
          <div className="support_box">
            <img src={`${IMG_SERVER}/event/specialdj/common/img_cont03_0618.png`} alt="스폐셜 DJ 혜택 상세보기" />
            {/* <button onClick={() => setMoonPop(true)} className="btn_support_moon">
                <img
                  src={`${IMG_SERVER}/event/specialdj/common/btn_support_moon.png`}
                  alt="활동지원비 확인하기"
                />
              </button> */}
          </div>
          <div className="support_box padding">
            <img src={`${IMG_SERVER}/event/specialdj/common/img_cont04.png`} alt="베스트 스페셜 DJ 설명" />
            <button onClick={() => setTabState('best')} className="btn_pick_more">
              <img src={`${IMG_SERVER}/event/specialdj/common/btn_bestdj.png`} alt="베스트 스디 확인하기" />
            </button>
          </div>
          <div className="support_box padding">
            {/* <img src={`${IMG_SERVER}/event/specialdj/common/img_cont05.png`} alt="스페셜 DJ 유의 사항" /> */}
            <h4 className="tit">
              <img src={`${IMG_SERVER}/event/specialdj/common/tit_notice.png`} alt="기억해 주세요" />
            </h4>
            <ul className="notice_list">
              <li>달라의 스페셜 DJ는 월 1회, 매월 마지막 일자에 발표합니다.</li>
              <li>달라의 스페셜 DJ는 1개월 동안 유지됩니다.</li>
              <li>스페셜 DJ 유지 기간은 정책에 의거, 유지 기간의 변경이 있을 수 있습니다.</li>
              <li>스페셜 DJ 선발 후 운영원칙을 상습/의도적으로 위반하는 경우 자격이 박탈 될 수 있습니다.</li>
              <li>지원 요건을 충족해도 스페셜 DJ에 미지원한 DJ들은 스페셜 DJ에 선정되지 않습니다.</li>
              <li>스페셜 DJ 부스터 혜택은 별이 지급되지 않습니다.</li>
              <li>스페셜 DJ 활동지원비는 스페셜 DJ 발표 후 다음날 (영업일 기준) 지급해드립니다.</li>
              <li>스페셜 DJ 혜택은 추후 조정될 수 있습니다.</li>
            </ul>
          </div>

          {context.token.isLogin && conditionData ? (
            <DjCheckBox infoData={infoData} conditionData={conditionData} bestData={bestData} setSendPop={setSendPop} />
          ) : (
            <div className="btnWrap login">
              <button
                className="btn_login"
                onClick={() => {
                  history.push({
                    pathname: '/login',
                    state: {
                      state: 'event/specialdj?select_year=' + parameter.select_year + '&select_month=' + parameter.select_month
                    }
                  })
                }}>
                <img src={`${IMG_SERVER}/event/specialdj/common/btn_login.png`} alt="로그인" />
              </button>
            </div>
          )}
        </div>
      )}
      {tabState === 'best' && (
        <div className="tab_wrap best">
          <img
            src={`${IMG_SERVER}/event/specialdj/common/img_bestdj_1005-1.png`}
            alt="베스트 스페셜 DJ 이미지"
            className="top_image"
          />
          <div className="support_box padding">
            <h4 className="tit">
              <img src={`${IMG_SERVER}/event/specialdj/common/tit_notice.png`} alt="기억해 주세요" />
            </h4>
            <ul className="notice_list best">
              <li>베스트 스페셜 DJ의 경우도 [프로필 &gt; 스페셜 DJ 약력]과 [랭킹 &gt; 명예의 전당]은 스페셜 DJ로 표시됩니다.</li>
              <li>베스트 스페셜 DJ 활동지원비는 매월 1일 스페셜 DJ 선발 발표 후 (영업일 기준) 오전 중 지급해드립니다.</li>
              <li>현금은 별로 환산(환전수수료 혜택 5% 반영)해서 지급됩니다.</li>
              <li>베스트 스페셜 DJ 혜택은 추후 조정될 수 있습니다.</li>
              <li>베스트 스페셜 DJ 아이디 양도(공동 사용)는 불가하며 제재 대상이 됩니다.</li>
              <li>푸시 알림은 1:1문의를 통해<br/>방송(이벤트/기념일/콘텐츠 방송 한정) 예정 시간, 제목 및 내용(각 20글자 이내)을 보내주시면 검수 후 발송됩니다.</li>
            </ul>
          </div>
        </div>
      )}

      {conditionPop && <PopupCondition setConditionPop={setConditionPop} />}
      {/* {goodsPop && <PopupGoods setGoodsPop={setGoodsPop} />} */}
      {moonPop && <PopupMoon setMoonPop={setMoonPop} />}
      {sendPop && <PopupSend setSendPop={setSendPop} />}
    </div>
  )
}
