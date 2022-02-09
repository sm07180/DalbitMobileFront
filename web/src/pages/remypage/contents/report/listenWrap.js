import React, {useState} from 'react'

//global components
import InputItems from 'components/ui/inputItems/InputItems'
import PopSlide from 'components/ui/popSlide/PopSlide'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
// components
import Tabmenu from '../../components/tabmenu'

import './report.scss'

const listenSumList = [
  {
    img : 'ico_timeListen',
    title : '청취시간',
    amount : '02:41:00'
  },
  {
    img : 'ico_dal',
    title : '달 선물',
    amount : '12,311'
  }
]
const tabmenu = ['오늘', '어제', '주간', '월간']

const listenWrap = () =>{
  const [tabType, setTabType] = useState(tabmenu[3])
  const [bottomSlide, setBottomSlide] = useState(false);

  return(
    <>
      <section className="periodWrap">
        <div className="cntTitle">조회기간</div>
        <InputItems button={'월간'} btnClass={'periodBtn'} onClick={()=>{setBottomSlide(!bottomSlide)}}>
          <div onClick={()=>{setBottomSlide(!bottomSlide)}}>
            <span>2022-01-02</span> ~ <span>2022-01-08</span>
          </div>
        </InputItems>
      </section>
      <section className="summaryWrap">
        <div className="cntTitle">방송요약</div>
        {listenSumList.length > 0 && (
          listenSumList.map((list, index)=>{
            return(
              <div className="summaryList" key={index}>
                <img className="icon" src={`https://image.dalbitlive.com/mypage/dalla/report/${list.img}.png`}></img>
                <div>{list.title}</div>
                <div className="amount">{list.amount}</div>
              </div>
            )
          })
        )}
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
            <div className="amount">94,243</div>
            <div className="light">선물 준 달</div>
          </div>
        </div>
      </section>
      {bottomSlide &&
        <PopSlide setPopSlide={setBottomSlide}>
          <div className='slideHeader'>기간 설정</div>
          <Tabmenu data={tabmenu} tab={tabType} setTab={setTabType} />
          <InputItems>
            <div>2022-01-02</div>
            <span className="iconCalendar"></span>
          </InputItems>
          <InputItems>
            <div>2022-01-02</div>
            <span className="iconCalendar"></span>
          </InputItems>
          <SubmitBtn text={'기간적용'} />
        </PopSlide>
      }
    </>
  )
}

export default listenWrap