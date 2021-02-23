import React, {useContext, useEffect, useState} from 'react'

import qs from 'query-string'
import Api from 'context/api'
import {Context} from 'context'
import {useHistory} from 'react-router-dom'

import Header from 'components/ui/new_header.js'
import Layout from 'pages/common/layout/new_layout'
import DjCheckBox from './component/dj_check_box'
import PopupCondition from './component/popup_condition'
import PopupGoods from './component/popup_goods'
import PopupMoon from './component/popup_moon'
import PopupSend from './component/popup_send'

import './index.scss'

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

  const eventDateCheck = () => {
    let today = new Date()
    let eventYear = today.getFullYear()
    let eventMonth = today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1

    if (parameter.select_year + parameter.select_month !== eventYear.toString() + eventMonth.toString()) {
      context.action.alert({
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
    <Layout status="no_gnb">
      <Header title={infoData.title} />
      <div id="speacial_dj_page">
        <img
          src="https://image.dalbitlive.com/event/specialdj/20210216/common_top_img.png"
          className="top_image"
          alt="우리모두 달빛하여 스페샬디제이 되세"
        />
        <div className="tab_box">
          <button onClick={() => setTabState('support')}>
            <img
              src={`https://image.dalbitlive.com/event/specialdj/20210216/tab_support${tabState === 'support' ? '_on' : ''}.png`}
              alt="지원하기"
            />
          </button>
          <button onClick={() => setTabState('best')}>
            <img
              src={`https://image.dalbitlive.com/event/specialdj/20210216/tab_best${tabState === 'best' ? '_on' : ''}.png`}
              alt="베스트 스디"
            />
          </button>
        </div>
        {tabState === 'support' && (
          <div className="tab_wrap support">
            <div className="support_box">
              <img src="https://image.dalbitlive.com/event/specialdj/20210216/support_img_01.png" />
              <button onClick={() => setConditionPop(true)} className="btn_pick_more">
                <img src="https://image.dalbitlive.com/event/specialdj/20210216/btn_pick_more.png" alt="선발 요건 확인하기" />
              </button>
            </div>
            <div className="support_box">
              <img src="https://image.dalbitlive.com/event/specialdj/20210216/support_img_02.png" />
              <button onClick={() => setGoodsPop(true)} className="btn_goods_more">
                <img src="https://image.dalbitlive.com/event/specialdj/20210216/btn_goods_more.png" alt="굿즈상품 더보기" />
              </button>
            </div>
            <div className="support_box">
              <img src="https://image.dalbitlive.com/event/specialdj/20210223/support_img_03.png" />
              {/* <button onClick={() => setMoonPop(true)} className="btn_support_moon">
                <img
                  src="https://image.dalbitlive.com/event/specialdj/20210216/btn_support_moon@2x.png"
                  alt="활동지원비 확인하기"
                />
              </button> */}
            </div>
            <div className="support_box">
              <img src="https://image.dalbitlive.com/event/specialdj/20210216/support_img_04.png" />
              <button onClick={() => setTabState('best')} className="btn_pick_more">
                <img src="https://image.dalbitlive.com/event/specialdj/20210216/btn_best_more.png" alt="베스트 스디 확인하기" />
              </button>
            </div>
            <div className="support_box">
              <img src="https://image.dalbitlive.com/event/specialdj/20210223/support_img_05.png" />
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
                  <img src="https://image.dalbitlive.com/event/specialdj/20210216/btn_login.png" alt="로그인" />
                </button>
              </div>
            )}
          </div>
        )}
        {tabState === 'best' && (
          <div className="tab_wrap best">
            <img src="https://image.dalbitlive.com/event/specialdj/20210223/best_img.png" className="top_image" />
          </div>
        )}

        {conditionPop && <PopupCondition setConditionPop={setConditionPop} />}
        {goodsPop && <PopupGoods setGoodsPop={setGoodsPop} />}
        {moonPop && <PopupMoon setMoonPop={setMoonPop} />}
        {sendPop && <PopupSend setSendPop={setSendPop} />}
      </div>
    </Layout>
  )
}
