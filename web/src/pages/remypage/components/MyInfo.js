import React, {useState,useEffect} from 'react'

// global components
import LevelItems from '../../../components/ui/levelItems/LevelItems'
import SubmitBtn from '../../../components/ui/submitBtn/SubmitBtn'
import PopSlide from "../../../components/ui/popSlide/PopSlide";

const MyInfo = (props) => {
  const {data} = props
  const [popSlide, setPopSlide] = useState(true);
  
  return (
    <>
      <div className="textWrap">
        <div className='text'>
          <span><strong>{data?.nickNm}</strong>님</span>
          <span>오늘 즐거운 방송해볼까요?</span>
        </div>
        <div className="info">
          <em className="level" onClick={() => setPopSlide(true)}>Lv{data?.level}</em>
          <span className='userId'>{data?.memId}</span>
        </div>
        <div className="count">
          <i>팬</i>
          <span>{data?.fanCnt}</span>
          <i>스타</i>
          <span>{data?.starCnt}</span>
          <i>좋아요</i>
          <span>{data?.likeTotCnt}</span>
        </div>
      </div>
      <div className="photo">
        {data && <img src={data.profImg?.thumb150x150} alt="" />}
      </div>
      {popSlide &&
        <PopSlide title="내 레벨" setPopSlide={setPopSlide}>
          <section className="myLevelInfo">
            <div className="infoItem">
              <LevelItems data={data?.level} />
              <span>{data?.grade}</span>
              <p>{data?.expRate}%</p>
            </div>
            <div className="levelGauge">
              <span className="gaugeBar" style={{width:`${data?.expRate}%`}}></span>
            </div>
            <div className="exp">다음 레벨까지 {data?.expNext} EXP 남음</div>
            <SubmitBtn text="확인" />
          </section>
        </PopSlide>
      }
    </>
  )
}

export default MyInfo
