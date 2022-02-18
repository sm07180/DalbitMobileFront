import React, {useState,useEffect} from 'react'

// global components
import LevelItems from '../../../components/ui/levelItems/LevelItems'
import SubmitBtn from '../../../components/ui/submitBtn/SubmitBtn'
import PopSlide from "../../../components/ui/popSlide/PopSlide";
import moment from "moment";

const greetingComment = [
  {start: '060000', end: '120000', comment: '굿모닝이에요!'},
  {start: '120000', end: '180000', comment: '점심 메뉴는 뭐였어요?'},
  {start: '180000', end: '240000', comment: '신나는 저녁이에요!'},
  {start: '000000', end: '060000', comment: '일찍 일어났네요?'},
]

const MyInfo = (props) => {
  const {data} = props
  const [popSlide, setPopSlide] = useState(false);
  const [nowComment, setNowComment] = useState('');

  /* time: HH:mm:ss */
  const getHourMinSec = (time) => {
    const splitTime = time.split(':');
    const hour = splitTime[0];
    const min = splitTime[1];
    const sec = splitTime[2];

    return `${hour}${min}${sec}`
  }

  const getNowComment = () => {
    const now = moment().format('HH:mm:ss');
    const nowInfo = getHourMinSec(now);
    _.forEach(greetingComment, (item) => {
      const startTime = parseInt(item.start);
      const endTime = parseInt(item.end);

      if(nowInfo >= startTime && nowInfo < endTime) {
        setNowComment(`${data?.nickNm}님, ${item.comment}`);
      }
    })
  }

  /* 레벨 클릭 */
  const openLevelPop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPopSlide(true)
  }

  const closeLevelPop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPopSlide(false);
  }

  useEffect(() => {
    getNowComment();
  }, []);
  
  return (
    <>
      <div className="textWrap">
        <div className='text'>
          <span>{nowComment}</span>
        </div>
        <div className="info">
          <em className="level" onClick={openLevelPop}>Lv{data?.level}</em>
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
      <div className="photoWrap">
        <div className="photo">
          {data && <img src={data.profImg?.thumb150x150} alt="" />}
        </div>
        <button>프로필 보기</button>
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
            <SubmitBtn text="확인" onClick={closeLevelPop} />
          </section>
        </PopSlide>
      }
    </>
  )
}

export default MyInfo
