import React, {useState} from 'react'

//global components
import InputItems from 'components/ui/inputItems/InputItems'
import PopSlide from 'components/ui/popSlide/PopSlide'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
// components
import Tabmenu from '../../components/tabmenu'

import './report.scss'

const brSumList = [
  {
    img : 'ico_timeBroadcast',
    title : '방송시간',
    amount : '02:41:00'
  },
  {
    img : 'ico_star',
    title : '받은 별',
    amount : '12,311'
  },
  {
    img : 'ico_like',
    title : '좋아요',
    amount : '486'
  },
  {
    img : 'ico_listener',
    title : '시청자',
    amount : '546,234'
  },
]
const tabmenu = ['오늘', '어제', '주간', '월간']

const broadcastWrap = () =>{
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
        {brSumList.length > 0 && (
          brSumList.map((list, index)=>{
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
        <div className="broadcastDetail">
          <div className="dateBox">
            <div>2022-01-02</div>
            <div className="light">17:30 ~ 19:00 (90분)</div>
          </div>
          <div className="contentBox">
            <div className='content'>
              <div>12,245</div>
              <div className='light'>받은 별</div>
            </div>
            <div className='content'>
              <div>10</div>
              <div className='light'>좋아요</div>
            </div>
            <div className='content'>
              <div>94,234</div>
              <div className='light'>최다시청자</div>
            </div>
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

export default broadcastWrap