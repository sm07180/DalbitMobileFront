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

const broadcastWrap = (props) =>{
  const [tabType, setTabType] = useState(tabmenu[3])
  const [bottomSlide, setBottomSlide] = useState(false)

  return (
    <>
      <section className="periodWrap">
        <InputItems title="조회기간" button={'월간'} btnClass={'periodBtn'} onClick={()=>{setBottomSlide(!bottomSlide)}}>
          <input type="button" value="2022-01-02 ~ 2022-01-08" onClick={()=>{setBottomSlide(!bottomSlide)}} />
        </InputItems>
      </section>
      <section className="summaryWrap">
        <div className="cntTitle">방송요약</div>
          <div className="summaryList">
            <i className="icon timeBroadcast"></i>
            <div>방송시간</div>
            <div className="amount">{Utility.addComma(123123)}</div>
          </div>
          <div className="summaryList">
            <i className="icon byeol"></i>
            <div>받은 별</div>
            <div className="amount">{Utility.addComma(123123)}</div>
          </div>
          <div className="summaryList">
            <i className="icon like"></i>
            <div>좋아요</div>
            <div className="amount">{Utility.addComma(123123)}</div>
          </div>
          <div className="summaryList">
            <i className="icon listen"></i>
            <div>시청자</div>
            <div className="amount">{Utility.addComma(123123)}</div>
          </div>
      </section>
      <section className="detailWrap">
        <div className="cntTitle">상세내역</div>
        <div className="broadcastDetail">
          <div className="dateBox">
            <div>2022-01-02</div>
            <div className="light">17:30 ~ 19:00 (90분)</div>
          </div>
          <div className="contentBox">
            <div className='content'>
              <div>{Utility.addComma(123123)}</div>
              <div className='light'>받은 별</div>
            </div>
            <div className='content'>
              <div>{Utility.addComma(123123)}</div>
              <div className='light'>좋아요</div>
            </div>
            <div className='content'>
              <div>{Utility.addComma(123123)}</div>
              <div className='light'>최다시청자</div>
            </div>
          </div>
        </div>
        <div className="broadcastDetail">
          <div className="dateBox">
            <div>2022-01-02</div>
            <div className="light">17:30 ~ 19:00 (90분)</div>
          </div>
          <div className="contentBox">
            <div className='content'>
              <div>{Utility.addComma(123123)}</div>
              <div className='light'>받은 별</div>
            </div>
            <div className='content'>
              <div>{Utility.addComma(123123)}</div>
              <div className='light'>좋아요</div>
            </div>
            <div className='content'>
              <div>{Utility.addComma(123123)}</div>
              <div className='light'>최다시청자</div>
            </div>
          </div>
        </div>
      </section>
      {bottomSlide &&
        <PopSlide title="기간 설정" setPopSlide={setBottomSlide}>
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
        </PopSlide>
      }
    </>
  )
}

export default broadcastWrap