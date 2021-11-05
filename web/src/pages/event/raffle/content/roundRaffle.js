import React, {useState, useEffect, useCallback} from 'react'
import Utility from "components/lib/utility";
import Api from 'context/api'

export default (props) => {
  const { tabContent } = props;
  const [myRoundCouponCnt, setMyRoundCouponCnt] = useState(0); // 회차별 내 응모 횟수
  const [myRoundConditionStatus, setMyRoundConditionStatus] = useState(0);
  const [roundInfos, setRoundInfos] = useState([]);
  const [roundDuration, setRoundDuration] = useState(""); // 현재 회차

  const getRoundRaffleInfo = useCallback(async () => {
    const {code, data} = await Api.getRaffleEventRoundInfo();
    console.log(code, data);
    if(code === '00000') {
      setMyRoundConditionStatus(data.myRoundConditionStatus);
      setMyRoundCouponCnt(data.myRoundCouponCnt);
      setRoundInfos(data.itemInfo);
      setRoundDuration(data.roundDuration);
    }
  }, []);

  useEffect(() => {
    if(tabContent === 'round') {
      getRoundRaffleInfo();
    }
  }, [tabContent]);

  return (
    <div id="round" style={{display: `${tabContent === 'round' ? 'block': 'none'}`}}>
      <section className="section-1">
        <div className="title">
          {roundInfos[0] && roundInfos[0].evt_no}
          <img src="https://image.dalbitlive.com/event/raffle/round-title-1.png" alt="회차" />
        </div>
        <p>{roundDuration}</p>
        <img
          src="https://image.dalbitlive.com/event/raffle/round-txt-1.png"
          className="txt"
          alt="매회 경품에 응모한 분들 중 추첨을 통해 선물을 드립니다."
        />
      </section>
      <section className="section-2">
        <div className="title">
          {roundInfos[0] && roundInfos[0].evt_no}
          <img src="https://image.dalbitlive.com/event/raffle/round-title-2.png" alt="" />
          <span>{Utility.addComma(myRoundCouponCnt)}</span>개
        </div>
        <div className="subTitle">
          <img src="https://image.dalbitlive.com/event/raffle/subtitle-1.png" alt="당첨 가능 현황 :" />
          {myRoundConditionStatus}
          <img src="https://image.dalbitlive.com/event/raffle/subtitle-2.png" alt="가지 참여 중" />
        </div>
        <div className="table">
          <div className="th">
            <img src="https://image.dalbitlive.com/event/raffle/table-1.png" alt="선물" />
          </div>
          <div className="th">
            <img src="https://image.dalbitlive.com/event/raffle/table-2.png" alt="참여여부" />
          </div>
          <div className="th">
            <img src="https://image.dalbitlive.com/event/raffle/table-3.png" alt="당첨 확률" />
          </div>
          {roundInfos.map((data, index) => {
            return (
              <React.Fragment key={index}>
                <div className="td">
                  <img
                    src={data.fan_week_gift_file_name}
                    alt={`경품이미지${index+1}`}
                  />
                </div>
                <div className="td">
                  <img
                    src={data.presentConditionImg}
                    alt="참여여부"
                  />
                </div>
                <div className="td">{data.fan_week_gift_cnt} / {data.tot_ins_cnt}</div>
              </React.Fragment>
            )
          })}
        </div>
        <img src="https://image.dalbitlive.com/event/raffle/alert.png" className="alert" alt="" />
      </section>
      <section className="section-3">
        <img src="https://image.dalbitlive.com/event/raffle/round-section-3.png" alt="" />
      </section>
      <footer>
        <div className="fTop">
          <img src="https://image.dalbitlive.com/event/raffle/bottomTitle2.png" height="16px" alt="유의사항" />
        </div>
        <ul>
          <li>당첨확률 : 선물 받을 수 있는 사람수 / 달성자 수 </li>
          <li>추첨 프로그램을 통해 공정하게 선정하겠습니다. </li>
          <li>회차당 1계정 1번만 당첨되며, 중복 당첨은 되지 않습니다. </li>
          <li>당첨자는 공지사항을 통해 발표됩니다. </li>
        </ul>
      </footer>
    </div>
  )
}
