import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {IMG_SERVER} from 'context/config'
import {Context} from 'context'
import moment from 'moment'

import Api from 'context/api'

import Header from 'components/ui/new_header'
import Tabmenu from '../components/tabmenu/Tabmenu'
import TabmenuBtn from '../components/tabmenu/TabmenuBtn'
import DjContent from './content/DjContent'
import FanContent from './content/FanContent'
import PopupNotice from './content/PopupNotice'

import './style.scss'

const tabmenu1 = 'dj'
const tabmenu2 = 'fan'

const GoodStart = () => {
  const history = useHistory()
  const context = useContext(Context)
  const [djRankInfo, setDjRankInfo] = useState([])
  const [tabContent, setTabContent] = useState({name: tabmenu1}) // dj, fan

  const [noticePopInfo, setNoticePopInfo] = useState({open: false})

  let pagePerCnt = 50;
  // 조회 API
  const fetchGoodStartDjInfo = () => {
    const param = {
      pageNo: 1,
      pagePerCnt: pagePerCnt
    }
    Api.getGoodStartDjInfo(param).then((res) => {
      if (res.code === '00000') {
        setDjRankInfo(res.data.eventNoInfo)
      } else {
        console.log(res.message);
      }
    })
  }

  // 팝업 열기 닫기 이벤트
  const popupOpen = () => {
    setNoticePopInfo({...noticePopInfo, open: true})
  }

  const popupClose = () => {
    setNoticePopInfo({...noticePopInfo, open: false})
  }

  // 페이지 셋팅
  useEffect(() => {
    if (!context.token.isLogin) {
      history.push('/login')
    } else {
      fetchGoodStartDjInfo()
    }
  }, [])
  
  // 페이지 시작
  return (
    <div id="goodStart">
      <Header title="이벤트" />
      {djRankInfo.map((data, index) => {
        const {start_date, end_date, good_no} = data
        const eventStart = Number(moment(start_date).format('YYMMDD')) <= Number(moment().format('YYMMDD'))
        const eventEnd = Number(moment(end_date).format('YYMMDD')) < Number(moment().format('YYMMDD'))
        return (
          <React.Fragment key={index}>
            {eventStart === true && eventEnd !== true &&
              <img src={`${IMG_SERVER}/event/goodstart/topImg-${good_no}.png`} className="bgImg" />
            }
          </React.Fragment>
        )
      })}
      <Tabmenu tab={tabContent.name}>
        <TabmenuBtn tabBtn1={tabmenu1} tabBtn2={tabmenu2} tab={tabContent.name} setTab={setTabContent} event={'goodstart'} />
      </Tabmenu>
      <section className="bodyContainer">
        <img src={`${IMG_SERVER}/event/goodstart/bodybg-${tabContent.name === tabmenu1 ? 'dj' : 'fan'}.png`} className="bgImg" />
        <div className="notice">
          <button onClick={popupOpen}>
            <img src={`${IMG_SERVER}/event/goodstart/noticeBtn.png`} alt="유의사항" />
          </button>
        </div>
      </section>
			{tabContent.name === tabmenu1 && <DjContent />}
      {tabContent.name === tabmenu2 && <FanContent />}
      {noticePopInfo.open === true && <PopupNotice onClose={popupClose} tab={tabContent.name} />}
    </div>
  )
}

export default GoodStart
