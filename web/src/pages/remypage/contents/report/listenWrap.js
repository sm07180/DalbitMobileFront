import React, {useState} from 'react'
import Utility from 'components/lib/utility'

//global components
import InputItems from 'components/ui/inputItems/InputItems'
import PopSlide from 'components/ui/popSlide/PopSlide'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
// components
import Tabmenu from '../../components/tabmenu'
// contents
import DatePicker from './DatePicker'

import './report.scss'

const tabmenu = ['오늘', '어제', '주간', '월간']

const ListenWrap = (props) =>{
  const [tabType, setTabType] = useState(tabmenu[3])
  const [bottomSlide, setBottomSlide] = useState(false);

  return(
    <>
      <section className="periodWrap">
        <InputItems title="조회기간" button={'월간'} btnClass={'periodBtn'} onClick={()=>{setBottomSlide(!bottomSlide)}}>
          <input type="button" value="2022-01-02 ~ 2022-01-08" onClick={()=>{setBottomSlide(!bottomSlide)}} />
        </InputItems>
      </section>
      <section className="summaryWrap">
        <div className="cntTitle">방송요약</div>
        <div className="summaryList">
          <i className="icon timeListen"></i>
          <div>청취시간</div>
          <div className="amount">{Utility.addComma(123123)}</div>
        </div>
        <div className="summaryList">
          <i className="icon dal"></i>
          <div>달 선물</div>
          <div className="amount">{Utility.addComma(123123)}</div>
        </div>
      </section>
      <section className="detailWrap">
        <div className="cntTitle">상세내역</div>
        <div className="listenDetail">
          <div className="contentBox">
            <div>금 옥 🌱</div>
            <div>
              <span className='date'>2022-01-02</span>
              <span className="light"><span>17:30</span> ~ <span>19:00</span>(90분)</span>
            </div>
          </div>
          <div className="contentBox">
            <div className="amount">{Utility.addComma(123123)}</div>
            <div className="light">선물 준 달</div>
          </div>
        </div>
        <div className="listenDetail">
          <div className="contentBox">
            <div>금 옥 🌱</div>
            <div>
              <span className='date'>2022-01-02</span>
              <span className="light"><span>17:30</span> ~ <span>19:00</span>(90분)</span>
            </div>
          </div>
          <div className="contentBox">
            <div className="amount">{Utility.addComma(123123)}</div>
            <div className="light">선물 준 달</div>
          </div>
        </div>
      </section>
      {bottomSlide &&
        <PopSlide title="기간 설정" setPopSlide={setBottomSlide}>
          <section className="dataSetting">
            <Tabmenu data={tabmenu} tab={tabType} setTab={setTabType} />
            <InputItems>
              <DatePicker />
              <span className="iconCalendar"></span>
            </InputItems>
            <InputItems>
              <DatePicker />
              <span className="iconCalendar"></span>
            </InputItems>
            <SubmitBtn text="기간적용" />
          </section>
        </PopSlide>
      }
    </>
  )
}

export default ListenWrap